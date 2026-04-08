/**
 * 用户路由 - 用户认证 (SQLite版本)
 */
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { dbRun, dbGet } = require('../models/db');
const router = express.Router();

// JWT验证中间件
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: '未提供认证令牌' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: '无效的认证令牌' });
  }
};

// 用户注册
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: '用户名、邮箱和密码为必填项' 
      });
    }

    // 检查用户是否已存在
    const existingUser = await dbGet('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
    if (existingUser) {
      return res.status(409).json({ success: false, message: '用户已存在' });
    }

    // 密码加密
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    
    await dbRun(`
      INSERT INTO users (id, username, email, password, phone)
      VALUES (?, ?, ?, ?, ?)
    `, [userId, username, email, hashedPassword, phone || '']);

    // 生成JWT
    const token = jwt.sign(
      { userId, username },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: '注册成功',
      data: {
        user: { id: userId, username, email, phone: phone || '' },
        token
      }
    });
  } catch (error) {
    console.error('用户注册失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 用户登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: '用户名和密码为必填项' 
      });
    }

    // 查找用户
    const user = await dbGet('SELECT * FROM users WHERE email = ? OR username = ?', [username, username]);
    if (!user) {
      return res.status(401).json({ success: false, message: '用户名或密码错误' });
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: '用户名或密码错误' });
    }

    // 生成JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: '登录成功',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar
        },
        token
      }
    });
  } catch (error) {
    console.error('用户登录失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 获取当前用户信息
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await dbGet('SELECT id, username, email, phone, avatar, created_at FROM users WHERE id = ?', [req.user.userId]);
    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 更新用户信息
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { phone, avatar } = req.body;
    const userId = req.user.userId;
    
    const updates = [];
    const params = [];
    
    if (phone !== undefined) {
      updates.push('phone = ?');
      params.push(phone);
    }
    
    if (avatar !== undefined) {
      updates.push('avatar = ?');
      params.push(avatar);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: '没有要更新的字段' });
    }
    
    params.push(userId);
    
    await dbRun(`
      UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `, params);

    const user = await dbGet('SELECT id, username, email, phone, avatar FROM users WHERE id = ?', [userId]);
    res.json({ success: true, message: '更新成功', data: user });
  } catch (error) {
    console.error('更新用户信息失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 修改密码
router.put('/password', authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.userId;
    
    const user = await dbGet('SELECT password FROM users WHERE id = ?', [userId]);
    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }

    // 验证旧密码
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: '原密码错误' });
    }

    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await dbRun('UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [hashedPassword, userId]);

    res.json({ success: true, message: '密码修改成功' });
  } catch (error) {
    console.error('修改密码失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

module.exports = router;
