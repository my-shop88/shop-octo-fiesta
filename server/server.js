/**
 * 云商后端服务主入口 - SQLite版本
 */
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initDatabase, seedProducts } = require('./models/db');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务（前端文件）
app.use(express.static(path.join(__dirname, '..')));

// 路由
app.use('/api/pay', require('./routes/pay'));
app.use('/api/shipping', require('./routes/shipping'));
app.use('/api/order', require('./routes/order'));
app.use('/api/user', require('./routes/user'));

// 商品列表API
app.get('/api/products', async (req, res) => {
  try {
    const { dbQuery } = require('./models/db');
    const { category, page = 1, limit = 10 } = req.query;
    
    let sql = 'SELECT * FROM products WHERE status = ?';
    const params = ['active'];
    
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
    
    const products = await dbQuery(sql, params);
    
    // 解析 images JSON
    products.forEach(p => {
      try {
        p.images = JSON.parse(p.images || '[]');
      } catch {
        p.images = [];
      }
    });
    
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('获取商品列表失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 商品详情API
app.get('/api/products/:id', async (req, res) => {
  try {
    const { dbGet } = require('./models/db');
    const product = await dbGet('SELECT * FROM products WHERE id = ?', [req.params.id]);
    
    if (!product) {
      return res.status(404).json({ success: false, message: '商品不存在' });
    }
    
    try {
      product.images = JSON.parse(product.images || '[]');
    } catch {
      product.images = [];
    }
    
    res.json({ success: true, data: product });
  } catch (error) {
    console.error('获取商品详情失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false, 
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({ success: false, message: '接口不存在' });
});

// 初始化数据库并启动服务
const startServer = async () => {
  try {
    // 创建数据目录
    const fs = require('fs');
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // 初始化数据库
    await initDatabase();
    console.log('✅ 数据库表已初始化');
    
    // 插入示例数据
    await seedProducts();
    console.log('✅ 示例商品已加载');
    
    // 启动服务
    app.listen(PORT, () => {
      console.log(`🚀 云商后端服务已启动: http://localhost:${PORT}`);
      console.log(`📖 API文档: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('启动失败:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
