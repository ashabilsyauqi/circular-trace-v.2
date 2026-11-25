#!/usr/bin/env python3
"""
Deploy Circular Coffee Trace (CCT) build output to cPanel host.
Uses custom SSL socket implementation to support Pure-FTPd's multi-line banner
and TLS session control without hanging data channel connections.
"""

import os
import sys
import getpass
import ssl
import socket
import re

# Load .env if present
env_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
if os.path.exists(env_file):
    with open(env_file) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip().strip("'\""))

HOST = os.environ.get("CPANEL_HOST", "202.10.43.69")  # cikaso.dua.rumahweb.net
USER = os.environ.get("CPANEL_USER", "cirp8652")
REMOTE_TARGET_DIR = os.environ.get("CPANEL_DIR", "public_html/circularcoffee.circulartrace.id")
LOCAL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dist")


class RobustFTPClient:
    def __init__(self, host, timeout=60):
        self.host = host
        self.timeout = timeout
        self.raw_sock = None
        self.sock = None
        self.file = None

    def connect_and_login(self, username, password):
        print(f"\n🔌 Menghubungkan ke FTP {self.host}:21...")
        self.raw_sock = socket.create_connection((self.host, 21), timeout=self.timeout)
        self.file = self.raw_sock.makefile("r", encoding="latin-1")

        # Read initial multi-line welcome banner
        self._read_resp()

        # Negotiate AUTH TLS
        self.raw_sock.sendall(b"AUTH TLS\r\n")
        auth_resp = self.file.readline().strip()
        if not auth_resp.startswith("234"):
            raise RuntimeError(f"Server menolak AUTH TLS: {auth_resp}")

        # Wrap control connection with TLS
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        self.sock = ctx.wrap_socket(self.raw_sock, server_hostname=self.host)
        self.sock.settimeout(self.timeout)
        self.file = self.sock.makefile("r", encoding="latin-1")
        print("🔒 Jalur kendali TLS terenkripsi berhasil aktif!")

        # Login
        user_resp = self.send(f"USER {username}")
        if user_resp.startswith("331"):
            pass_resp = self.send(f"PASS {password}")
            if not pass_resp.startswith("230"):
                raise RuntimeError(f"Gagal otentikasi kata sandi: {pass_resp}")
        elif not user_resp.startswith("230"):
            raise RuntimeError(f"Gagal otentikasi user: {user_resp}")

        print(f"🔓 Berhasil masuk sebagai [{username}]!")

        # Prepare channel
        self.send("PBSZ 0")
        self.send("PROT C")  # Clear data channel prevents TLS session reuse hangs
        self.send("TYPE I")  # 8-bit binary mode

    def _read_resp(self):
        lines = []
        first = self.file.readline()
        if not first:
            raise ConnectionResetError("Koneksi terputus dari server.")
        first = first.strip()
        lines.append(first)
        code = first[:3]
        if len(first) >= 4 and first[3] == "-":
            while True:
                nxt = self.file.readline()
                if not nxt:
                    break
                nxt = nxt.strip()
                lines.append(nxt)
                if len(nxt) >= 4 and nxt[:3] == code and nxt[3] == " ":
                    break
        return lines[-1]

    def send(self, cmd):
        self.sock.sendall((cmd + "\r\n").encode("latin-1"))
        return self._read_resp()

    def ensure_remote_dir(self, remote_dir):
        parts = [p for p in remote_dir.strip("/").split("/") if p]
        curr = ""
        for p in parts:
            curr += "/" + p
            resp = self.send(f"CWD {curr}")
            if not resp.startswith("250"):
                self.send(f"MKD {curr}")
                self.send(f"CWD {curr}")

    def get_remote_size(self, remote_dir, filename):
        self.ensure_remote_dir(remote_dir)
        resp = self.send(f"SIZE {filename}")
        if resp.startswith("213"):
            try:
                return int(resp.split()[1])
            except (IndexError, ValueError):
                return -1
        return -1

    def upload_file(self, local_path, remote_dir, filename):
        self.ensure_remote_dir(remote_dir)

        # Enter Passive Mode
        pasv_resp = self.send("PASV")
        m = re.search(r"\((\d+),(\d+),(\d+),(\d+),(\d+),(\d+)\)", pasv_resp)
        if not m:
            raise RuntimeError(f"Format respon PASV tidak dikenali: {pasv_resp}")

        ip = ".".join(m.groups()[:4])
        port = int(m.group(5)) * 256 + int(m.group(6))

        # Open data connection
        data_sock = socket.create_connection((ip, port), timeout=self.timeout)

        # Send STOR command
        stor_resp = self.send(f"STOR {filename}")
        if not (stor_resp.startswith("150") or stor_resp.startswith("125")):
            data_sock.close()
            raise RuntimeError(f"Gagal memulai upload: {stor_resp}")

        # Stream binary chunks
        with open(local_path, "rb") as fp:
            while chunk := fp.read(65536):
                data_sock.sendall(chunk)

        try:
            data_sock.shutdown(socket.SHUT_WR)
        except Exception:
            pass
        data_sock.close()

        # Read completion response (226 Transfer complete)
        trans_resp = self._read_resp()
        if not trans_resp.startswith("226"):
            raise RuntimeError(f"Transfer tidak tuntas: {trans_resp}")

    def close(self):
        try:
            self.send("QUIT")
        except Exception:
            pass
        if self.sock:
            try:
                self.sock.close()
            except Exception:
                pass


def upload_tree(client: RobustFTPClient, local_path: str, remote_target: str):
    file_list = []
    for root, dirs, files in os.walk(local_path):
        for f in files:
            file_list.append((root, f))

    total = len(file_list)
    print(f"🚀 Memulai sinkronisasi {total} file ke cPanel...\n")

    uploaded = 0
    skipped = 0

    for idx, (root, filename) in enumerate(file_list, 1):
        rel_dir = os.path.relpath(root, local_path)
        if rel_dir == ".":
            target_dir = "/" + remote_target.strip("/")
            display_name = filename
        else:
            target_dir = "/" + remote_target.strip("/") + "/" + rel_dir.replace("\\", "/")
            display_name = f"{rel_dir}/{filename}"

        local_file = os.path.join(root, filename)
        local_size = os.path.getsize(local_file)
        size_kb = local_size / 1024

        # For files other than html/php, check if size already matches on remote
        is_html_or_php = filename.endswith(".html") or filename.endswith(".php")
        if not is_html_or_php:
            remote_size = client.get_remote_size(target_dir, filename)
            if remote_size == local_size:
                sys.stdout.write(f"  ⚡ [{idx}/{total}] {display_name} ({size_kb:.1f} KB) - Sama persis (Dilewati)\n")
                sys.stdout.flush()
                skipped += 1
                continue

        sys.stdout.write(f"  ⬆  [{idx}/{total}] Mengunggah {display_name} ({size_kb:.1f} KB)... ")
        sys.stdout.flush()

        client.upload_file(local_file, target_dir, filename)
        uploaded += 1

        sys.stdout.write("✓ Selesai\n")
        sys.stdout.flush()

    print(f"\n✨ Sukses! {uploaded} file diunggah, {skipped} file identik dilewati.")


def main():
    if not os.path.exists(LOCAL_DIR):
        print(f"❌ Folder 'dist' tidak ditemukan di {LOCAL_DIR}!")
        print("   Jalankan 'npm run build' terlebih dahulu.")
        sys.exit(1)

    password = os.environ.get("CPANEL_PASSWORD") or os.environ.get("CPANEL_PASS")
    if not password:
        if len(sys.argv) > 1:
            password = sys.argv[1]
        else:
            print(f"Host    : {HOST} (Rumahweb - cikaso)")
            print(f"User    : {USER}")
            print(f"Target  : ~/{REMOTE_TARGET_DIR}")
            password = getpass.getpass(f"Masukkan password cPanel untuk [{USER}]: ")

    if not password:
        print("❌ Password tidak boleh kosong.")
        sys.exit(1)

    client = RobustFTPClient(HOST, timeout=60)
    try:
        client.connect_and_login(USER, password)
        upload_tree(client, LOCAL_DIR, REMOTE_TARGET_DIR)
        print("\n🎉 DEPLOY SELESAI!")
        print("🌐 Silakan akses aplikasi di: https://circularcoffee.circulartrace.id\n")
    except Exception as e:
        print(f"\n❌ Gagal upload: {e}")
        sys.exit(1)
    finally:
        client.close()


if __name__ == "__main__":
    main()
