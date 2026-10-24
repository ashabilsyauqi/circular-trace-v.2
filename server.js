import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, 'dist');
const dataDir = path.join(__dirname, 'data');
const usersFilePath = path.join(dataDir, 'users.json');
const PORT = Number(process.env.PORT) || 3032;

// Default Avatars by role
const DEFAULT_AVATARS = {
  petani: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=150&auto=format&fit=crop&q=80',
  pengolah: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  gudang: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  roaster: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
  cafe: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  verifikator: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  superadmin: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

// Ensure data folder exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// In-memory users store
let usersStore = [];

function loadUsersFromDisk() {
  try {
    if (fs.existsSync(usersFilePath)) {
      const raw = fs.readFileSync(usersFilePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        usersStore = parsed;
        console.log(`[Storage] Loaded ${usersStore.length} users from disk.`);
        return;
      }
    }
  } catch (err) {
    console.error('[Storage] Error loading users.json:', err);
  }
  usersStore = [];
}

function saveUsersToDisk() {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(usersStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Storage] Error writing users.json:', err);
  }
}

// Initial load
loadUsersFromDisk();

// Active SSE Clients Set
const sseClients = new Set();

function broadcastSse(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch {
      sseClients.delete(client);
    }
  }
}

// Heartbeat ping every 15s to keep connections alive through Cloudflare tunnel
setInterval(() => {
  const pingPayload = `event: ping\ndata: ${Date.now()}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(pingPayload);
    } catch {
      sseClients.delete(client);
    }
  }
}, 15000);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

function readBodyJson(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 2 * 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  const payload = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });
  res.end(payload);
}

http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = (req.method || 'GET').toUpperCase();

  // Handle CORS Preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    });
    res.end();
    return;
  }

  // --- REALTIME SSE STREAM ---
  if (pathname === '/api/realtime/stream') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'X-Accel-Buffering': 'no',
    });
    res.write(`event: init\ndata: ${JSON.stringify({ users: usersStore, timestamp: Date.now() })}\n\n`);
    sseClients.add(res);

    req.on('close', () => {
      sseClients.delete(res);
    });
    return;
  }

  // --- API ROUTES ---

  // Health check
  if (pathname === '/api/health' && method === 'GET') {
    return sendJson(res, 200, {
      status: 'ok',
      uptime: process.uptime(),
      activeSseClients: sseClients.size,
      totalUsers: usersStore.length,
      pendingCount: usersStore.filter(u => u.status === 'pending_approval').length,
    });
  }

  // GET /api/users
  if (pathname === '/api/users' && method === 'GET') {
    return sendJson(res, 200, {
      success: true,
      count: usersStore.length,
      pendingCount: usersStore.filter(u => u.status === 'pending_approval').length,
      users: usersStore,
      timestamp: Date.now(),
    });
  }

  // POST /api/register
  if (pathname === '/api/register' && method === 'POST') {
    try {
      const body = await readBodyJson(req);
      const name = (body.name || '').trim();
      const email = (body.email || '').trim().toLowerCase();
      const role = body.role || 'petani';
      const organization = (body.organization || '').trim();
      const location = (body.location || '').trim();
      const phone = (body.phone || '').trim() || '0812-0000-0000';
      const bio = (body.bio || '').trim();
      const password = body.password || 'password123';

      if (!name || !email || !organization || !location) {
        return sendJson(res, 400, {
          success: false,
          message: 'Nama, email, lembaga/organisasi, dan lokasi wajib diisi.',
        });
      }

      // Check if email already registered
      const existingUser = usersStore.find(u => u.email && u.email.toLowerCase() === email);
      if (existingUser) {
        return sendJson(res, 400, {
          success: false,
          message: `Email "${email}" sudah terdaftar atas nama ${existingUser.name}. Silakan gunakan email lain.`,
          user: existingUser,
        });
      }

      let cleanUsername = body.username?.trim().toLowerCase();
      if (!cleanUsername) {
        cleanUsername = email.split('@')[0].replace(/[^a-z0-9]/g, '');
      }
      if (!cleanUsername) {
        cleanUsername = `mitra${Math.floor(100 + Math.random() * 900)}`;
      }

      // Unique username check
      if (usersStore.some(u => u.username && u.username.toLowerCase() === cleanUsername)) {
        cleanUsername = `${cleanUsername}${Math.floor(100 + Math.random() * 900)}`;
      }

      const uniqueId = `user-${role}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newUser = {
        id: uniqueId,
        name,
        username: cleanUsername,
        email,
        password,
        role,
        status: 'pending_approval', // Pending ACC by Super Admin Novizar
        registeredAt: new Date().toLocaleString('id-ID'),
        organization,
        location,
        phone,
        avatar: DEFAULT_AVATARS[role] || DEFAULT_AVATARS.roaster,
        balance: 50000000,
        bio: bio || `Pendaftar mitra baru sebagai ${role}`,
      };

      // Add to top of array
      usersStore.unshift(newUser);
      saveUsersToDisk();

      // Realtime broadcast to Novizar and all active screens
      broadcastSse('user_registered', { newUser, totalUsers: usersStore.length });
      broadcastSse('users_updated', { users: usersStore, timestamp: Date.now() });

      console.log(`[Register] New registrant registered: ${newUser.name} (${newUser.email}) - Role: ${newUser.role}`);

      return sendJson(res, 201, {
        success: true,
        message: 'Pendaftaran Anda berhasil dikirim! Akun Anda sedang menunggu persetujuan (ACC) dari Super Admin Novizar. Akses login akan aktif setelah disetujui.',
        user: newUser,
      });
    } catch (err) {
      console.error('[Register] Error handling registration:', err);
      return sendJson(res, 500, { success: false, message: 'Terjadi kesalahan server saat memproses pendaftaran.' });
    }
  }

  // POST /api/users/approve
  if (pathname === '/api/users/approve' && method === 'POST') {
    try {
      const body = await readBodyJson(req);
      const userId = body.userId;
      if (!userId) {
        return sendJson(res, 400, { success: false, message: 'User ID wajib disertakan.' });
      }

      const idx = usersStore.findIndex(u => u.id === userId);
      if (idx === -1) {
        return sendJson(res, 404, { success: false, message: 'Pengguna tidak ditemukan.' });
      }

      usersStore[idx] = {
        ...usersStore[idx],
        status: 'active',
        rejectionReason: undefined,
      };
      saveUsersToDisk();

      const approvedUser = usersStore[idx];
      broadcastSse('user_approved', { user: approvedUser });
      broadcastSse('users_updated', { users: usersStore, timestamp: Date.now() });

      console.log(`[ACC] User approved by Novizar: ${approvedUser.name} (${approvedUser.id})`);

      return sendJson(res, 200, {
        success: true,
        message: `Akun "${approvedUser.name}" berhasil di-ACC dan diaktifkan.`,
        user: approvedUser,
      });
    } catch (err) {
      console.error('[ACC] Error approving user:', err);
      return sendJson(res, 500, { success: false, message: 'Gagal menyetujui akun pengguna.' });
    }
  }

  // POST /api/users/reject
  if (pathname === '/api/users/reject' && method === 'POST') {
    try {
      const body = await readBodyJson(req);
      const { userId, reason } = body;
      const idx = usersStore.findIndex(u => u.id === userId);
      if (idx === -1) {
        return sendJson(res, 404, { success: false, message: 'Pengguna tidak ditemukan.' });
      }

      usersStore[idx] = {
        ...usersStore[idx],
        status: 'rejected',
        rejectionReason: reason || 'Data registrasi belum memenuhi kualifikasi mitra sangrAI.',
      };
      saveUsersToDisk();

      const rejectedUser = usersStore[idx];
      broadcastSse('user_rejected', { user: rejectedUser });
      broadcastSse('users_updated', { users: usersStore, timestamp: Date.now() });

      return sendJson(res, 200, {
        success: true,
        message: `Pendaftaran "${rejectedUser.name}" berhasil ditolak.`,
        user: rejectedUser,
      });
    } catch (err) {
      return sendJson(res, 500, { success: false, message: 'Gagal menolak akun pengguna.' });
    }
  }

  // POST /api/users/delete
  if (pathname === '/api/users/delete' && method === 'POST') {
    try {
      const body = await readBodyJson(req);
      const userId = body.userId;
      const found = usersStore.find(u => u.id === userId);
      if (!found) {
        return sendJson(res, 404, { success: false, message: 'Pengguna tidak ditemukan.' });
      }

      usersStore = usersStore.filter(u => u.id !== userId);
      saveUsersToDisk();

      broadcastSse('user_deleted', { userId });
      broadcastSse('users_updated', { users: usersStore, timestamp: Date.now() });

      return sendJson(res, 200, {
        success: true,
        message: `Data pengguna "${found.name}" berhasil dihapus.`,
      });
    } catch (err) {
      return sendJson(res, 500, { success: false, message: 'Gagal menghapus pengguna.' });
    }
  }

  // POST /api/users/suspend
  if (pathname === '/api/users/suspend' && method === 'POST') {
    try {
      const body = await readBodyJson(req);
      const userId = body.userId;
      const idx = usersStore.findIndex(u => u.id === userId);
      if (idx === -1) {
        return sendJson(res, 404, { success: false, message: 'Pengguna tidak ditemukan.' });
      }

      const nextStatus = usersStore[idx].status === 'suspended' ? 'active' : 'suspended';
      usersStore[idx] = {
        ...usersStore[idx],
        status: nextStatus,
      };
      saveUsersToDisk();

      broadcastSse('users_updated', { users: usersStore, timestamp: Date.now() });

      return sendJson(res, 200, {
        success: true,
        message: `Status akun "${usersStore[idx].name}" kini: ${nextStatus === 'active' ? 'Aktif' : 'Ditangguhkan'}.`,
        user: usersStore[idx],
      });
    } catch (err) {
      return sendJson(res, 500, { success: false, message: 'Gagal mengubah status penangguhan.' });
    }
  }

  // --- STATIC FILE SERVING (SPA) ---
  let reqPath = '/';
  try {
    reqPath = decodeURIComponent(pathname);
  } catch {
    reqPath = '/';
  }
  if (reqPath === '/' || !reqPath) reqPath = '/index.html';
  const safePath = path.normalize(reqPath).replace(/^(\.\.[\\/])+/, '');
  let filePath = path.join(distDir, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      filePath = path.join(distDir, 'index.html');
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
        return;
      }
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': ext === '.html' ? 'no-cache, no-store, must-revalidate' : 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    });
  });
}).listen(PORT, '0.0.0.0', () => {
  console.log(`Circular Trace server with Realtime Multi-Device Sync online on http://localhost:${PORT}`);
});
