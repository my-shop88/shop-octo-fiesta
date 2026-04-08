/**
 * 支付路由 - 微信支付 & 支付宝
 */
const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const router = express.Router();

// 微信支付 - 统一下单
router.post('/wechat/create', async (req, res) => {
  try {
    const { orderId, amount, description, openid } = req.body;
    
    // 参数验证
    if (!orderId || !amount || !openid) {
      return res.status(400).json({ 
        success: false, 
        message: '缺少必要参数' 
      });
    }

    // 构建微信支付参数
    const params = {
      appid: process.env.WECHAT_PAY_APPID,
      mch_id: process.env.WECHAT_PAY_MCHID,
      nonce_str: generateNonceStr(),
      body: description || '云商商品',
      out_trade_no: orderId,
      total_fee: Math.round(amount * 100), // 转为分
      spbill_create_ip: req.ip || '127.0.0.1',
      notify_url: process.env.WECHAT_PAY_NOTIFY_URL,
      trade_type: 'JSAPI',
      openid: openid
    };

    // 生成签名
    params.sign = generateWechatSign(params, process.env.WECHAT_PAY_KEY);

    // 调用微信支付API
    const xml = buildXml(params);
    const response = await axios.post(
      'https://api.mch.weixin.qq.com/pay/unifiedorder',
      xml,
      { headers: { 'Content-Type': 'text/xml' } }
    );

    // 解析返回的XML
    const result = parseXml(response.data);
    
    if (result.return_code === 'SUCCESS' && result.result_code === 'SUCCESS') {
      // 生成前端调起支付参数
      const payParams = {
        appId: result.appid,
        timeStamp: String(Math.floor(Date.now() / 1000)),
        nonceStr: generateNonceStr(),
        package: `prepay_id=${result.prepay_id}`,
        signType: 'MD5'
      };
      payParams.paySign = generateWechatSign(payParams, process.env.WECHAT_PAY_KEY);

      res.json({
        success: true,
        data: payParams
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.err_code_des || '创建支付订单失败'
      });
    }
  } catch (error) {
    console.error('微信支付创建订单失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 微信支付回调通知
router.post('/wechat/notify', (req, res) => {
  try {
    const xml = req.body;
    const result = parseXml(xml);
    
    // 验证签名
    const sign = result.sign;
    delete result.sign;
    const calcSign = generateWechatSign(result, process.env.WECHAT_PAY_KEY);
    
    if (sign !== calcSign) {
      return res.send(buildXml({ return_code: 'FAIL', return_msg: '签名失败' }));
    }

    if (result.return_code === 'SUCCESS' && result.result_code === 'SUCCESS') {
      // 更新订单状态
      const orderId = result.out_trade_no;
      const transactionId = result.transaction_id;
      
      // TODO: 更新数据库订单状态为已支付
      console.log(`订单 ${orderId} 支付成功，微信交易号: ${transactionId}`);
      
      res.send(buildXml({ return_code: 'SUCCESS', return_msg: 'OK' }));
    } else {
      res.send(buildXml({ return_code: 'FAIL', return_msg: '支付失败' }));
    }
  } catch (error) {
    console.error('微信支付回调处理失败:', error);
    res.send(buildXml({ return_code: 'FAIL', return_msg: '处理失败' }));
  }
});

// 支付宝 - 创建支付订单
router.post('/alipay/create', async (req, res) => {
  try {
    const { orderId, amount, subject, body } = req.body;
    
    if (!orderId || !amount) {
      return res.status(400).json({ 
        success: false, 
        message: '缺少必要参数' 
      });
    }

    const params = {
      app_id: process.env.ALIPAY_APPID,
      method: 'alipay.trade.page.pay',
      charset: 'utf-8',
      sign_type: 'RSA2',
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
      version: '1.0',
      notify_url: process.env.ALIPAY_NOTIFY_URL,
      biz_content: JSON.stringify({
        out_trade_no: orderId,
        total_amount: amount,
        subject: subject || '云商商品',
        body: body || '',
        product_code: 'FAST_INSTANT_TRADE_PAY'
      })
    };

    // 生成签名
    params.sign = generateAlipaySign(params, process.env.ALIPAY_PRIVATE_KEY);

    // 构建支付URL
    const payUrl = 'https://openapi.alipay.com/gateway.do?' + 
      Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join('&');

    res.json({
      success: true,
      data: { payUrl }
    });
  } catch (error) {
    console.error('支付宝创建订单失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 支付宝回调通知
router.post('/alipay/notify', (req, res) => {
  try {
    const params = req.body;
    const sign = params.sign;
    delete params.sign;
    delete params.sign_type;

    // 验证签名
    const calcSign = generateAlipaySign(params, process.env.ALIPAY_PRIVATE_KEY);
    
    if (sign !== calcSign) {
      return res.send('fail');
    }

    if (params.trade_status === 'TRADE_SUCCESS' || params.trade_status === 'TRADE_FINISHED') {
      const orderId = params.out_trade_no;
      const tradeNo = params.trade_no;
      
      // TODO: 更新数据库订单状态为已支付
      console.log(`订单 ${orderId} 支付宝支付成功，交易号: ${tradeNo}`);
      
      res.send('success');
    } else {
      res.send('fail');
    }
  } catch (error) {
    console.error('支付宝回调处理失败:', error);
    res.send('fail');
  }
});

// 工具函数
function generateNonceStr() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

function generateWechatSign(params, key) {
  const sorted = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
  const stringSignTemp = sorted + '&key=' + key;
  return crypto.createHash('md5').update(stringSignTemp).digest('hex').toUpperCase();
}

function generateAlipaySign(params, privateKey) {
  const sorted = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(sorted);
  return sign.sign(privateKey, 'base64');
}

function buildXml(obj) {
  let xml = '<xml>';
  for (const [key, value] of Object.entries(obj)) {
    xml += `<${key}><![CDATA[${value}]]></${key}>`;
  }
  xml += '</xml>';
  return xml;
}

function parseXml(xml) {
  const result = {};
  const regex = /<(\w+)>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/\w+>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    result[match[1]] = match[2];
  }
  return result;
}

module.exports = router;
