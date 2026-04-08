/**
 * 订单路由 - 订单CRUD (SQLite版本)
 */
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { dbRun, dbGet, dbQuery } = require('../models/db');
const router = express.Router();

// 创建订单
router.post('/create', async (req, res) => {
  try {
    const { userId, items, totalAmount, shippingAddress, remark } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: '购物车不能为空' 
      });
    }

    const orderId = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase();
    
    // 创建订单
    await dbRun(`
      INSERT INTO orders (id, user_id, total_amount, shipping_address, remark, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [orderId, userId || null, totalAmount, JSON.stringify(shippingAddress), remark || '', 'pending']);
    
    // 创建订单商品
    for (const item of items) {
      await dbRun(`
        INSERT INTO order_items (order_id, product_id, product_name, price, quantity, subtotal)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [orderId, item.productId, item.name, item.price, item.quantity, item.price * item.quantity]);
    }

    res.json({
      success: true,
      data: {
        orderId,
        totalAmount,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('创建订单失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 查询订单
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await dbGet('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (!order) {
      return res.status(404).json({ success: false, message: '订单不存在' });
    }
    
    // 获取订单商品
    const items = await dbQuery('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
    
    // 解析地址
    try {
      order.shipping_address = JSON.parse(order.shipping_address || '{}');
    } catch {
      order.shipping_address = {};
    }
    
    res.json({
      success: true,
      data: { ...order, items }
    });
  } catch (error) {
    console.error('查询订单失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 更新订单状态
router.put('/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, paymentId, trackingNumber, carrier } = req.body;
    
    const order = await dbGet('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (!order) {
      return res.status(404).json({ success: false, message: '订单不存在' });
    }

    const updates = [];
    const params = [];
    
    if (status) {
      updates.push('status = ?');
      params.push(status);
      
      // 更新时间戳
      if (status === 'paid') {
        updates.push('paid_at = CURRENT_TIMESTAMP');
      } else if (status === 'shipped') {
        updates.push('shipped_at = CURRENT_TIMESTAMP');
      } else if (status === 'completed') {
        updates.push('completed_at = CURRENT_TIMESTAMP');
      } else if (status === 'cancelled') {
        updates.push('cancelled_at = CURRENT_TIMESTAMP');
      }
    }
    
    if (paymentId) {
      updates.push('payment_id = ?');
      params.push(paymentId);
    }
    
    if (trackingNumber) {
      updates.push('tracking_number = ?');
      params.push(trackingNumber);
    }
    
    if (carrier) {
      updates.push('carrier = ?');
      params.push(carrier);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: '没有要更新的字段' });
    }
    
    params.push(orderId);
    
    await dbRun(`
      UPDATE orders SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `, params);

    res.json({
      success: true,
      message: '订单更新成功',
      data: { orderId, status }
    });
  } catch (error) {
    console.error('更新订单失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 获取用户订单列表
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;
    
    let sql = 'SELECT * FROM orders WHERE user_id = ?';
    const params = [userId];
    
    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }
    
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
    
    const orders = await dbQuery(sql, params);
    
    // 获取每个订单的商品
    for (const order of orders) {
      order.items = await dbQuery('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      try {
        order.shipping_address = JSON.parse(order.shipping_address || '{}');
      } catch {
        order.shipping_address = {};
      }
    }

    res.json({
      success: true,
      data: {
        orders,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('获取订单列表失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 取消订单
router.post('/:orderId/cancel', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    
    const order = await dbGet('SELECT status FROM orders WHERE id = ?', [orderId]);
    if (!order) {
      return res.status(404).json({ success: false, message: '订单不存在' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ success: false, message: '只能取消待支付订单' });
    }

    await dbRun(`
      UPDATE orders SET status = 'cancelled', remark = ?, cancelled_at = CURRENT_TIMESTAMP WHERE id = ?
    `, [reason || '', orderId]);

    res.json({
      success: true,
      message: '订单已取消',
      data: { orderId, status: 'cancelled' }
    });
  } catch (error) {
    console.error('取消订单失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

module.exports = router;
