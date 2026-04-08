/**
 * 云商 API 模块 - 前端后端对接
 * API 基础地址: http://localhost:3000/api
 */

const API_BASE = 'http://localhost:3000/api';

// ===== 通用请求函数 =====
async function apiRequest(url, options = {}) {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(`${API_BASE}${url}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || '请求失败');
    }
    
    return data;
  } catch (error) {
    console.error('API请求失败:', error);
    throw error;
  }
}

// ===== 用户认证 API =====
const UserAPI = {
  // 注册
  async register(userData) {
    const data = await apiRequest('/user/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    if (data.success && data.data.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    return data;
  },

  // 登录
  async login(credentials) {
    const data = await apiRequest('/user/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    if (data.success && data.data.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    return data;
  },

  // 获取用户信息
  async getProfile() {
    return await apiRequest('/user/profile');
  },

  // 更新用户信息
  async updateProfile(profileData) {
    return await apiRequest('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  // 退出登录
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
  },

  // 获取当前用户
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // 是否已登录
  isLoggedIn() {
    return !!localStorage.getItem('token');
  }
};

// ===== 商品 API =====
const ProductAPI = {
  // 获取商品列表
  async getList(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await apiRequest(`/products?${query}`);
  },

  // 获取商品详情
  async getDetail(id) {
    return await apiRequest(`/products/${id}`);
  }
};

// ===== 购物车 API (本地存储 + 后端同步) =====
const CartAPI = {
  // 获取购物车
  getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
  },

  // 保存购物车
  saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadgeUI();
  },

  // 添加商品
  addItem(product) {
    const cart = this.getCart();
    const existing = cart.find(item => item.id === product.id);
    
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    
    this.saveCart(cart);
    return cart;
  },

  // 更新数量
  updateQty(productId, qty) {
    let cart = this.getCart();
    const index = cart.findIndex(item => item.id === productId);
    
    if (index > -1) {
      if (qty <= 0) {
        cart.splice(index, 1);
      } else {
        cart[index].qty = qty;
      }
      this.saveCart(cart);
    }
    
    return cart;
  },

  // 删除商品
  removeItem(productId) {
    let cart = this.getCart();
    cart = cart.filter(item => item.id !== productId);
    this.saveCart(cart);
    return cart;
  },

  // 清空购物车
  clear() {
    localStorage.removeItem('cart');
    updateCartBadgeUI();
  },

  // 计算总价
  getTotal() {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  },

  // 获取商品数量
  getCount() {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }
};

// ===== 订单 API =====
const OrderAPI = {
  // 创建订单
  async create(orderData) {
    return await apiRequest('/order/create', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  // 获取订单详情
  async getDetail(orderId) {
    return await apiRequest(`/order/${orderId}`);
  },

  // 获取用户订单列表
  async getUserOrders(userId, params = {}) {
    const query = new URLSearchParams(params).toString();
    return await apiRequest(`/order/user/${userId}${query ? '?' + query : ''}`);
  },

  // 获取当前用户订单列表（便捷方法）
  async getList(params = {}) {
    const user = UserAPI.getCurrentUser();
    if (!user) {
      return { success: false, message: '请先登录', data: [] };
    }
    const result = await this.getUserOrders(user.id, params);
    if (result.success && result.data) {
      // 兼容两种返回格式
      return {
        success: true,
        data: result.data.orders || result.data || []
      };
    }
    return result;
  },

  // 取消订单
  async cancel(orderId, reason) {
    return await apiRequest(`/order/${orderId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason: reason || '用户取消' })
    });
  },

  // 确认收货
  async confirmReceive(orderId) {
    return await apiRequest(`/order/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'delivered' })
    });
  }
};

// ===== 支付 API =====
const PayAPI = {
  // 创建支付订单
  async createPayment(paymentData) {
    return await apiRequest('/pay/create', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
  },

  // 查询支付状态
  async queryPayment(paymentId) {
    return await apiRequest(`/pay/query/${paymentId}`);
  },

  // 退款
  async refund(refundData) {
    return await apiRequest('/pay/refund', {
      method: 'POST',
      body: JSON.stringify(refundData)
    });
  }
};

// ===== 物流 API =====
const ShippingAPI = {
  // 查询运费
  async calculateFee(params) {
    return await apiRequest('/shipping/calculate', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  },

  // 查询物流轨迹
  async queryTrack(trackingNumber, carrier) {
    const query = new URLSearchParams({ carrier }).toString();
    return await apiRequest(`/shipping/track/${trackingNumber}?${query}`);
  },

  // 创建物流订单
  async createOrder(shippingData) {
    return await apiRequest('/shipping/create', {
      method: 'POST',
      body: JSON.stringify(shippingData)
    });
  }
};

// ===== UI 更新函数 =====
function updateCartBadgeUI() {
  const badge = document.getElementById('cartBadge');
  if (badge) {
    const count = CartAPI.getCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'block' : 'none';
  }
}

// 页面加载时更新购物车角标
document.addEventListener('DOMContentLoaded', updateCartBadgeUI);

// 导出 API
window.API = {
  User: UserAPI,
  Product: ProductAPI,
  Cart: CartAPI,
  Order: OrderAPI,
  Pay: PayAPI,
  Shipping: ShippingAPI
};
