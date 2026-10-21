#!/usr/bin/env python3
"""
Deploy Circular Coffee Trace (CCT) build output to cPanel host.
Uses native Python ftplib (no external dependencies required).
"""

import os
import sys
import getpass
from ftplib import FTP, FTP_TLS, error_perm

HOST = os.environ.get("CPANEL_HOST", "202.10.43.69")  # cikaso.dua.rumahweb.net
USER = os.environ.get("CPANEL_USER", "cirp8652")
REMOTE_TARGET_DIR = os.environ.get("CPANEL_DIR", "public_html/circularcoffee.circulartrace.id")
LOCAL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dist")


def ensure_remote_dir(ftp: FTP, path: str):
    parts = [p for p in path.strip("/").split("/") if p]
    current = ""
    for part in parts:
        current += "/" + part
        try:
            ftp.cwd(current)
        except error_perm:
            try:
                ftp.mkd(current)
                ftp.cwd(current)
            except error_perm:
                pass


def upload_tree(ftp: FTP, local_path: str, remote_target: str):
    print(f"\n📂 Menyiapkan direktori remote: {remote_target}")
    ensure_remote_dir(ftp, remote_target)
    ftp.cwd("/" + remote_target.strip("/"))

    total_files = 0
    uploaded_files = 0

    for root, dirs, files in os.walk(local_path):
        for f in files:
            total_files += 1

    print(f"🚀 Memulai upload {total_files} file ke cPanel...\n")

    for root, dirs, files in os.walk(local_path):
        rel_dir = os.path.relpath(root, local_path)
        if rel_dir == ".":
            target_workdir = "/" + remote_target.strip("/")
        else:
            target_workdir = "/" + remote_target.strip("/") + "/" + rel_dir.replace("\\", "/")

        ensure_remote_dir(ftp, target_workdir)
        ftp.cwd(target_workdir)

        for filename in files:
            file_path = os.path.join(root, filename)
            file_size_kb = os.path.getsize(file_path) / 1024
            display_name = (
                filename if rel_dir == "." else f"{rel_dir}/{filename}"
            )

            sys.stdout.write(f"  ⬆  [{uploaded_files + 1}/{total_files}] Mengunggah {display_name} ({file_size_kb:.1f} KB)... ")
            sys.stdout.flush()

            with open(file_path, "rb") as fp:
                ftp.storbinary(f"STOR {filename}", fp)

            uploaded_files += 1
            sys.stdout.write("✓ Selesai\n")
            sys.stdout.flush()

    print(f"\n✨ Sukses! {uploaded_files} file berhasil diunggah ke cPanel.")


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

    ftp = None
    try:
        print(f"\n🔌 Menghubungkan ke FTP {HOST}:21...")
        try:
            ftp = FTP_TLS(HOST, timeout=15)
            ftp.login(USER, password)
            ftp.prot_p()  # Enforce secure TLS data connection if supported
            print("🔒 Terhubung via FTPS (TLS Terenkripsi)!")
        except Exception as tls_err:
            print(f"⚠️  FTPS info: {tls_err}. Mencoba FTP standard...")
            ftp = FTP(HOST, timeout=15)
            ftp.login(USER, password)
            print("🔓 Terhubung via FTP standard!")

        ftp.set_pasv(True)

        upload_tree(ftp, LOCAL_DIR, REMOTE_TARGET_DIR)

        print("\n🎉 DEPLOY SELESAI!")
        print("🌐 Silakan cek web Anda di: https://circularcoffee.circulartrace.id\n")

    except Exception as e:
        print(f"\n❌ Gagal upload: {e}")
        sys.exit(1)
    finally:
        if ftp:
            try:
                ftp.quit()
            except Exception:
                pass


if __name__ == "__main__":
    main()
