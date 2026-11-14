import { AppUser, UserRole } from '../types/coffee';

/**
 * Daftar role yang memiliki afiliasi resmi dengan Kelompok Tani / Gapoktan
 * dan berhak mengakses informasi hulu ceri kopi segar.
 */
export const KELOMPOK_TANI_ROLES: UserRole[] = [
  'admin_kelompok_tani',
  'ict',
  'petani',
  'pengolah',
];

/**
 * Role yang berhak melakukan transaksi pembelian/alokasi ceri segar
 * untuk dimasukkan ke stasiun pengolahan (wet/dry mill).
 */
export const CHERRY_BUYER_ROLES: UserRole[] = [
  'pengolah',
  'admin_kelompok_tani',
];

/**
 * Memeriksa apakah pengguna memiliki hak akses untuk melihat komoditas Ceri Kopi Segar
 * di dalam Unified Marketplace.
 *
 * Syarat:
 * 1. Pengguna wajib login (tidak anonim / publik).
 * 2. Memiliki salah satu role: admin_kelompok_tani, ict, petani, atau pengolah.
 * 3. Memiliki afiliasi organisasi atau nama kelompok tani.
 */
export const canAccessCherryMarketplace = (user: AppUser | null | undefined): boolean => {
  if (!user) return false;

  const isAllowedRole = KELOMPOK_TANI_ROLES.includes(user.role);
  if (!isAllowedRole) return false;

  // Akun harus memiliki nama kelompok tani atau organisasi mitra yang terdaftar
  const hasAffiliation = Boolean(
    (user.kelompokTaniName && user.kelompokTaniName.trim().length > 0) ||
    (user.organization && user.organization.trim().length > 0)
  );

  return hasAffiliation;
};

/**
 * Memeriksa apakah pengguna berhak melakukan aksi pembelian atau alokasi komoditas ceri segar.
 * Petani dan verifikator dapat melihat, tetapi hanya Pengolah (Mill) dan Admin Kelompok Tani
 * yang dapat mengeksekusi order/alokasi fisik ke stasiun olah.
 */
export const canPurchaseCherry = (user: AppUser | null | undefined): boolean => {
  if (!canAccessCherryMarketplace(user)) return false;
  if (!user) return false;

  return CHERRY_BUYER_ROLES.includes(user.role);
};
