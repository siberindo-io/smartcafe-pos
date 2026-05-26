const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const XLSX = require('xlsx');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR = path.join(__dirname, 'data');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');
const DB_PATH = path.join(DATA_DIR, 'poi_coffee.sqlite');

const SESSION_COOKIE = 'poi_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;
const LOGIN_RATE_WINDOW_MS = Number(process.env.LOGIN_RATE_WINDOW_MS || 15 * 60 * 1000);
const LOGIN_RATE_MAX_ATTEMPTS = Number(process.env.LOGIN_RATE_MAX_ATTEMPTS || 30);
const ACCOUNT_LOCK_THRESHOLD = Number(process.env.ACCOUNT_LOCK_THRESHOLD || 5);
const ACCOUNT_LOCK_DURATION_MS = Number(process.env.ACCOUNT_LOCK_DURATION_MS || 15 * 60 * 1000);
const AUTO_BACKUP_INTERVAL_HOURS = Number(process.env.AUTO_BACKUP_INTERVAL_HOURS || 24);
const MAX_BACKUP_FILES = Number(process.env.MAX_BACKUP_FILES || 30);

const validRoles = new Set(['admin', 'cashier']);
const validStatuses = new Set(['Process', 'Done', 'Cancel']);
const validRanges = new Set(['daily', 'weekly', 'monthly']);

const loginRateByIp = new Map();

const seedProducts = [
  { id: 'P001', name: 'Caffe Latte', category: 'Coffee', price: 25000, icon: 'coffee' },
  { id: 'P002', name: 'Americano', category: 'Coffee', price: 22000, icon: 'coffee' },
  { id: 'P003', name: 'Cappuccino', category: 'Coffee', price: 26000, icon: 'coffee' },
  { id: 'P004', name: 'Espresso', category: 'Coffee', price: 18000, icon: 'coffee' },
  { id: 'P005', name: 'Caramel Latte', category: 'Coffee', price: 28000, icon: 'coffee' },
  { id: 'P006', name: 'Matcha Latte', category: 'Non Coffee', price: 27000, icon: 'non-coffee' },
  { id: 'P007', name: 'Fresh Tea', category: 'Non Coffee', price: 16000, icon: 'non-coffee' },
  { id: 'P008', name: 'Mineral Water', category: 'Non Coffee', price: 8000, icon: 'non-coffee' },
  { id: 'P009', name: 'Croissant', category: 'Snack', price: 18000, icon: 'snack' },
  { id: 'P010', name: 'Chocolate Danish', category: 'Snack', price: 20000, icon: 'snack' },
  { id: 'P011', name: 'Extra Shot', category: 'Add On', price: 7000, icon: 'addon' }
];

const seedInventory = [
  { productId: 'P001', stock: 38, minStock: 12 },
  { productId: 'P002', stock: 41, minStock: 12 },
  { productId: 'P003', stock: 29, minStock: 10 },
  { productId: 'P004', stock: 36, minStock: 10 },
  { productId: 'P005', stock: 24, minStock: 8 },
  { productId: 'P006', stock: 22, minStock: 8 },
  { productId: 'P007', stock: 57, minStock: 20 },
  { productId: 'P008', stock: 73, minStock: 25 },
  { productId: 'P009', stock: 18, minStock: 8 },
  { productId: 'P010', stock: 17, minStock: 8 },
  { productId: 'P011', stock: 44, minStock: 15 }
];

const seedIngredients = [
  {
    id: 'B001',
    name: 'Biji Kopi Arabica',
    category: 'Coffee Beans',
    unit: 'gram',
    stockQty: 5200,
    minStockQty: 1500,
    costPerUnit: 190,
    photoUrl: '',
    description: 'Biji kopi arabica blend house.',
    isActive: true
  },
  {
    id: 'B002',
    name: 'Biji Kopi Robusta',
    category: 'Coffee Beans',
    unit: 'gram',
    stockQty: 3800,
    minStockQty: 1200,
    costPerUnit: 140,
    photoUrl: '',
    description: 'Biji robusta untuk espresso blend.',
    isActive: true
  },
  {
    id: 'B003',
    name: 'Bubuk Matcha',
    category: 'Powder',
    unit: 'gram',
    stockQty: 1200,
    minStockQty: 350,
    costPerUnit: 260,
    photoUrl: '',
    description: 'Bubuk matcha premium untuk minuman non-coffee.',
    isActive: true
  },
  {
    id: 'B004',
    name: 'Susu UHT Full Cream',
    category: 'Dairy',
    unit: 'ml',
    stockQty: 22000,
    minStockQty: 7000,
    costPerUnit: 18,
    photoUrl: '',
    description: 'Susu utama untuk latte dan cappuccino.',
    isActive: true
  },
  {
    id: 'B005',
    name: 'Sirup Vanilla',
    category: 'Syrup',
    unit: 'ml',
    stockQty: 4200,
    minStockQty: 1200,
    costPerUnit: 22,
    photoUrl: '',
    description: 'Sirup vanilla untuk varian flavored latte.',
    isActive: true
  },
  {
    id: 'B006',
    name: 'Gula Cair',
    category: 'Sweetener',
    unit: 'ml',
    stockQty: 5600,
    minStockQty: 1500,
    costPerUnit: 8,
    photoUrl: '',
    description: 'Simple syrup untuk minuman dingin.',
    isActive: true
  },
  {
    id: 'B007',
    name: 'Kentang Frozen',
    category: 'Snack',
    unit: 'gram',
    stockQty: 6200,
    minStockQty: 1800,
    costPerUnit: 34,
    photoUrl: '',
    description: 'Kentang beku untuk menu french fries.',
    isActive: true
  },
  {
    id: 'B008',
    name: 'Bubuk Cokelat',
    category: 'Powder',
    unit: 'gram',
    stockQty: 2100,
    minStockQty: 600,
    costPerUnit: 85,
    photoUrl: '',
    description: 'Bubuk cokelat untuk mocha dan chocolate drink.',
    isActive: true
  },
  {
    id: 'B009',
    name: 'Daun Teh Jasmine',
    category: 'Tea',
    unit: 'gram',
    stockQty: 2400,
    minStockQty: 700,
    costPerUnit: 62,
    photoUrl: '',
    description: 'Daun teh untuk menu fresh tea.',
    isActive: true
  },
  {
    id: 'B010',
    name: 'Es Batu',
    category: 'Utility',
    unit: 'gram',
    stockQty: 18000,
    minStockQty: 5000,
    costPerUnit: 2,
    photoUrl: '',
    description: 'Kebutuhan es untuk minuman dingin.',
    isActive: true
  }
];

const seedTables = [
  { id: 'M1', area: 'Outdoor', status: 'available' },
  { id: 'M2', area: 'Outdoor', status: 'occupied' },
  { id: 'M3', area: 'Outdoor', status: 'reserved' },
  { id: 'M4', area: 'Indoor', status: 'available' },
  { id: 'M5', area: 'Indoor', status: 'available' },
  { id: 'M6', area: 'Indoor', status: 'occupied' },
  { id: 'M7', area: 'Indoor', status: 'available' },
  { id: 'M8', area: 'Indoor', status: 'reserved' }
];

function nowIso() {
  return new Date().toISOString();
}

function createSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

function createPassword(length = 12) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#*!';
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function formatYmdLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatFileTimestamp(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const sec = String(date.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}-${hour}${min}${sec}`;
}

function parseYmdLocal(input) {
  const source = typeof input === 'string' ? input.trim() : '';
  if (!source) return new Date();

  const match = source.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    const error = new Error('Format tanggal harus YYYY-MM-DD');
    error.statusCode = 400;
    throw error;
  }

  const year = Number.parseInt(match[1], 10);
  const month = Number.parseInt(match[2], 10);
  const day = Number.parseInt(match[3], 10);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    const error = new Error('Tanggal tidak valid');
    error.statusCode = 400;
    throw error;
  }

  return date;
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function normalizeRole(role) {
  const value = typeof role === 'string' ? role.trim().toLowerCase() : '';
  if (!validRoles.has(value)) {
    const error = new Error('Role tidak valid (admin/cashier)');
    error.statusCode = 400;
    throw error;
  }
  return value;
}

function normalizeOrderStatus(status) {
  const value = typeof status === 'string' ? status.trim() : '';
  const normalized = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  if (!validStatuses.has(normalized)) {
    const error = new Error('Status order tidak valid');
    error.statusCode = 400;
    throw error;
  }
  return normalized;
}

function normalizeUsername(username) {
  const value = typeof username === 'string' ? username.trim() : '';
  if (!value || value.length < 3 || value.length > 32) {
    const error = new Error('Username harus 3-32 karakter');
    error.statusCode = 400;
    throw error;
  }

  if (!/^[a-zA-Z0-9._-]+$/.test(value)) {
    const error = new Error('Username hanya boleh huruf, angka, titik, underscore, atau dash');
    error.statusCode = 400;
    throw error;
  }

  return value;
}

function normalizeFullName(fullName) {
  const value = typeof fullName === 'string' ? fullName.trim() : '';
  if (!value || value.length < 2 || value.length > 80) {
    const error = new Error('Nama lengkap harus 2-80 karakter');
    error.statusCode = 400;
    throw error;
  }
  return value;
}

function normalizePassword(password) {
  const value = typeof password === 'string' ? password : '';
  if (value.length < 6 || value.length > 120) {
    const error = new Error('Password minimal 6 karakter');
    error.statusCode = 400;
    throw error;
  }
  return value;
}

function normalizeProductId(productId) {
  const value = typeof productId === 'string' ? productId.trim().toUpperCase() : '';
  if (!value || !/^[A-Z0-9_-]{2,24}$/.test(value)) {
    const error = new Error('ID menu tidak valid');
    error.statusCode = 400;
    throw error;
  }
  return value;
}

function normalizeProductName(name) {
  const value = typeof name === 'string' ? name.trim() : '';
  if (!value || value.length < 2 || value.length > 120) {
    const error = new Error('Nama menu harus 2-120 karakter');
    error.statusCode = 400;
    throw error;
  }
  return value;
}

function normalizeProductCategory(category) {
  const value = typeof category === 'string' ? category.trim() : '';
  if (!value || value.length < 2 || value.length > 60) {
    const error = new Error('Kategori menu harus 2-60 karakter');
    error.statusCode = 400;
    throw error;
  }
  return value;
}

function normalizeProductPrice(price) {
  const parsed = Number.parseInt(price, 10);
  if (!Number.isInteger(parsed) || parsed <= 0 || parsed > 2_000_000_000) {
    const error = new Error('Harga menu harus berupa angka positif');
    error.statusCode = 400;
    throw error;
  }
  return parsed;
}

function normalizeStock(stock, fieldLabel = 'Stok') {
  const parsed = Number.parseInt(stock, 10);
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 2_000_000_000) {
    const error = new Error(`${fieldLabel} harus berupa angka >= 0`);
    error.statusCode = 400;
    throw error;
  }
  return parsed;
}

function normalizeProductDescription(description) {
  const value = typeof description === 'string' ? description.trim() : '';
  if (value.length > 300) {
    const error = new Error('Deskripsi menu maksimal 300 karakter');
    error.statusCode = 400;
    throw error;
  }
  return value;
}

function normalizeProductIcon(icon) {
  const value = typeof icon === 'string' ? icon.trim() : '';
  if (value.length > 32) {
    const error = new Error('Icon menu maksimal 32 karakter');
    error.statusCode = 400;
    throw error;
  }
  return value;
}

function normalizeProductPhotoUrl(photoUrl) {
  const value = typeof photoUrl === 'string' ? photoUrl.trim() : '';
  if (!value) return '';

  const isHttp = value.startsWith('http://') || value.startsWith('https://');
  const isDataImage = /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(value);
  if (!isHttp && !isDataImage) {
    const error = new Error('Foto menu harus URL http/https atau data:image base64');
    error.statusCode = 400;
    throw error;
  }

  if (value.length > 2_000_000) {
    const error = new Error('Ukuran foto menu terlalu besar');
    error.statusCode = 400;
    throw error;
  }

  return value;
}

function normalizeMenuActiveFlag(value, fallback = true) {
  const parsed = parseBoolean(value, null);
  if (parsed === null) return fallback;
  return parsed;
}

function normalizeIngredientId(ingredientId) {
  const value = typeof ingredientId === 'string' ? ingredientId.trim().toUpperCase() : '';
  if (!value || !/^[A-Z0-9_-]{2,24}$/.test(value)) {
    const error = new Error('ID bahan tidak valid');
    error.statusCode = 400;
    throw error;
  }
  return value;
}

function normalizeIngredientName(name) {
  const value = typeof name === 'string' ? name.trim() : '';
  if (!value || value.length < 2 || value.length > 120) {
    const error = new Error('Nama bahan harus 2-120 karakter');
    error.statusCode = 400;
    throw error;
  }
  return value;
}

function normalizeIngredientCategory(category) {
  const value = typeof category === 'string' ? category.trim() : '';
  if (!value || value.length < 2 || value.length > 60) {
    const error = new Error('Kategori bahan harus 2-60 karakter');
    error.statusCode = 400;
    throw error;
  }
  return value;
}

function normalizeIngredientUnit(unit) {
  const value = typeof unit === 'string' ? unit.trim().toLowerCase() : '';
  if (!value || value.length < 1 || value.length > 20) {
    const error = new Error('Satuan bahan harus 1-20 karakter');
    error.statusCode = 400;
    throw error;
  }
  return value;
}

function normalizeIngredientQty(value, fieldLabel = 'Qty bahan') {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 2_000_000_000) {
    const error = new Error(`${fieldLabel} harus berupa angka >= 0`);
    error.statusCode = 400;
    throw error;
  }
  return Number(parsed.toFixed(3));
}

function normalizeIngredientCost(costPerUnit) {
  const parsed = Number.parseInt(costPerUnit, 10);
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 2_000_000_000) {
    const error = new Error('Harga modal bahan harus berupa angka >= 0');
    error.statusCode = 400;
    throw error;
  }
  return parsed;
}

function normalizeIngredientDescription(description) {
  const value = typeof description === 'string' ? description.trim() : '';
  if (value.length > 300) {
    const error = new Error('Deskripsi bahan maksimal 300 karakter');
    error.statusCode = 400;
    throw error;
  }
  return value;
}

function normalizeIngredientPhotoUrl(photoUrl) {
  return normalizeProductPhotoUrl(photoUrl);
}

function normalizeDbTableName(tableName) {
  const value = typeof tableName === 'string' ? tableName.trim() : '';
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value)) {
    const error = new Error('Nama tabel database tidak valid');
    error.statusCode = 400;
    throw error;
  }
  return value;
}

function normalizeDbLimit(value, fallback = 100) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed)) return fallback;
  return Math.max(1, Math.min(parsed, 500));
}

function normalizeDbOffset(value, fallback = 0) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed)) return fallback;
  return Math.max(0, parsed);
}

function parseBoolean(value, fallback = null) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value !== 'string') return fallback;

  const normalized = value.trim().toLowerCase();
  if (['true', '1', 'yes', 'y', 'aktif', 'active'].includes(normalized)) return true;
  if (['false', '0', 'no', 'n', 'nonaktif', 'inactive'].includes(normalized)) return false;
  return fallback;
}

function buildTimeWindow(rangeInput, dateInput) {
  const range = typeof rangeInput === 'string' ? rangeInput.trim().toLowerCase() : 'daily';
  if (!validRanges.has(range)) {
    const error = new Error('Range tidak valid. Gunakan daily, weekly, atau monthly');
    error.statusCode = 400;
    throw error;
  }

  const baseDate = startOfDay(parseYmdLocal(dateInput));
  let start = baseDate;
  let end = addDays(baseDate, 1);

  if (range === 'weekly') {
    const day = baseDate.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    start = addDays(baseDate, diffToMonday);
    end = addDays(start, 7);
  } else if (range === 'monthly') {
    start = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
    end = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 1);
  }

  return {
    range,
    baseDate: formatYmdLocal(baseDate),
    start,
    end,
    startIso: start.toISOString(),
    endIso: end.toISOString(),
    label: `${formatYmdLocal(start)} s/d ${formatYmdLocal(addDays(end, -1))}`
  };
}

function getRateEntry(ip) {
  const now = Date.now();
  const existing = loginRateByIp.get(ip);
  if (!existing || existing.resetAt <= now) {
    const created = { count: 0, resetAt: now + LOGIN_RATE_WINDOW_MS };
    loginRateByIp.set(ip, created);
    return created;
  }
  return existing;
}

function consumeLoginRate(ip) {
  const entry = getRateEntry(ip);
  entry.count += 1;
  const now = Date.now();
  const limited = entry.count > LOGIN_RATE_MAX_ATTEMPTS;
  const retryAfterMs = Math.max(0, entry.resetAt - now);

  return {
    limited,
    retryAfterMs,
    remaining: Math.max(0, LOGIN_RATE_MAX_ATTEMPTS - entry.count)
  };
}

function clearLoginRate(ip) {
  loginRateByIp.delete(ip);
}

function cleanupRateMap() {
  const now = Date.now();
  for (const [ip, value] of loginRateByIp.entries()) {
    if (value.resetAt <= now) {
      loginRateByIp.delete(ip);
    }
  }
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

async function openDatabase() {
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });
  await db.exec('PRAGMA foreign_keys = ON;');
  return db;
}

async function ensureColumnExists(db, table, column, definitionSql) {
  const columns = await db.all(`PRAGMA table_info(${table});`);
  const exists = columns.some((row) => row.name === column);
  if (!exists) {
    await db.exec(`ALTER TABLE ${table} ADD COLUMN ${definitionSql};`);
  }
}

async function insertOrderStatusLog(db, payload) {
  await db.run(
    `INSERT INTO order_status_logs (order_id, from_status, to_status, note, changed_by, changed_at)
     VALUES (?, ?, ?, ?, ?, ?);`,
    payload.orderId,
    payload.fromStatus || null,
    payload.toStatus,
    payload.note || null,
    payload.changedBy || null,
    payload.changedAt || nowIso()
  );
}

async function initDatabase() {
  ensureDir(DATA_DIR);
  ensureDir(BACKUP_DIR);

  const db = await openDatabase();

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'cashier',
      is_active INTEGER NOT NULL DEFAULT 1,
      failed_attempts INTEGER NOT NULL DEFAULT 0,
      locked_until TEXT,
      last_login_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price INTEGER NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      photo_url TEXT NOT NULL DEFAULT '',
      icon TEXT NOT NULL DEFAULT '',
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS inventory (
      product_id TEXT PRIMARY KEY,
      stock INTEGER NOT NULL,
      min_stock INTEGER NOT NULL,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ingredients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      unit TEXT NOT NULL,
      stock_qty REAL NOT NULL DEFAULT 0,
      min_stock_qty REAL NOT NULL DEFAULT 0,
      cost_per_unit INTEGER NOT NULL DEFAULT 0,
      photo_url TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cafe_tables (
      id TEXT PRIMARY KEY,
      area TEXT NOT NULL,
      status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_code TEXT NOT NULL UNIQUE,
      table_id TEXT NOT NULL,
      total INTEGER NOT NULL,
      status TEXT NOT NULL,
      cashier_id INTEGER,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (cashier_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id TEXT,
      name_snapshot TEXT NOT NULL,
      qty INTEGER NOT NULL,
      price INTEGER NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS order_status_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      from_status TEXT,
      to_status TEXT NOT NULL,
      note TEXT,
      changed_by INTEGER,
      changed_at TEXT NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (changed_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS backup_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_name TEXT NOT NULL UNIQUE,
      file_path TEXT NOT NULL,
      size_bytes INTEGER NOT NULL,
      trigger_type TEXT NOT NULL,
      created_by INTEGER,
      restored_at TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (created_by) REFERENCES users(id)
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
    CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
    CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
    CREATE INDEX IF NOT EXISTS idx_order_logs_order_id ON order_status_logs(order_id);
  `);

  await ensureColumnExists(db, 'users', 'is_active', 'is_active INTEGER NOT NULL DEFAULT 1');
  await ensureColumnExists(db, 'users', 'failed_attempts', 'failed_attempts INTEGER NOT NULL DEFAULT 0');
  await ensureColumnExists(db, 'users', 'locked_until', 'locked_until TEXT');
  await ensureColumnExists(db, 'users', 'last_login_at', 'last_login_at TEXT');
  await ensureColumnExists(db, 'users', 'updated_at', 'updated_at TEXT NOT NULL DEFAULT ""');
  await ensureColumnExists(db, 'orders', 'updated_at', 'updated_at TEXT NOT NULL DEFAULT ""');
  await ensureColumnExists(db, 'products', 'description', 'description TEXT NOT NULL DEFAULT ""');
  await ensureColumnExists(db, 'products', 'photo_url', 'photo_url TEXT NOT NULL DEFAULT ""');
  await ensureColumnExists(db, 'products', 'is_active', 'is_active INTEGER NOT NULL DEFAULT 1');
  await ensureColumnExists(db, 'products', 'updated_at', 'updated_at TEXT NOT NULL DEFAULT ""');
  await ensureColumnExists(db, 'ingredients', 'category', 'category TEXT NOT NULL DEFAULT ""');
  await ensureColumnExists(db, 'ingredients', 'unit', "unit TEXT NOT NULL DEFAULT 'pcs'");
  await ensureColumnExists(db, 'ingredients', 'stock_qty', 'stock_qty REAL NOT NULL DEFAULT 0');
  await ensureColumnExists(db, 'ingredients', 'min_stock_qty', 'min_stock_qty REAL NOT NULL DEFAULT 0');
  await ensureColumnExists(db, 'ingredients', 'cost_per_unit', 'cost_per_unit INTEGER NOT NULL DEFAULT 0');
  await ensureColumnExists(db, 'ingredients', 'photo_url', 'photo_url TEXT NOT NULL DEFAULT ""');
  await ensureColumnExists(db, 'ingredients', 'description', 'description TEXT NOT NULL DEFAULT ""');
  await ensureColumnExists(db, 'ingredients', 'is_active', 'is_active INTEGER NOT NULL DEFAULT 1');
  await ensureColumnExists(db, 'ingredients', 'updated_at', 'updated_at TEXT NOT NULL DEFAULT ""');

  await db.run(
    `UPDATE products
     SET updated_at = COALESCE(NULLIF(updated_at, ''), created_at)
     WHERE updated_at IS NULL OR updated_at = '';`
  );

  await db.run(
    `UPDATE ingredients
     SET updated_at = COALESCE(NULLIF(updated_at, ''), created_at)
     WHERE updated_at IS NULL OR updated_at = '';`
  );

  await seedUsers(db);
  await seedMasterData(db);
  await seedInitialOrders(db);
  await backfillOrderStatusLogs(db);

  return db;
}

async function seedUsers(db) {
  const row = await db.get('SELECT COUNT(*) AS total FROM users;');
  if (row.total > 0) {
    await db.run(
      'UPDATE users SET updated_at = COALESCE(NULLIF(updated_at, ""), created_at) WHERE updated_at IS NULL OR updated_at = "";'
    );
    return;
  }

  const createdAt = nowIso();
  const cashierHash = await bcrypt.hash('kasir123', 10);
  const adminHash = await bcrypt.hash('admin123', 10);

  await db.run(
    `INSERT INTO users
      (username, password_hash, full_name, role, is_active, failed_attempts, locked_until, last_login_at, created_at, updated_at)
     VALUES
      (?, ?, ?, ?, 1, 0, NULL, NULL, ?, ?),
      (?, ?, ?, ?, 1, 0, NULL, NULL, ?, ?);`,
    'kasir',
    cashierHash,
    'Kasir Demo',
    'cashier',
    createdAt,
    createdAt,
    'admin',
    adminHash,
    'Admin POI',
    'admin',
    createdAt,
    createdAt
  );
}

async function seedMasterData(db) {
  const productCount = await db.get('SELECT COUNT(*) AS total FROM products;');
  if (productCount.total === 0) {
    const createdAt = nowIso();
    for (const product of seedProducts) {
      await db.run(
        `INSERT INTO products (id, name, category, price, description, photo_url, icon, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, '', '', ?, 1, ?, ?);`,
        product.id,
        product.name,
        product.category,
        product.price,
        product.icon,
        createdAt,
        createdAt
      );
    }
  }

  const inventoryCount = await db.get('SELECT COUNT(*) AS total FROM inventory;');
  if (inventoryCount.total === 0) {
    for (const item of seedInventory) {
      await db.run(
        'INSERT INTO inventory (product_id, stock, min_stock) VALUES (?, ?, ?);',
        item.productId,
        item.stock,
        item.minStock
      );
    }
  }

  const tableCount = await db.get('SELECT COUNT(*) AS total FROM cafe_tables;');
  if (tableCount.total === 0) {
    for (const table of seedTables) {
      await db.run(
        'INSERT INTO cafe_tables (id, area, status) VALUES (?, ?, ?);',
        table.id,
        table.area,
        table.status
      );
    }
  }

  const ingredientCount = await db.get('SELECT COUNT(*) AS total FROM ingredients;');
  if (ingredientCount.total === 0) {
    const createdAt = nowIso();
    for (const ingredient of seedIngredients) {
      await db.run(
        `INSERT INTO ingredients
          (id, name, category, unit, stock_qty, min_stock_qty, cost_per_unit, photo_url, description, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        ingredient.id,
        ingredient.name,
        ingredient.category,
        ingredient.unit,
        ingredient.stockQty,
        ingredient.minStockQty,
        ingredient.costPerUnit,
        ingredient.photoUrl,
        ingredient.description,
        ingredient.isActive ? 1 : 0,
        createdAt,
        createdAt
      );
    }
  }
}

async function seedInitialOrders(db) {
  const orderCount = await db.get('SELECT COUNT(*) AS total FROM orders;');
  if (orderCount.total > 0) return;

  const cashier = await db.get("SELECT id FROM users WHERE username = 'kasir' LIMIT 1;");
  const cashierId = cashier ? cashier.id : null;

  await db.exec('BEGIN');
  try {
    const firstOrderAt = new Date(Date.now() - 1000 * 60 * 90).toISOString();
    const secondOrderAt = new Date(Date.now() - 1000 * 60 * 40).toISOString();

    const order1 = await db.run(
      `INSERT INTO orders (order_code, table_id, total, status, cashier_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      'ORD-201',
      'M2',
      68000,
      'Done',
      cashierId,
      firstOrderAt,
      firstOrderAt
    );

    await db.run(
      `INSERT INTO order_items (order_id, product_id, name_snapshot, qty, price)
       VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?);`,
      order1.lastID,
      'P001',
      'Caffe Latte',
      2,
      25000,
      order1.lastID,
      'P009',
      'Croissant',
      1,
      18000
    );

    const order2 = await db.run(
      `INSERT INTO orders (order_code, table_id, total, status, cashier_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      'ORD-202',
      'M6',
      22000,
      'Process',
      cashierId,
      secondOrderAt,
      secondOrderAt
    );

    await db.run(
      `INSERT INTO order_items (order_id, product_id, name_snapshot, qty, price)
       VALUES (?, ?, ?, ?, ?);`,
      order2.lastID,
      'P002',
      'Americano',
      1,
      22000
    );

    await db.run('UPDATE inventory SET stock = MAX(stock - 2, 0) WHERE product_id = ?;', 'P001');
    await db.run('UPDATE inventory SET stock = MAX(stock - 1, 0) WHERE product_id = ?;', 'P009');
    await db.run('UPDATE inventory SET stock = MAX(stock - 1, 0) WHERE product_id = ?;', 'P002');

    await db.run("UPDATE cafe_tables SET status = 'occupied' WHERE id IN ('M2', 'M6');");

    await insertOrderStatusLog(db, {
      orderId: order1.lastID,
      fromStatus: null,
      toStatus: 'Done',
      changedBy: cashierId,
      note: 'Seed data',
      changedAt: firstOrderAt
    });

    await insertOrderStatusLog(db, {
      orderId: order2.lastID,
      fromStatus: null,
      toStatus: 'Process',
      changedBy: cashierId,
      note: 'Seed data',
      changedAt: secondOrderAt
    });

    await db.exec('COMMIT');
  } catch (error) {
    await db.exec('ROLLBACK');
    throw error;
  }
}

async function backfillOrderStatusLogs(db) {
  const missingOrders = await db.all(
    `SELECT o.id, o.status, o.created_at, o.cashier_id
     FROM orders o
     LEFT JOIN order_status_logs osl ON osl.order_id = o.id
     GROUP BY o.id
     HAVING COUNT(osl.id) = 0;`
  );

  if (missingOrders.length === 0) return;

  await db.exec('BEGIN');
  try {
    for (const order of missingOrders) {
      await insertOrderStatusLog(db, {
        orderId: order.id,
        fromStatus: null,
        toStatus: order.status,
        changedBy: order.cashier_id || null,
        note: 'Backfill migrasi',
        changedAt: order.created_at || nowIso()
      });
    }
    await db.exec('COMMIT');
  } catch (error) {
    await db.exec('ROLLBACK');
    throw error;
  }
}

async function cleanupExpiredSessions(db) {
  await db.run('DELETE FROM sessions WHERE expires_at <= ?;', nowIso());
}

async function findSessionUser(db, token) {
  if (!token) return null;

  await cleanupExpiredSessions(db);

  const row = await db.get(
    `SELECT u.id, u.username, u.full_name, u.role, u.is_active
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token = ? AND s.expires_at > ?
     LIMIT 1;`,
    token,
    nowIso()
  );

  if (!row) return null;

  return {
    id: row.id,
    username: row.username,
    fullName: row.full_name,
    role: row.role,
    isActive: row.is_active === 1
  };
}

function requireAuth(dbRef) {
  return async (req, res, next) => {
    try {
      const token = req.cookies[SESSION_COOKIE];
      const user = await findSessionUser(dbRef.conn, token);
      if (!user) {
        res.status(401).json({ message: 'Login diperlukan' });
        return;
      }

      if (!user.isActive) {
        res.status(403).json({ message: 'Akun Anda nonaktif. Hubungi admin.' });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };
}

function requireRole(...allowedRoles) {
  const normalized = new Set(allowedRoles.map((role) => role.toLowerCase()));
  return (req, res, next) => {
    const role = req.user && typeof req.user.role === 'string' ? req.user.role.toLowerCase() : '';
    if (!normalized.has(role)) {
      res.status(403).json({ message: 'Akses ditolak. Role tidak memiliki izin.' });
      return;
    }
    next();
  };
}

function requireNoMaintenance(maintenanceRef) {
  return (req, res, next) => {
    if (!maintenanceRef.active) {
      next();
      return;
    }
    res.status(503).json({ message: 'Sistem sedang maintenance (restore backup). Coba lagi sebentar.' });
  };
}

async function nextOrderCode(db) {
  const row = await db.get('SELECT order_code FROM orders ORDER BY id DESC LIMIT 1;');
  if (!row || !row.order_code) return 'ORD-203';
  const matched = row.order_code.match(/(\d+)$/);
  const current = matched ? Number.parseInt(matched[1], 10) : 202;
  const next = Number.isNaN(current) ? 203 : current + 1;
  return `ORD-${next}`;
}

function buildOrderWindowClause(window) {
  if (!window) {
    return { clause: '', params: [] };
  }

  return {
    clause: 'WHERE o.created_at >= ? AND o.created_at < ?',
    params: [window.startIso, window.endIso]
  };
}

async function getOrdersWithItems(db, options = {}) {
  const limit = Number.isInteger(options.limit) ? options.limit : 100;
  const window = options.window || null;

  const windowData = buildOrderWindowClause(window);
  const orderRows = await db.all(
    `SELECT o.id,
            o.order_code,
            o.table_id,
            o.total,
            o.status,
            o.created_at,
            o.updated_at,
            u.full_name AS cashier_name
     FROM orders o
     LEFT JOIN users u ON u.id = o.cashier_id
     ${windowData.clause}
     ORDER BY o.id DESC
     LIMIT ?;`,
    ...windowData.params,
    limit
  );

  if (orderRows.length === 0) return [];

  const orderIds = orderRows.map((row) => row.id);
  const placeholders = orderIds.map(() => '?').join(', ');
  const itemRows = await db.all(
    `SELECT order_id, product_id, name_snapshot, qty, price
     FROM order_items
     WHERE order_id IN (${placeholders})
     ORDER BY id ASC;`,
    ...orderIds
  );

  const itemByOrder = new Map();
  for (const item of itemRows) {
    if (!itemByOrder.has(item.order_id)) {
      itemByOrder.set(item.order_id, []);
    }

    itemByOrder.get(item.order_id).push({
      productId: item.product_id,
      name: item.name_snapshot,
      qty: item.qty,
      price: item.price
    });
  }

  return orderRows.map((row) => ({
    id: row.order_code,
    tableId: row.table_id,
    total: row.total,
    status: row.status,
    cashierName: row.cashier_name || '-',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    canTransition: row.status === 'Process',
    items: itemByOrder.get(row.id) || []
  }));
}

function createSalesSeries(window, orders) {
  const range = window.range;

  if (range === 'daily') {
    const labels = Array.from({ length: 24 }, (_, index) => `${String(index).padStart(2, '0')}:00`);
    const map = new Map(labels.map((label) => [label, 0]));

    for (const order of orders) {
      const date = new Date(order.createdAt);
      if (Number.isNaN(date.getTime())) continue;
      const key = `${String(date.getHours()).padStart(2, '0')}:00`;
      map.set(key, (map.get(key) || 0) + Number(order.total || 0));
    }

    return labels.map((label) => ({ hour: label, amount: map.get(label) || 0 }));
  }

  if (range === 'weekly') {
    const labels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const map = new Map(labels.map((label) => [label, 0]));

    for (const order of orders) {
      const date = new Date(order.createdAt);
      if (Number.isNaN(date.getTime())) continue;
      const day = date.getDay();
      const idx = day === 0 ? 6 : day - 1;
      const key = labels[idx];
      map.set(key, (map.get(key) || 0) + Number(order.total || 0));
    }

    return labels.map((label) => ({ hour: label, amount: map.get(label) || 0 }));
  }

  const start = window.start;
  const totalDays = Math.max(1, Math.round((window.end - start) / (24 * 60 * 60 * 1000)));
  const labels = Array.from({ length: totalDays }, (_, index) => `${index + 1}`);
  const map = new Map(labels.map((label) => [label, 0]));

  for (const order of orders) {
    const date = new Date(order.createdAt);
    if (Number.isNaN(date.getTime())) continue;
    const key = `${date.getDate()}`;
    if (!map.has(key)) continue;
    map.set(key, (map.get(key) || 0) + Number(order.total || 0));
  }

  return labels.map((label) => ({ hour: label, amount: map.get(label) || 0 }));
}

async function getDashboardState(db, options = {}) {
  const reportWindow = buildTimeWindow(options.range, options.date);

  const products = await db.all(
    `SELECT id, name, category, price, icon, photo_url AS photoUrl
     FROM products
     WHERE is_active = 1
     ORDER BY id ASC;`
  );

  const categories = Array.from(new Set(products.map((product) => product.category)));

  const inventoryRows = await db.all(
    `SELECT i.product_id AS productId, i.stock, i.min_stock AS minStock
     FROM inventory i
     JOIN products p ON p.id = i.product_id
     WHERE p.is_active = 1
     ORDER BY i.product_id ASC;`
  );

  const tables = await db.all(
    `SELECT id, area, status
     FROM cafe_tables
     ORDER BY id ASC;`
  );

  const orders = await getOrdersWithItems(db, {
    limit: 100,
    window: reportWindow
  });

  const summaryRow = await db.get(
    `SELECT COALESCE(SUM(o.total), 0) AS totalRevenue,
            COUNT(*) AS transactions
     FROM orders o
     WHERE o.created_at >= ? AND o.created_at < ?;`,
    reportWindow.startIso,
    reportWindow.endIso
  );

  const activeRow = await db.get(
    `SELECT COUNT(*) AS activeOrders
     FROM orders o
     WHERE o.status = 'Process'
       AND o.created_at >= ?
       AND o.created_at < ?;`,
    reportWindow.startIso,
    reportWindow.endIso
  );

  const productStats = await db.all(
    `SELECT oi.name_snapshot AS name,
            SUM(oi.qty) AS sold
     FROM order_items oi
     JOIN orders o ON o.id = oi.order_id
     WHERE o.created_at >= ? AND o.created_at < ?
     GROUP BY oi.name_snapshot
     ORDER BY sold DESC, oi.name_snapshot ASC
     LIMIT 5;`,
    reportWindow.startIso,
    reportWindow.endIso
  );

  const categoryStats = await db.all(
    `SELECT COALESCE(p.category, 'Unknown') AS category,
            COALESCE(SUM(oi.qty * oi.price), 0) AS amount
     FROM order_items oi
     JOIN orders o ON o.id = oi.order_id
     LEFT JOIN products p ON p.id = oi.product_id
     WHERE o.created_at >= ? AND o.created_at < ?
     GROUP BY category
     ORDER BY amount DESC;`,
    reportWindow.startIso,
    reportWindow.endIso
  );

  const statusSummaryRows = await db.all(
    `SELECT status, COUNT(*) AS total
     FROM orders
     WHERE created_at >= ? AND created_at < ?
     GROUP BY status;`,
    reportWindow.startIso,
    reportWindow.endIso
  );

  const statusSummary = { Process: 0, Done: 0, Cancel: 0 };
  for (const row of statusSummaryRows) {
    statusSummary[row.status] = row.total;
  }

  const summary = {
    totalRevenue: Number(summaryRow.totalRevenue || 0),
    transactions: Number(summaryRow.transactions || 0),
    activeOrders: Number(activeRow.activeOrders || 0),
    bestSeller: productStats[0] ? productStats[0].name : 'N/A'
  };

  return {
    summary,
    dailySales: createSalesSeries(reportWindow, orders),
    categories,
    products,
    inventory: inventoryRows,
    tables,
    orders,
    productStats,
    categoryStats,
    statusSummary,
    reportWindow: {
      range: reportWindow.range,
      baseDate: reportWindow.baseDate,
      label: reportWindow.label,
      startDate: formatYmdLocal(reportWindow.start),
      endDate: formatYmdLocal(addDays(reportWindow.end, -1))
    }
  };
}

async function syncTableStatus(db, tableId) {
  if (!tableId || tableId === 'Take Away') return;

  const table = await db.get('SELECT id, status FROM cafe_tables WHERE id = ? LIMIT 1;', tableId);
  if (!table) return;

  const active = await db.get(
    `SELECT COUNT(*) AS total
     FROM orders
     WHERE table_id = ? AND status = 'Process';`,
    tableId
  );

  if (active.total > 0) {
    await db.run("UPDATE cafe_tables SET status = 'occupied' WHERE id = ?;", tableId);
    return;
  }

  if (table.status !== 'reserved') {
    await db.run("UPDATE cafe_tables SET status = 'available' WHERE id = ?;", tableId);
  }
}

async function createOrder(db, userId, payload) {
  const tableId = typeof payload.tableId === 'string' && payload.tableId.trim() ? payload.tableId.trim() : 'Take Away';
  const items = Array.isArray(payload.items) ? payload.items : [];

  if (!items.length) {
    const error = new Error('Order items tidak boleh kosong');
    error.statusCode = 400;
    throw error;
  }

  const normalizedItems = [];
  const productIds = [];

  for (const item of items) {
    const productId = typeof item.productId === 'string' ? item.productId.trim() : '';
    const qty = Number.parseInt(item.qty, 10);

    if (!productId || Number.isNaN(qty) || qty <= 0) continue;

    normalizedItems.push({ productId, qty });
    productIds.push(productId);
  }

  if (!normalizedItems.length) {
    const error = new Error('Format items tidak valid');
    error.statusCode = 400;
    throw error;
  }

  const uniqueIds = Array.from(new Set(productIds));
  const placeholders = uniqueIds.map(() => '?').join(', ');
  const products = await db.all(
    `SELECT id, name, category, price
     FROM products
     WHERE id IN (${placeholders}) AND is_active = 1;`,
    ...uniqueIds
  );

  if (products.length !== uniqueIds.length) {
    const error = new Error('Sebagian produk tidak ditemukan atau sedang nonaktif');
    error.statusCode = 400;
    throw error;
  }

  const productMap = new Map(products.map((product) => [product.id, product]));
  const calculatedItems = normalizedItems.map((item) => {
    const product = productMap.get(item.productId);
    return {
      productId: product.id,
      name: product.name,
      category: product.category,
      qty: item.qty,
      price: product.price
    };
  });

  const total = calculatedItems.reduce((sum, item) => sum + item.qty * item.price, 0);
  const orderCode = await nextOrderCode(db);

  await db.exec('BEGIN');
  try {
    const createdAt = nowIso();

    const inserted = await db.run(
      `INSERT INTO orders (order_code, table_id, total, status, cashier_id, created_at, updated_at)
       VALUES (?, ?, ?, 'Process', ?, ?, ?);`,
      orderCode,
      tableId,
      total,
      userId,
      createdAt,
      createdAt
    );

    for (const item of calculatedItems) {
      await db.run(
        `INSERT INTO order_items (order_id, product_id, name_snapshot, qty, price)
         VALUES (?, ?, ?, ?, ?);`,
        inserted.lastID,
        item.productId,
        item.name,
        item.qty,
        item.price
      );

      await db.run(
        `UPDATE inventory
         SET stock = MAX(stock - ?, 0)
         WHERE product_id = ?;`,
        item.qty,
        item.productId
      );
    }

    await insertOrderStatusLog(db, {
      orderId: inserted.lastID,
      fromStatus: null,
      toStatus: 'Process',
      changedBy: userId,
      note: 'Order dibuat',
      changedAt: createdAt
    });

    await syncTableStatus(db, tableId);

    await db.exec('COMMIT');

    return {
      id: orderCode,
      tableId,
      total,
      status: 'Process',
      createdAt,
      items: calculatedItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        qty: item.qty,
        price: item.price
      }))
    };
  } catch (error) {
    await db.exec('ROLLBACK');
    throw error;
  }
}

async function getOrderByCodeInternal(db, orderCode) {
  return db.get(
    `SELECT id, order_code, table_id, total, status, created_at, updated_at
     FROM orders
     WHERE order_code = ?
     LIMIT 1;`,
    orderCode
  );
}

async function changeOrderStatus(db, userId, orderCode, payload) {
  const order = await getOrderByCodeInternal(db, orderCode);
  if (!order) {
    const error = new Error('Order tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  const nextStatus = normalizeOrderStatus(payload.status);
  const note = typeof payload.note === 'string' ? payload.note.trim() : '';

  if (order.status === nextStatus) {
    return { changed: false, orderCode, status: order.status };
  }

  if (order.status !== 'Process') {
    const error = new Error('Hanya order dengan status Process yang dapat diubah');
    error.statusCode = 400;
    throw error;
  }

  if (nextStatus === 'Process') {
    const error = new Error('Transisi ke Process tidak diperbolehkan');
    error.statusCode = 400;
    throw error;
  }

  const items = await db.all(
    `SELECT product_id, qty
     FROM order_items
     WHERE order_id = ?;`,
    order.id
  );

  await db.exec('BEGIN');
  try {
    const changedAt = nowIso();

    await db.run(
      `UPDATE orders
       SET status = ?, updated_at = ?
       WHERE id = ?;`,
      nextStatus,
      changedAt,
      order.id
    );

    if (nextStatus === 'Cancel') {
      for (const item of items) {
        if (!item.product_id) continue;
        await db.run(
          `UPDATE inventory
           SET stock = stock + ?
           WHERE product_id = ?;`,
          item.qty,
          item.product_id
        );
      }
    }

    await insertOrderStatusLog(db, {
      orderId: order.id,
      fromStatus: order.status,
      toStatus: nextStatus,
      changedBy: userId,
      note: note || null,
      changedAt
    });

    await syncTableStatus(db, order.table_id);

    await db.exec('COMMIT');

    return {
      changed: true,
      orderCode,
      previousStatus: order.status,
      status: nextStatus,
      updatedAt: changedAt
    };
  } catch (error) {
    await db.exec('ROLLBACK');
    throw error;
  }
}

async function getOrderStatusLogs(db, orderCode) {
  const order = await getOrderByCodeInternal(db, orderCode);
  if (!order) {
    const error = new Error('Order tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  const rows = await db.all(
    `SELECT osl.id,
            osl.from_status,
            osl.to_status,
            osl.note,
            osl.changed_at,
            u.full_name AS changed_by_name
     FROM order_status_logs osl
     LEFT JOIN users u ON u.id = osl.changed_by
     WHERE osl.order_id = ?
     ORDER BY osl.id DESC;`,
    order.id
  );

  return rows.map((row) => ({
    id: row.id,
    fromStatus: row.from_status,
    toStatus: row.to_status,
    note: row.note,
    changedAt: row.changed_at,
    changedByName: row.changed_by_name || 'System'
  }));
}

async function getActiveAdminCount(db, excludeUserId = null) {
  if (excludeUserId) {
    const row = await db.get(
      `SELECT COUNT(*) AS total
       FROM users
       WHERE role = 'admin' AND is_active = 1 AND id != ?;`,
      excludeUserId
    );
    return row.total;
  }

  const row = await db.get(
    `SELECT COUNT(*) AS total
     FROM users
     WHERE role = 'admin' AND is_active = 1;`
  );
  return row.total;
}

async function listUsers(db) {
  const rows = await db.all(
    `SELECT id, username, full_name, role, is_active, failed_attempts, locked_until, last_login_at, created_at, updated_at
     FROM users
     ORDER BY created_at ASC;`
  );

  return rows.map((row) => ({
    id: row.id,
    username: row.username,
    fullName: row.full_name,
    role: row.role,
    isActive: row.is_active === 1,
    failedAttempts: row.failed_attempts || 0,
    lockedUntil: row.locked_until,
    lastLoginAt: row.last_login_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));
}

function mapMenuRow(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: Number(row.price || 0),
    description: row.description || '',
    photoUrl: row.photo_url || '',
    icon: row.icon || '',
    isActive: row.is_active === 1,
    stock: Number(row.stock || 0),
    minStock: Number(row.min_stock || 0),
    orderCount: Number(row.order_count || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function getNextProductId(db) {
  const rows = await db.all(`SELECT id FROM products WHERE id LIKE 'P%';`);
  let max = 0;

  for (const row of rows) {
    const matched = String(row.id || '').match(/^P(\d+)$/);
    if (!matched) continue;
    const value = Number.parseInt(matched[1], 10);
    if (Number.isInteger(value) && value > max) {
      max = value;
    }
  }

  return `P${String(max + 1).padStart(3, '0')}`;
}

async function findMenuById(db, productId) {
  const row = await db.get(
    `SELECT p.id,
            p.name,
            p.category,
            p.price,
            p.description,
            p.photo_url,
            p.icon,
            p.is_active,
            p.created_at,
            p.updated_at,
            COALESCE(i.stock, 0) AS stock,
            COALESCE(i.min_stock, 0) AS min_stock,
            COALESCE(oc.order_count, 0) AS order_count
     FROM products p
     LEFT JOIN inventory i ON i.product_id = p.id
     LEFT JOIN (
       SELECT product_id, COUNT(*) AS order_count
       FROM order_items
       WHERE product_id IS NOT NULL
       GROUP BY product_id
     ) oc ON oc.product_id = p.id
     WHERE p.id = ?
     LIMIT 1;`,
    productId
  );

  return row ? mapMenuRow(row) : null;
}

async function listMenusByAdmin(db) {
  const rows = await db.all(
    `SELECT p.id,
            p.name,
            p.category,
            p.price,
            p.description,
            p.photo_url,
            p.icon,
            p.is_active,
            p.created_at,
            p.updated_at,
            COALESCE(i.stock, 0) AS stock,
            COALESCE(i.min_stock, 0) AS min_stock,
            COALESCE(oc.order_count, 0) AS order_count
     FROM products p
     LEFT JOIN inventory i ON i.product_id = p.id
     LEFT JOIN (
       SELECT product_id, COUNT(*) AS order_count
       FROM order_items
       WHERE product_id IS NOT NULL
       GROUP BY product_id
     ) oc ON oc.product_id = p.id
     ORDER BY p.id ASC;`
  );

  return rows.map(mapMenuRow);
}

async function createMenuByAdmin(db, payload) {
  const requestedId = payload.id !== undefined ? normalizeProductId(payload.id) : '';
  const id = requestedId || (await getNextProductId(db));
  const name = normalizeProductName(payload.name);
  const category = normalizeProductCategory(payload.category);
  const price = normalizeProductPrice(payload.price);
  const description = normalizeProductDescription(payload.description);
  const photoUrl = normalizeProductPhotoUrl(payload.photoUrl ?? payload.photo_url);
  const icon = normalizeProductIcon(payload.icon);
  const isActive = normalizeMenuActiveFlag(payload.isActive ?? payload.is_active, true);
  const stock = normalizeStock(payload.stock, 'Stok');
  const minStock = normalizeStock(payload.minStock ?? payload.min_stock, 'Min stok');

  const existing = await db.get('SELECT id FROM products WHERE id = ? LIMIT 1;', id);
  if (existing) {
    const error = new Error('ID menu sudah terpakai');
    error.statusCode = 409;
    throw error;
  }

  const createdAt = nowIso();

  await db.exec('BEGIN');
  try {
    await db.run(
      `INSERT INTO products
        (id, name, category, price, description, photo_url, icon, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      id,
      name,
      category,
      price,
      description,
      photoUrl,
      icon,
      isActive ? 1 : 0,
      createdAt,
      createdAt
    );

    await db.run(
      `INSERT INTO inventory (product_id, stock, min_stock)
       VALUES (?, ?, ?);`,
      id,
      stock,
      minStock
    );

    await db.exec('COMMIT');
  } catch (error) {
    await db.exec('ROLLBACK');
    throw error;
  }

  return findMenuById(db, id);
}

async function updateMenuByAdmin(db, productIdInput, payload) {
  const productId = normalizeProductId(productIdInput);
  const current = await findMenuById(db, productId);
  if (!current) {
    const error = new Error('Menu tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  const productUpdates = [];
  const productParams = [];

  if (payload.name !== undefined) {
    productUpdates.push('name = ?');
    productParams.push(normalizeProductName(payload.name));
  }

  if (payload.category !== undefined) {
    productUpdates.push('category = ?');
    productParams.push(normalizeProductCategory(payload.category));
  }

  if (payload.price !== undefined) {
    productUpdates.push('price = ?');
    productParams.push(normalizeProductPrice(payload.price));
  }

  if (payload.description !== undefined) {
    productUpdates.push('description = ?');
    productParams.push(normalizeProductDescription(payload.description));
  }

  if (payload.photoUrl !== undefined || payload.photo_url !== undefined) {
    productUpdates.push('photo_url = ?');
    productParams.push(normalizeProductPhotoUrl(payload.photoUrl ?? payload.photo_url));
  }

  if (payload.icon !== undefined) {
    productUpdates.push('icon = ?');
    productParams.push(normalizeProductIcon(payload.icon));
  }

  const activeValue = parseBoolean(payload.isActive ?? payload.is_active, null);
  if (activeValue !== null) {
    productUpdates.push('is_active = ?');
    productParams.push(activeValue ? 1 : 0);
  }

  const inventoryUpdates = [];
  const inventoryParams = [];

  if (payload.stock !== undefined) {
    inventoryUpdates.push('stock = ?');
    inventoryParams.push(normalizeStock(payload.stock, 'Stok'));
  }

  if (payload.minStock !== undefined || payload.min_stock !== undefined) {
    inventoryUpdates.push('min_stock = ?');
    inventoryParams.push(normalizeStock(payload.minStock ?? payload.min_stock, 'Min stok'));
  }

  if (productUpdates.length === 0 && inventoryUpdates.length === 0) {
    return { changed: false, menu: current };
  }

  await db.exec('BEGIN');
  try {
    if (productUpdates.length > 0) {
      productUpdates.push('updated_at = ?');
      productParams.push(nowIso());
      productParams.push(productId);

      await db.run(
        `UPDATE products
         SET ${productUpdates.join(', ')}
         WHERE id = ?;`,
        ...productParams
      );
    }

    if (inventoryUpdates.length > 0) {
      const inventoryRow = await db.get(
        'SELECT product_id FROM inventory WHERE product_id = ? LIMIT 1;',
        productId
      );

      if (!inventoryRow) {
        const stock = payload.stock !== undefined ? normalizeStock(payload.stock, 'Stok') : 0;
        const minStock =
          payload.minStock !== undefined || payload.min_stock !== undefined
            ? normalizeStock(payload.minStock ?? payload.min_stock, 'Min stok')
            : 0;

        await db.run(
          `INSERT INTO inventory (product_id, stock, min_stock)
           VALUES (?, ?, ?);`,
          productId,
          stock,
          minStock
        );
      } else {
        inventoryParams.push(productId);
        await db.run(
          `UPDATE inventory
           SET ${inventoryUpdates.join(', ')}
           WHERE product_id = ?;`,
          ...inventoryParams
        );
      }
    }

    await db.exec('COMMIT');
  } catch (error) {
    await db.exec('ROLLBACK');
    throw error;
  }

  return {
    changed: true,
    menu: await findMenuById(db, productId)
  };
}

async function deleteMenuByAdmin(db, productIdInput) {
  const productId = normalizeProductId(productIdInput);
  const menu = await db.get('SELECT id FROM products WHERE id = ? LIMIT 1;', productId);
  if (!menu) {
    const error = new Error('Menu tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  const orderUsage = await db.get(
    `SELECT COUNT(*) AS total
     FROM order_items
     WHERE product_id = ?;`,
    productId
  );

  if (Number(orderUsage.total || 0) > 0) {
    const error = new Error('Menu sudah dipakai di order. Nonaktifkan menu, jangan dihapus.');
    error.statusCode = 400;
    throw error;
  }

  await db.exec('BEGIN');
  try {
    await db.run('DELETE FROM inventory WHERE product_id = ?;', productId);
    await db.run('DELETE FROM products WHERE id = ?;', productId);
    await db.exec('COMMIT');
  } catch (error) {
    await db.exec('ROLLBACK');
    throw error;
  }

  return { deleted: true, productId };
}

function mapIngredientRow(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    unit: row.unit,
    stockQty: Number(row.stock_qty || 0),
    minStockQty: Number(row.min_stock_qty || 0),
    costPerUnit: Number(row.cost_per_unit || 0),
    photoUrl: row.photo_url || '',
    description: row.description || '',
    isActive: row.is_active === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function getNextIngredientId(db) {
  const rows = await db.all(`SELECT id FROM ingredients WHERE id LIKE 'B%';`);
  let max = 0;

  for (const row of rows) {
    const matched = String(row.id || '').match(/^B(\d+)$/);
    if (!matched) continue;
    const value = Number.parseInt(matched[1], 10);
    if (Number.isInteger(value) && value > max) {
      max = value;
    }
  }

  return `B${String(max + 1).padStart(3, '0')}`;
}

async function findIngredientById(db, ingredientId) {
  const row = await db.get(
    `SELECT id,
            name,
            category,
            unit,
            stock_qty,
            min_stock_qty,
            cost_per_unit,
            photo_url,
            description,
            is_active,
            created_at,
            updated_at
     FROM ingredients
     WHERE id = ?
     LIMIT 1;`,
    ingredientId
  );

  return row ? mapIngredientRow(row) : null;
}

async function listIngredientsByAdmin(db) {
  const rows = await db.all(
    `SELECT id,
            name,
            category,
            unit,
            stock_qty,
            min_stock_qty,
            cost_per_unit,
            photo_url,
            description,
            is_active,
            created_at,
            updated_at
     FROM ingredients
     ORDER BY id ASC;`
  );

  return rows.map(mapIngredientRow);
}

async function createIngredientByAdmin(db, payload) {
  const requestedId = payload.id !== undefined ? normalizeIngredientId(payload.id) : '';
  const id = requestedId || (await getNextIngredientId(db));
  const name = normalizeIngredientName(payload.name);
  const category = normalizeIngredientCategory(payload.category);
  const unit = normalizeIngredientUnit(payload.unit);
  const stockQty = normalizeIngredientQty(payload.stockQty ?? payload.stock_qty, 'Stok bahan');
  const minStockQty = normalizeIngredientQty(
    payload.minStockQty ?? payload.min_stock_qty,
    'Min stok bahan'
  );
  const costPerUnit = normalizeIngredientCost(payload.costPerUnit ?? payload.cost_per_unit);
  const photoUrl = normalizeIngredientPhotoUrl(payload.photoUrl ?? payload.photo_url);
  const description = normalizeIngredientDescription(payload.description);
  const isActive = normalizeMenuActiveFlag(payload.isActive ?? payload.is_active, true);

  const existing = await db.get('SELECT id FROM ingredients WHERE id = ? LIMIT 1;', id);
  if (existing) {
    const error = new Error('ID bahan sudah terpakai');
    error.statusCode = 409;
    throw error;
  }

  const createdAt = nowIso();
  await db.run(
    `INSERT INTO ingredients
      (id, name, category, unit, stock_qty, min_stock_qty, cost_per_unit, photo_url, description, is_active, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    id,
    name,
    category,
    unit,
    stockQty,
    minStockQty,
    costPerUnit,
    photoUrl,
    description,
    isActive ? 1 : 0,
    createdAt,
    createdAt
  );

  return findIngredientById(db, id);
}

async function updateIngredientByAdmin(db, ingredientIdInput, payload) {
  const ingredientId = normalizeIngredientId(ingredientIdInput);
  const current = await findIngredientById(db, ingredientId);
  if (!current) {
    const error = new Error('Bahan tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  const updates = [];
  const params = [];

  if (payload.name !== undefined) {
    updates.push('name = ?');
    params.push(normalizeIngredientName(payload.name));
  }

  if (payload.category !== undefined) {
    updates.push('category = ?');
    params.push(normalizeIngredientCategory(payload.category));
  }

  if (payload.unit !== undefined) {
    updates.push('unit = ?');
    params.push(normalizeIngredientUnit(payload.unit));
  }

  if (payload.stockQty !== undefined || payload.stock_qty !== undefined) {
    updates.push('stock_qty = ?');
    params.push(normalizeIngredientQty(payload.stockQty ?? payload.stock_qty, 'Stok bahan'));
  }

  if (payload.minStockQty !== undefined || payload.min_stock_qty !== undefined) {
    updates.push('min_stock_qty = ?');
    params.push(
      normalizeIngredientQty(payload.minStockQty ?? payload.min_stock_qty, 'Min stok bahan')
    );
  }

  if (payload.costPerUnit !== undefined || payload.cost_per_unit !== undefined) {
    updates.push('cost_per_unit = ?');
    params.push(normalizeIngredientCost(payload.costPerUnit ?? payload.cost_per_unit));
  }

  if (payload.photoUrl !== undefined || payload.photo_url !== undefined) {
    updates.push('photo_url = ?');
    params.push(normalizeIngredientPhotoUrl(payload.photoUrl ?? payload.photo_url));
  }

  if (payload.description !== undefined) {
    updates.push('description = ?');
    params.push(normalizeIngredientDescription(payload.description));
  }

  const activeValue = parseBoolean(payload.isActive ?? payload.is_active, null);
  if (activeValue !== null) {
    updates.push('is_active = ?');
    params.push(activeValue ? 1 : 0);
  }

  if (updates.length === 0) {
    return { changed: false, ingredient: current };
  }

  updates.push('updated_at = ?');
  params.push(nowIso());
  params.push(ingredientId);

  await db.run(
    `UPDATE ingredients
     SET ${updates.join(', ')}
     WHERE id = ?;`,
    ...params
  );

  return {
    changed: true,
    ingredient: await findIngredientById(db, ingredientId)
  };
}

async function deleteIngredientByAdmin(db, ingredientIdInput) {
  const ingredientId = normalizeIngredientId(ingredientIdInput);
  const ingredient = await db.get('SELECT id FROM ingredients WHERE id = ? LIMIT 1;', ingredientId);
  if (!ingredient) {
    const error = new Error('Bahan tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  await db.run('DELETE FROM ingredients WHERE id = ?;', ingredientId);
  return { deleted: true, ingredientId };
}

async function listDatabaseTables(db) {
  const rows = await db.all(
    `SELECT name
     FROM sqlite_master
     WHERE type = 'table'
       AND name NOT LIKE 'sqlite_%'
     ORDER BY name ASC;`
  );

  return rows.map((row) => row.name);
}

async function getDatabaseTableData(db, tableNameInput, options = {}) {
  const tableName = normalizeDbTableName(tableNameInput);
  const availableTables = await listDatabaseTables(db);
  if (!availableTables.includes(tableName)) {
    const error = new Error('Tabel database tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  const limit = normalizeDbLimit(options.limit, 100);
  const offset = normalizeDbOffset(options.offset, 0);
  const quotedTable = `"${tableName.replace(/"/g, '""')}"`;

  const columnsInfo = await db.all(`PRAGMA table_info(${quotedTable});`);
  const columns = columnsInfo.map((column) => column.name);

  const totalRow = await db.get(`SELECT COUNT(*) AS total FROM ${quotedTable};`);
  const rows = await db.all(
    `SELECT *
     FROM ${quotedTable}
     LIMIT ? OFFSET ?;`,
    limit,
    offset
  );

  return {
    table: tableName,
    columns,
    rows,
    total: Number(totalRow.total || 0),
    limit,
    offset
  };
}

async function createUserByAdmin(db, payload) {
  const username = normalizeUsername(payload.username);
  const fullName = normalizeFullName(payload.fullName || payload.full_name);
  const role = normalizeRole(payload.role || 'cashier');
  const password = normalizePassword(payload.password || createPassword());

  const exists = await db.get('SELECT id FROM users WHERE username = ? LIMIT 1;', username);
  if (exists) {
    const error = new Error('Username sudah dipakai');
    error.statusCode = 409;
    throw error;
  }

  const hash = await bcrypt.hash(password, 10);
  const createdAt = nowIso();

  const result = await db.run(
    `INSERT INTO users
      (username, password_hash, full_name, role, is_active, failed_attempts, locked_until, last_login_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, 1, 0, NULL, NULL, ?, ?);`,
    username,
    hash,
    fullName,
    role,
    createdAt,
    createdAt
  );

  return {
    id: result.lastID,
    username,
    fullName,
    role,
    isActive: true,
    temporaryPassword: payload.password ? null : password
  };
}

async function updateUserByAdmin(db, userId, payload, actorId) {
  const user = await db.get('SELECT id, role, is_active FROM users WHERE id = ? LIMIT 1;', userId);
  if (!user) {
    const error = new Error('User tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  const updates = [];
  const params = [];

  if (payload.fullName !== undefined || payload.full_name !== undefined) {
    const fullName = normalizeFullName(payload.fullName ?? payload.full_name);
    updates.push('full_name = ?');
    params.push(fullName);
  }

  let nextRole = user.role;
  if (payload.role !== undefined) {
    nextRole = normalizeRole(payload.role);
    updates.push('role = ?');
    params.push(nextRole);
  }

  let nextActive = user.is_active === 1;
  const parsedActive = parseBoolean(payload.isActive ?? payload.is_active, null);
  if (parsedActive !== null) {
    nextActive = parsedActive;
    updates.push('is_active = ?');
    params.push(parsedActive ? 1 : 0);
  }

  if (!nextActive || nextRole !== 'admin') {
    const adminsLeft = await getActiveAdminCount(db, user.id);
    const removingAdmin = user.role === 'admin' && (nextRole !== 'admin' || !nextActive);
    if (removingAdmin && adminsLeft <= 0) {
      const error = new Error('Minimal harus ada satu admin aktif');
      error.statusCode = 400;
      throw error;
    }
  }

  if (updates.length === 0) {
    return { changed: false };
  }

  updates.push('updated_at = ?');
  params.push(nowIso());
  params.push(userId);

  await db.run(
    `UPDATE users
     SET ${updates.join(', ')}
     WHERE id = ?;`,
    ...params
  );

  if (nextActive === false) {
    await db.run('DELETE FROM sessions WHERE user_id = ?;', userId);
  }

  if (userId === actorId && nextActive === false) {
    await db.run('DELETE FROM sessions WHERE user_id = ?;', actorId);
  }

  return { changed: true };
}

async function resetPasswordByAdmin(db, userId, payload) {
  const user = await db.get('SELECT id FROM users WHERE id = ? LIMIT 1;', userId);
  if (!user) {
    const error = new Error('User tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  const generated = !payload.password;
  const password = normalizePassword(payload.password || createPassword());
  const hash = await bcrypt.hash(password, 10);

  await db.run(
    `UPDATE users
     SET password_hash = ?, failed_attempts = 0, locked_until = NULL, updated_at = ?
     WHERE id = ?;`,
    hash,
    nowIso(),
    userId
  );

  await db.run('DELETE FROM sessions WHERE user_id = ?;', userId);

  return {
    userId,
    temporaryPassword: generated ? password : null
  };
}

function sanitizeBackupFileName(fileName) {
  const value = typeof fileName === 'string' ? fileName.trim() : '';
  if (!value) {
    const error = new Error('Nama file backup wajib diisi');
    error.statusCode = 400;
    throw error;
  }

  if (!/^[a-zA-Z0-9._-]+\.sqlite$/.test(value)) {
    const error = new Error('Nama file backup tidak valid');
    error.statusCode = 400;
    throw error;
  }

  return value;
}

async function purgeOldBackupFiles(db) {
  const rows = await db.all(
    `SELECT id, file_name, file_path
     FROM backup_logs
     ORDER BY created_at DESC;`
  );

  if (rows.length <= MAX_BACKUP_FILES) return;

  const toDelete = rows.slice(MAX_BACKUP_FILES);
  for (const row of toDelete) {
    try {
      if (fs.existsSync(row.file_path)) {
        fs.unlinkSync(row.file_path);
      }
    } catch (_) {
      // ignore
    }
    await db.run('DELETE FROM backup_logs WHERE id = ?;', row.id);
  }
}

async function createBackup(db, options = {}) {
  ensureDir(BACKUP_DIR);

  const triggerType = options.triggerType || 'manual';
  const createdBy = options.createdBy || null;
  const now = new Date();
  const stamp = formatFileTimestamp(now);
  const fileName = `poi-backup-${stamp}-${triggerType}.sqlite`;
  const filePath = path.join(BACKUP_DIR, fileName);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  const escapedPath = filePath.replace(/'/g, "''");
  await db.exec(`VACUUM main INTO '${escapedPath}';`);

  const stat = fs.statSync(filePath);
  const createdAt = nowIso();

  await db.run(
    `INSERT OR REPLACE INTO backup_logs
      (file_name, file_path, size_bytes, trigger_type, created_by, restored_at, created_at)
     VALUES (?, ?, ?, ?, ?, NULL, ?);`,
    fileName,
    filePath,
    stat.size,
    triggerType,
    createdBy,
    createdAt
  );

  await purgeOldBackupFiles(db);

  return {
    fileName,
    filePath,
    sizeBytes: stat.size,
    triggerType,
    createdAt
  };
}

async function listBackups(db) {
  const rows = await db.all(
    `SELECT id, file_name, file_path, size_bytes, trigger_type, created_by, restored_at, created_at
     FROM backup_logs
     ORDER BY created_at DESC;`
  );

  const valid = [];
  for (const row of rows) {
    if (!fs.existsSync(row.file_path)) continue;
    valid.push({
      id: row.id,
      fileName: row.file_name,
      filePath: row.file_path,
      sizeBytes: row.size_bytes,
      triggerType: row.trigger_type,
      createdBy: row.created_by,
      restoredAt: row.restored_at,
      createdAt: row.created_at
    });
  }

  return valid;
}

async function restoreBackup(dbRef, maintenanceRef, fileName, actorId) {
  const safeName = sanitizeBackupFileName(fileName);
  const backupPath = path.join(BACKUP_DIR, safeName);

  if (!fs.existsSync(backupPath)) {
    const error = new Error('File backup tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  if (maintenanceRef.active) {
    const error = new Error('Restore sedang berjalan');
    error.statusCode = 409;
    throw error;
  }

  maintenanceRef.active = true;

  try {
    await createBackup(dbRef.conn, {
      triggerType: 'pre-restore',
      createdBy: actorId
    });

    await dbRef.conn.close();

    const tempPath = `${DB_PATH}.restore.tmp`;
    fs.copyFileSync(backupPath, tempPath);
    fs.renameSync(tempPath, DB_PATH);

    dbRef.conn = await initDatabase();

    await dbRef.conn.run(
      `UPDATE backup_logs
       SET restored_at = ?
       WHERE file_name = ?;`,
      nowIso(),
      safeName
    );

    return {
      restored: true,
      fileName: safeName
    };
  } finally {
    maintenanceRef.active = false;
  }
}

async function buildOrdersWorksheetData(db, window) {
  const rows = await db.all(
    `SELECT o.order_code,
            o.table_id,
            o.total,
            o.status,
            o.created_at,
            u.full_name AS cashier_name,
            oi.name_snapshot,
            oi.qty,
            oi.price
     FROM orders o
     LEFT JOIN users u ON u.id = o.cashier_id
     LEFT JOIN order_items oi ON oi.order_id = o.id
     WHERE o.created_at >= ? AND o.created_at < ?
     ORDER BY o.id DESC, oi.id ASC;`,
    window.startIso,
    window.endIso
  );

  return rows.map((row) => ({
    OrderID: row.order_code,
    Meja: row.table_id,
    Kasir: row.cashier_name || '-',
    Status: row.status,
    Waktu: row.created_at,
    Item: row.name_snapshot || '-',
    Qty: row.qty || 0,
    Harga: row.price || 0,
    Subtotal: (row.qty || 0) * (row.price || 0),
    TotalOrder: row.total
  }));
}

function isCookieSecure(req) {
  if (process.env.COOKIE_SECURE === 'true') return true;
  if (process.env.NODE_ENV !== 'production') return false;
  return req.secure || req.headers['x-forwarded-proto'] === 'https';
}

function getIp(req) {
  if (typeof req.ip === 'string') return req.ip;
  return req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : 'unknown';
}

async function handleFailedLogin(db, user) {
  if (!user) return null;

  const attempts = Number(user.failed_attempts || 0) + 1;
  if (attempts >= ACCOUNT_LOCK_THRESHOLD) {
    const lockedUntil = new Date(Date.now() + ACCOUNT_LOCK_DURATION_MS).toISOString();
    await db.run(
      `UPDATE users
       SET failed_attempts = 0,
           locked_until = ?,
           updated_at = ?
       WHERE id = ?;`,
      lockedUntil,
      nowIso(),
      user.id
    );
    return { locked: true, lockedUntil };
  }

  await db.run(
    `UPDATE users
     SET failed_attempts = ?,
         updated_at = ?
     WHERE id = ?;`,
    attempts,
    nowIso(),
    user.id
  );

  return { locked: false, attempts };
}

async function clearUserLockState(db, userId) {
  await db.run(
    `UPDATE users
     SET failed_attempts = 0,
         locked_until = NULL,
         last_login_at = ?,
         updated_at = ?
     WHERE id = ?;`,
    nowIso(),
    nowIso(),
    userId
  );
}

function bytesToHumanReadable(bytes) {
  const size = Number(bytes || 0);
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

async function startServer() {
  const dbRef = { conn: await initDatabase() };
  const maintenanceRef = { active: false };

  const app = express();
  app.set('trust proxy', 1);

  app.use(express.json({ limit: '12mb' }));
  app.use(cookieParser());
  app.use(requireNoMaintenance(maintenanceRef));

  const authGuard = requireAuth(dbRef);
  const adminGuard = requireRole('admin');

  app.post('/api/auth/login', async (req, res, next) => {
    try {
      cleanupRateMap();

      const ip = getIp(req);
      const rate = consumeLoginRate(ip);
      if (rate.limited) {
        res.setHeader('Retry-After', String(Math.ceil(rate.retryAfterMs / 1000)));
        res.status(429).json({
          message: 'Terlalu banyak percobaan login dari IP ini. Coba lagi nanti.'
        });
        return;
      }

      const username = normalizeUsername(req.body.username || '');
      const password = typeof req.body.password === 'string' ? req.body.password : '';

      if (!password) {
        res.status(400).json({ message: 'Password wajib diisi' });
        return;
      }

      const user = await dbRef.conn.get(
        `SELECT id, username, password_hash, full_name, role, is_active, failed_attempts, locked_until
         FROM users
         WHERE username = ?
         LIMIT 1;`,
        username
      );

      if (!user) {
        res.status(401).json({ message: 'Username atau password salah' });
        return;
      }

      if (user.is_active !== 1) {
        res.status(403).json({ message: 'Akun nonaktif. Hubungi admin.' });
        return;
      }

      if (user.locked_until && new Date(user.locked_until).getTime() > Date.now()) {
        res.status(423).json({
          message: `Akun terkunci sementara hingga ${new Date(user.locked_until).toLocaleString('id-ID')}`,
          lockedUntil: user.locked_until
        });
        return;
      }

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        const lockState = await handleFailedLogin(dbRef.conn, user);
        if (lockState && lockState.locked) {
          res.status(423).json({
            message: `Akun terkunci sementara hingga ${new Date(lockState.lockedUntil).toLocaleString('id-ID')}`,
            lockedUntil: lockState.lockedUntil
          });
          return;
        }

        res.status(401).json({ message: 'Username atau password salah' });
        return;
      }

      clearLoginRate(ip);
      await clearUserLockState(dbRef.conn, user.id);

      const token = createSessionToken();
      const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();

      await dbRef.conn.run(
        `INSERT INTO sessions (token, user_id, expires_at, created_at)
         VALUES (?, ?, ?, ?);`,
        token,
        user.id,
        expiresAt,
        nowIso()
      );

      res.cookie(SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: isCookieSecure(req),
        maxAge: SESSION_TTL_MS,
        path: '/'
      });

      res.json({
        user: {
          id: user.id,
          username: user.username,
          fullName: user.full_name,
          role: user.role,
          isActive: true
        }
      });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/auth/logout', authGuard, async (req, res, next) => {
    try {
      const token = req.cookies[SESSION_COOKIE];
      if (token) {
        await dbRef.conn.run('DELETE FROM sessions WHERE token = ?;', token);
      }
      res.clearCookie(SESSION_COOKIE, { path: '/' });
      res.json({ message: 'Logout berhasil' });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/auth/me', async (req, res, next) => {
    try {
      const token = req.cookies[SESSION_COOKIE];
      const user = await findSessionUser(dbRef.conn, token);
      if (!user) {
        res.status(401).json({ message: 'Belum login' });
        return;
      }

      if (!user.isActive) {
        res.status(403).json({ message: 'Akun nonaktif' });
        return;
      }

      res.json({ user });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/state', authGuard, async (req, res, next) => {
    try {
      const state = await getDashboardState(dbRef.conn, {
        range: req.query.range,
        date: req.query.date
      });

      res.json({
        ...state,
        currentUser: req.user,
        backupConfig: {
          autoBackupIntervalHours: AUTO_BACKUP_INTERVAL_HOURS,
          maxBackupFiles: MAX_BACKUP_FILES
        }
      });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/orders', authGuard, async (req, res, next) => {
    try {
      const order = await createOrder(dbRef.conn, req.user.id, req.body || {});
      res.status(201).json({ message: 'Order berhasil dibuat', order });
    } catch (error) {
      next(error);
    }
  });

  app.patch('/api/orders/:orderCode/status', authGuard, async (req, res, next) => {
    try {
      const orderCode = typeof req.params.orderCode === 'string' ? req.params.orderCode.trim() : '';
      if (!orderCode) {
        res.status(400).json({ message: 'Order code tidak valid' });
        return;
      }

      const result = await changeOrderStatus(dbRef.conn, req.user.id, orderCode, req.body || {});
      res.json({ message: 'Status order diperbarui', result });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/orders/:orderCode/logs', authGuard, async (req, res, next) => {
    try {
      const orderCode = typeof req.params.orderCode === 'string' ? req.params.orderCode.trim() : '';
      const logs = await getOrderStatusLogs(dbRef.conn, orderCode);
      res.json({ orderCode, logs });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/admin/menus', authGuard, adminGuard, async (req, res, next) => {
    try {
      const menus = await listMenusByAdmin(dbRef.conn);
      res.json({ menus });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/admin/menus', authGuard, adminGuard, async (req, res, next) => {
    try {
      const menu = await createMenuByAdmin(dbRef.conn, req.body || {});
      res.status(201).json({
        message: 'Menu berhasil dibuat',
        menu
      });
    } catch (error) {
      next(error);
    }
  });

  app.patch('/api/admin/menus/:productId', authGuard, adminGuard, async (req, res, next) => {
    try {
      const productId = normalizeProductId(req.params.productId || '');
      const result = await updateMenuByAdmin(dbRef.conn, productId, req.body || {});
      res.json({
        message: result.changed ? 'Menu berhasil diperbarui' : 'Tidak ada perubahan',
        result
      });
    } catch (error) {
      next(error);
    }
  });

  app.delete('/api/admin/menus/:productId', authGuard, adminGuard, async (req, res, next) => {
    try {
      const productId = normalizeProductId(req.params.productId || '');
      const result = await deleteMenuByAdmin(dbRef.conn, productId);
      res.json({
        message: 'Menu berhasil dihapus',
        result
      });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/admin/ingredients', authGuard, adminGuard, async (req, res, next) => {
    try {
      const ingredients = await listIngredientsByAdmin(dbRef.conn);
      res.json({ ingredients });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/admin/ingredients', authGuard, adminGuard, async (req, res, next) => {
    try {
      const ingredient = await createIngredientByAdmin(dbRef.conn, req.body || {});
      res.status(201).json({
        message: 'Bahan berhasil dibuat',
        ingredient
      });
    } catch (error) {
      next(error);
    }
  });

  app.patch('/api/admin/ingredients/:ingredientId', authGuard, adminGuard, async (req, res, next) => {
    try {
      const ingredientId = normalizeIngredientId(req.params.ingredientId || '');
      const result = await updateIngredientByAdmin(dbRef.conn, ingredientId, req.body || {});
      res.json({
        message: result.changed ? 'Bahan berhasil diperbarui' : 'Tidak ada perubahan',
        result
      });
    } catch (error) {
      next(error);
    }
  });

  app.delete('/api/admin/ingredients/:ingredientId', authGuard, adminGuard, async (req, res, next) => {
    try {
      const ingredientId = normalizeIngredientId(req.params.ingredientId || '');
      const result = await deleteIngredientByAdmin(dbRef.conn, ingredientId);
      res.json({
        message: 'Bahan berhasil dihapus',
        result
      });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/admin/db/tables', authGuard, adminGuard, async (req, res, next) => {
    try {
      const tables = await listDatabaseTables(dbRef.conn);
      res.json({ tables });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/admin/db/tables/:tableName', authGuard, adminGuard, async (req, res, next) => {
    try {
      const result = await getDatabaseTableData(dbRef.conn, req.params.tableName || '', {
        limit: req.query.limit,
        offset: req.query.offset
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/admin/users', authGuard, adminGuard, async (req, res, next) => {
    try {
      const users = await listUsers(dbRef.conn);
      res.json({ users });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/admin/users', authGuard, adminGuard, async (req, res, next) => {
    try {
      const result = await createUserByAdmin(dbRef.conn, req.body || {});
      res.status(201).json({
        message: 'User berhasil dibuat',
        user: result
      });
    } catch (error) {
      next(error);
    }
  });

  app.patch('/api/admin/users/:userId', authGuard, adminGuard, async (req, res, next) => {
    try {
      const userId = Number.parseInt(req.params.userId, 10);
      if (Number.isNaN(userId) || userId <= 0) {
        res.status(400).json({ message: 'User ID tidak valid' });
        return;
      }

      const result = await updateUserByAdmin(dbRef.conn, userId, req.body || {}, req.user.id);
      res.json({ message: 'User berhasil diperbarui', result });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/admin/users/:userId/reset-password', authGuard, adminGuard, async (req, res, next) => {
    try {
      const userId = Number.parseInt(req.params.userId, 10);
      if (Number.isNaN(userId) || userId <= 0) {
        res.status(400).json({ message: 'User ID tidak valid' });
        return;
      }

      const result = await resetPasswordByAdmin(dbRef.conn, userId, req.body || {});
      res.json({
        message: 'Password user berhasil direset',
        ...result
      });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/admin/backups', authGuard, adminGuard, async (req, res, next) => {
    try {
      const backups = await listBackups(dbRef.conn);
      res.json({
        backups: backups.map((item) => ({
          ...item,
          sizeHuman: bytesToHumanReadable(item.sizeBytes)
        }))
      });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/admin/backups', authGuard, adminGuard, async (req, res, next) => {
    try {
      const backup = await createBackup(dbRef.conn, {
        triggerType: 'manual',
        createdBy: req.user.id
      });

      res.status(201).json({
        message: 'Backup berhasil dibuat',
        backup: {
          ...backup,
          sizeHuman: bytesToHumanReadable(backup.sizeBytes)
        }
      });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/admin/backups/restore', authGuard, adminGuard, async (req, res, next) => {
    try {
      const fileName = req.body && typeof req.body.fileName === 'string' ? req.body.fileName : '';
      const result = await restoreBackup(dbRef, maintenanceRef, fileName, req.user.id);
      res.json({
        message: 'Restore backup berhasil',
        ...result
      });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/export/orders.xlsx', authGuard, adminGuard, async (req, res, next) => {
    try {
      const window = buildTimeWindow(req.query.range, req.query.date);
      const data = await buildOrdersWorksheetData(dbRef.conn, window);

      const workbook = XLSX.utils.book_new();
      const orderSheet = XLSX.utils.json_to_sheet(data.length ? data : [{ Info: 'Belum ada data order' }]);
      const infoSheet = XLSX.utils.json_to_sheet([
        { Key: 'Range', Value: window.range },
        { Key: 'Tanggal Acuan', Value: window.baseDate },
        { Key: 'Periode', Value: window.label },
        { Key: 'Total Baris', Value: data.length }
      ]);

      XLSX.utils.book_append_sheet(workbook, orderSheet, 'Orders');
      XLSX.utils.book_append_sheet(workbook, infoSheet, 'Info');

      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      const fileName = `orders-${window.range}-${window.baseDate}.xlsx`;

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(buffer);
    } catch (error) {
      next(error);
    }
  });

  app.use(express.static(PUBLIC_DIR));

  app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
      next();
      return;
    }

    if (req.method !== 'GET') {
      next();
      return;
    }

    res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
  });

  app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
      res.status(404).json({ message: 'API route tidak ditemukan' });
      return;
    }

    res.status(404).send('Not Found');
  });

  app.use((error, req, res, next) => {
    const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 500;
    const message = statusCode >= 500 ? 'Internal server error' : error.message;

    if (req.path.startsWith('/api/')) {
      res.status(statusCode).json({ message });
      return;
    }

    res.status(statusCode).send(message);
  });

  if (AUTO_BACKUP_INTERVAL_HOURS > 0) {
    const intervalMs = AUTO_BACKUP_INTERVAL_HOURS * 60 * 60 * 1000;
    const timer = setInterval(async () => {
      try {
        if (maintenanceRef.active) return;
        await createBackup(dbRef.conn, { triggerType: 'auto', createdBy: null });
      } catch (error) {
        console.error('Auto backup failed:', error.message);
      }
    }, intervalMs);

    if (typeof timer.unref === 'function') {
      timer.unref();
    }
  }

  app.listen(PORT, () => {
    console.log(`POI Coffee app running at http://localhost:${PORT}`);
    console.log('Demo login kasir -> username: kasir | password: kasir123');
    console.log('Demo login admin -> username: admin | password: admin123');
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
