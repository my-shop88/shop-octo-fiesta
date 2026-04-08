/**
 * 物流路由 - 快递100集成
 */
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const router = express.Router();

// 支持的快递公司
const SUPPORTED_CARRIERS = {
  'sf': { name: '顺丰速运', code: 'shunfeng' },
  'jd': { name: '京东物流', code: 'jd' },
  'ems': { name: 'EMS', code: 'ems' },
  'yt': { name: '圆通速递', code: 'yuantong' },
  'zt': { name: '中通快递', code: 'zhongtong' },
  'st': { name: '申通快递', code: 'shentong' },
  'yd': { name: '韵达速递', code: 'yunda' }
};

// 创建物流订单
router.post('/create', async (req, res) => {
  try {
    const { orderId, carrier, sender, receiver, goods } = req.body;
    
    if (!orderId || !carrier || !sender || !receiver) {
      return res.status(400).json({ 
        success: false, 
        message: '缺少必要参数' 
      });
    }

    const carrierInfo = SUPPORTED_CARRIERS[carrier];
    if (!carrierInfo) {
      return res.status(400).json({ 
        success: false, 
        message: '不支持的快递公司' 
      });
    }

    // 构建快递100下单参数
    const param = {
      com: carrierInfo.code,
      rec_man: {
        name: receiver.name,
        mobile: receiver.mobile,
        province: receiver.province,
        city: receiver.city,
        district: receiver.district,
        addr: receiver.address
      },
      send_man: {
        name: sender.name,
        mobile: sender.mobile,
        province: sender.province,
        city: sender.city,
        district: sender.district,
        addr: sender.address
      },
      cargo: {
        name: goods.name || '商品',
        count: goods.count || 1
      },
      partnerId: orderId,
      partnerKey: process.env.KUaidi100_KEY
    };

    const sign = generateKuaidi100Sign(param, process.env.KUaidi100_KEY);
    
    const requestData = {
      method: 'order',
      key: process.env.KUaidi100_KEY,
      sign: sign,
      t: Date.now(),
      param: JSON.stringify(param)
    };

    // 调用快递100 API
    const response = await axios.post(
      'https://poll.kuaidi100.com/order/borderbestapi.do',
      requestData,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    if (response.data.result === true) {
      res.json({
        success: true,
        data: {
          trackingNumber: response.data.data.kuaidinum,
          orderId: response.data.data.orderId,
          carrier: carrierInfo.name,
          carrierCode: carrierInfo.code
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: response.data.message || '创建物流订单失败'
      });
    }
  } catch (error) {
    console.error('创建物流订单失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 查询物流轨迹
router.get('/track/:trackingNumber', async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const { carrier } = req.query;
    
    if (!carrier) {
      return res.status(400).json({ 
        success: false, 
        message: '缺少快递公司代码' 
      });
    }

    const param = {
      com: carrier,
      num: trackingNumber,
      phone: '' // 收件人/寄件人手机号后四位
    };

    const sign = generateKuaidi100Sign(param, process.env.KUaidi100_KEY);

    const requestData = {
      customer: process.env.KUaidi100_CUSTOMER,
      sign: sign,
      param: JSON.stringify(param)
    };

    const response = await axios.post(
      'https://poll.kuaidi100.com/poll/query.do',
      requestData,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    if (response.data.status === '200') {
      res.json({
        success: true,
        data: {
          trackingNumber: response.data.nu,
          carrier: response.data.com,
          state: response.data.state, // 0-暂无轨迹 1-已揽收 2-在途中 3-已签收 4-问题件
          isSign: response.data.ischeck === '1',
          traces: response.data.data.map(item => ({
            time: item.time,
            description: item.context,
            location: item.location || ''
          }))
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: response.data.message || '查询物流失败'
      });
    }
  } catch (error) {
    console.error('查询物流轨迹失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 订阅物流轨迹推送
router.post('/subscribe', async (req, res) => {
  try {
    const { trackingNumber, carrier, orderId } = req.body;
    
    const param = {
      company: carrier,
      number: trackingNumber,
      key: process.env.KUaidi100_KEY,
      parameters: {
        callbackurl: process.env.KUaidi100_CALLBACK_URL,
        salt: orderId,
        resultv2: '1' // 开启物流轨迹增值信息
      }
    };

    const requestData = {
      schema: 'json',
      param: JSON.stringify(param)
    };

    const response = await axios.post(
      'https://poll.kuaidi100.com/poll',
      requestData,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    if (response.data.result === true) {
      res.json({
        success: true,
        message: '订阅成功',
        data: { trackingNumber }
      });
    } else {
      res.status(400).json({
        success: false,
        message: response.data.returnCode || '订阅失败'
      });
    }
  } catch (error) {
    console.error('订阅物流推送失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 快递100回调 - 物流轨迹推送
router.post('/kuaidi100/callback', (req, res) => {
  try {
    const { param, sign } = req.body;
    
    // 验证签名
    const calcSign = crypto.createHash('md5')
      .update(param + process.env.KUaidi100_KEY)
      .digest('hex');
    
    if (sign !== calcSign) {
      return res.json({ result: false, returnCode: '500', message: '签名验证失败' });
    }

    const data = JSON.parse(param);
    const { status, lastResult, salt } = data;
    
    // 更新订单物流状态
    console.log(`订单 ${salt} 物流更新:`, {
      trackingNumber: lastResult.nu,
      state: lastResult.state,
      latestTrace: lastResult.data[0]
    });

    // TODO: 更新数据库中的订单物流状态

    res.json({ result: true, returnCode: '200', message: '成功' });
  } catch (error) {
    console.error('处理物流回调失败:', error);
    res.json({ result: false, returnCode: '500', message: '处理失败' });
  }
});

// 获取支持的快递公司列表
router.get('/carriers', (req, res) => {
  res.json({
    success: true,
    data: Object.entries(SUPPORTED_CARRIERS).map(([key, value]) => ({
      code: key,
      name: value.name,
      kuaidi100Code: value.code
    }))
  });
});

// 工具函数
function generateKuaidi100Sign(param, key) {
  const str = JSON.stringify(param) + key;
  return crypto.createHash('md5').update(str).digest('hex').toUpperCase();
}

module.exports = router;
