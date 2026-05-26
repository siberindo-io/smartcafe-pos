const path = require('path');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const DB_PATH = path.join(__dirname, '..', 'data', 'poi_coffee.sqlite');

const dummyUsers = [
  {
    username: 'admin_ops',
    fullName: 'Admin Operations',
    role: 'admin',
    password: 'adminops123',
    isActive: true
  },
  {
    username: 'admin_finance',
    fullName: 'Admin Finance',
    role: 'admin',
    password: 'adminfin123',
    isActive: true
  },
  {
    username: 'kasir_pagi',
    fullName: 'Kasir Shift Pagi',
    role: 'cashier',
    password: 'kasirpagi123',
    isActive: true
  },
  {
    username: 'kasir_siang',
    fullName: 'Kasir Shift Siang',
    role: 'cashier',
    password: 'kasirsiang123',
    isActive: true
  },
  {
    username: 'kasir_malam',
    fullName: 'Kasir Shift Malam',
    role: 'cashier',
    password: 'kasirmalam123',
    isActive: true
  }
];

const dummyMenus = [
  {
    id: 'P012',
    name: 'Vanilla Latte',
    category: 'Coffee',
    price: 29000,
    description: 'Espresso dengan susu dan sirup vanilla.',
    icon: 'coffee',
    isActive: true,
    stock: 35,
    minStock: 10
  },
  {
    id: 'P013',
    name: 'Hazelnut Latte',
    category: 'Coffee',
    price: 30000,
    description: 'Latte creamy dengan rasa hazelnut.',
    icon: 'coffee',
    isActive: true,
    stock: 30,
    minStock: 10
  },
  {
    id: 'P014',
    name: 'Mocha',
    category: 'Coffee',
    price: 31000,
    description: 'Kopi cokelat dengan foam susu lembut.',
    icon: 'coffee',
    isActive: true,
    stock: 28,
    minStock: 10
  },
  {
    id: 'P015',
    name: 'Piccolo',
    category: 'Coffee',
    price: 24000,
    description: 'Espresso shot dengan sedikit steamed milk.',
    icon: 'coffee',
    isActive: true,
    stock: 25,
    minStock: 8
  },
  {
    id: 'P016',
    name: 'Iced Shaken Espresso',
    category: 'Coffee',
    price: 32000,
    description: 'Espresso dingin yang disajikan shaken.',
    icon: 'coffee',
    isActive: true,
    stock: 24,
    minStock: 8
  },
  {
    id: 'P017',
    name: 'Chocolate Milk',
    category: 'Non Coffee',
    price: 23000,
    description: 'Minuman susu cokelat dingin.',
    icon: 'non-coffee',
    isActive: true,
    stock: 40,
    minStock: 12
  },
  {
    id: 'P018',
    name: 'Strawberry Milk',
    category: 'Non Coffee',
    price: 23000,
    description: 'Susu strawberry segar.',
    icon: 'non-coffee',
    isActive: true,
    stock: 34,
    minStock: 12
  },
  {
    id: 'P019',
    name: 'Lemon Tea',
    category: 'Non Coffee',
    price: 19000,
    description: 'Teh lemon dingin.',
    icon: 'non-coffee',
    isActive: true,
    stock: 38,
    minStock: 15
  },
  {
    id: 'P020',
    name: 'Lychee Tea',
    category: 'Non Coffee',
    price: 21000,
    description: 'Teh lychee manis segar.',
    icon: 'non-coffee',
    isActive: true,
    stock: 36,
    minStock: 15
  },
  {
    id: 'P021',
    name: 'Banana Bread',
    category: 'Snack',
    price: 22000,
    description: 'Roti pisang lembut.',
    icon: 'snack',
    isActive: true,
    stock: 18,
    minStock: 6
  },
  {
    id: 'P022',
    name: 'Butter Croffle',
    category: 'Snack',
    price: 25000,
    description: 'Croffle dengan butter premium.',
    icon: 'snack',
    isActive: true,
    stock: 16,
    minStock: 6
  },
  {
    id: 'P023',
    name: 'Cheese Cake Slice',
    category: 'Snack',
    price: 32000,
    description: 'Potongan cheesecake creamy.',
    icon: 'snack',
    isActive: true,
    stock: 14,
    minStock: 5
  },
  {
    id: 'P024',
    name: 'Oat Cookie',
    category: 'Snack',
    price: 14000,
    description: 'Kue oat renyah.',
    icon: 'snack',
    isActive: true,
    stock: 42,
    minStock: 15
  },
  {
    id: 'P025',
    name: 'Syrup Vanilla',
    category: 'Add On',
    price: 6000,
    description: 'Tambahan sirup vanilla.',
    icon: 'addon',
    isActive: true,
    stock: 55,
    minStock: 20
  },
  {
    id: 'P026',
    name: 'Whipped Cream',
    category: 'Add On',
    price: 5000,
    description: 'Tambahan whipped cream.',
    icon: 'addon',
    isActive: true,
    stock: 50,
    minStock: 20
  }
];

const dummyIngredients = [
  {
    id: 'B001',
    name: 'Biji Kopi Arabica',
    category: 'Coffee Beans',
    unit: 'gram',
    stockQty: 5200,
    minStockQty: 1500,
    costPerUnit: 190,
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
    description: 'Kebutuhan es untuk minuman dingin.',
    isActive: true
  }
];

function nowIso() {
  return new Date().toISOString();
}

async function upsertDummyUsers(db) {
  let inserted = 0;
  let updated = 0;

  for (const user of dummyUsers) {
    const existing = await db.get(
      'SELECT id, created_at FROM users WHERE username = ? LIMIT 1;',
      user.username
    );
    const passwordHash = await bcrypt.hash(user.password, 10);
    const timestamp = nowIso();

    if (!existing) {
      await db.run(
        `INSERT INTO users
          (username, password_hash, full_name, role, is_active, failed_attempts, locked_until, last_login_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 0, NULL, NULL, ?, ?);`,
        user.username,
        passwordHash,
        user.fullName,
        user.role,
        user.isActive ? 1 : 0,
        timestamp,
        timestamp
      );
      inserted += 1;
      continue;
    }

    await db.run(
      `UPDATE users
       SET password_hash = ?,
           full_name = ?,
           role = ?,
           is_active = ?,
           failed_attempts = 0,
           locked_until = NULL,
           updated_at = ?
       WHERE id = ?;`,
      passwordHash,
      user.fullName,
      user.role,
      user.isActive ? 1 : 0,
      timestamp,
      existing.id
    );
    updated += 1;
  }

  return { inserted, updated };
}

async function upsertDummyMenus(db) {
  let inserted = 0;
  let updated = 0;

  for (const menu of dummyMenus) {
    const existing = await db.get(
      'SELECT id, created_at FROM products WHERE id = ? LIMIT 1;',
      menu.id
    );
    const createdAt = existing ? existing.created_at : nowIso();
    const updatedAt = nowIso();

    if (!existing) {
      inserted += 1;
    } else {
      updated += 1;
    }

    await db.run(
      `INSERT OR REPLACE INTO products
        (id, name, category, price, description, photo_url, icon, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      menu.id,
      menu.name,
      menu.category,
      menu.price,
      menu.description,
      '',
      menu.icon,
      menu.isActive ? 1 : 0,
      createdAt,
      updatedAt
    );

    await db.run(
      `INSERT INTO inventory (product_id, stock, min_stock)
       VALUES (?, ?, ?)
       ON CONFLICT(product_id) DO UPDATE SET
         stock = excluded.stock,
         min_stock = excluded.min_stock;`,
      menu.id,
      menu.stock,
      menu.minStock
    );
  }

  return { inserted, updated };
}

async function upsertDummyIngredients(db) {
  let inserted = 0;
  let updated = 0;

  for (const ingredient of dummyIngredients) {
    const existing = await db.get(
      'SELECT id, created_at FROM ingredients WHERE id = ? LIMIT 1;',
      ingredient.id
    );
    const createdAt = existing ? existing.created_at : nowIso();
    const updatedAt = nowIso();

    if (!existing) {
      inserted += 1;
    } else {
      updated += 1;
    }

    await db.run(
      `INSERT OR REPLACE INTO ingredients
        (id, name, category, unit, stock_qty, min_stock_qty, cost_per_unit, photo_url, description, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, '', ?, ?, ?, ?);`,
      ingredient.id,
      ingredient.name,
      ingredient.category,
      ingredient.unit,
      ingredient.stockQty,
      ingredient.minStockQty,
      ingredient.costPerUnit,
      ingredient.description,
      ingredient.isActive ? 1 : 0,
      createdAt,
      updatedAt
    );
  }

  return { inserted, updated };
}

async function main() {
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });

  await db.exec('PRAGMA foreign_keys = ON;');
  await db.exec(`
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
  `);
  await db.exec('BEGIN;');

  try {
    const usersResult = await upsertDummyUsers(db);
    const menusResult = await upsertDummyMenus(db);
    const ingredientsResult = await upsertDummyIngredients(db);
    await db.exec('COMMIT;');

    const userCount = await db.get('SELECT COUNT(*) AS total FROM users;');
    const productCount = await db.get('SELECT COUNT(*) AS total FROM products;');
    const activeProductCount = await db.get(
      'SELECT COUNT(*) AS total FROM products WHERE is_active = 1;'
    );
    const ingredientCount = await db.get('SELECT COUNT(*) AS total FROM ingredients;');
    const activeIngredientCount = await db.get(
      'SELECT COUNT(*) AS total FROM ingredients WHERE is_active = 1;'
    );

    console.log(
      JSON.stringify(
        {
          users: usersResult,
          menus: menusResult,
          ingredients: ingredientsResult,
          totals: {
            users: userCount.total,
            products: productCount.total,
            activeProducts: activeProductCount.total,
            ingredients: ingredientCount.total,
            activeIngredients: activeIngredientCount.total
          }
        },
        null,
        2
      )
    );
  } catch (error) {
    await db.exec('ROLLBACK;');
    throw error;
  } finally {
    await db.close();
  }
}

main().catch((error) => {
  console.error('Seeding dummy data gagal:', error);
  process.exit(1);
});
