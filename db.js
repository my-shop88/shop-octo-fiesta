/**
 * 数据库模块 - SQLite
 */
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '..', '..', 'data', 'yunshang.db');

// 创建数据库连接
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('数据库连接失败:', err);
  } else {
    console.log('✅ SQLite 数据库已连接');
  }
});

// 启用外键约束
db.run('PRAGMA foreign_keys = ON');

// 初始化数据库表
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 用户表
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          phone TEXT,
          avatar TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 商品表
      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          price REAL NOT NULL,
          original_price REAL,
          stock INTEGER DEFAULT 0,
          category TEXT,
          images TEXT,
          status TEXT DEFAULT 'active',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 订单表
      db.run(`
        CREATE TABLE IF NOT EXISTS orders (
          id TEXT PRIMARY KEY,
          user_id TEXT,
          total_amount REAL NOT NULL,
          status TEXT DEFAULT 'pending',
          payment_id TEXT,
          payment_method TEXT,
          tracking_number TEXT,
          carrier TEXT,
          shipping_address TEXT,
          remark TEXT,
          paid_at DATETIME,
          shipped_at DATETIME,
          completed_at DATETIME,
          cancelled_at DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      // 订单商品表
      db.run(`
        CREATE TABLE IF NOT EXISTS order_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id TEXT NOT NULL,
          product_id INTEGER NOT NULL,
          product_name TEXT,
          price REAL NOT NULL,
          quantity INTEGER NOT NULL,
          subtotal REAL NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
        )
      `);

      // 购物车表
      db.run(`
        CREATE TABLE IF NOT EXISTS cart (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT NOT NULL,
          product_id INTEGER NOT NULL,
          quantity INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, product_id),
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);

      // 物流轨迹表
      db.run(`
        CREATE TABLE IF NOT EXISTS shipping_tracks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id TEXT NOT NULL,
          tracking_number TEXT NOT NULL,
          carrier TEXT,
          status TEXT,
          trace_data TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
};

// 插入示例商品
const seedProducts = () => {
  return new Promise((resolve, reject) => {
    const products = [
      ['智能手表 Pro', '高清触屏，心率监测，7天续航', 1299.00, 1599.00, 100, '电子产品', '["watch1.jpg", "watch2.jpg"]', 'active'],
      ['无线蓝牙耳机', '主动降噪，30小时续航', 399.00, 499.00, 200, '电子产品', '["earphone1.jpg"]', 'active'],
      ['便携充电宝', '20000mAh大容量，快充支持', 149.00, 199.00, 150, '配件', '["powerbank1.jpg"]', 'active'],
      ['机械键盘', '青轴手感，RGB背光', 299.00, 399.00, 80, '电脑配件', '["keyboard1.jpg"]', 'active'],
      ['4K显示器', '27英寸IPS面板，色彩精准', 1899.00, 2299.00, 50, '电脑配件', '["monitor1.jpg"]', 'active'],
      ['智能手环', '运动追踪，睡眠监测', 199.00, 249.00, 300, '电子产品', '["band1.jpg"]', 'active']
    ];

    const stmt = db.prepare(`
      INSERT OR IGNORE INTO products (name, description, price, original_price, stock, category, images, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    products.forEach(p => stmt.run(p));
    stmt.finalize((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

// 数据库操作封装
const dbQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

module.exports = {
  db,
  initDatabase,
  seedProducts,
  dbQuery,
  dbRun,
  dbGet
};
