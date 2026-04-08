/**
 * 云商前端主脚本 - API版本
 * 商品数据从后端获取，购物车使用 API.Cart 模块
 */

// ===== 全局变量 =====
let products = [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let currentFilter = 'all';

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', async function() {
  initSlider();
  initMobileMenu();
  initCart();
  initBackToTop();
  initScrollEffects();
  initUserUI();
  
  // 加载商品数据
  if (document.getElementById('productGrid')) {
    await loadProducts();
  }
});

// ===== 加载商品数据 =====
async function loadProducts() {
  try {
    const result = await API.Product.getList();
    if (result.success) {
      products = result.data.map(p => ({
        id: p.id,
        name: p.name,
        brand: p.category,
        price: p.price,
        originalPrice: p.original_price,
        image: p.images && p.images[0] ? p.images[0] : 'https://via.placeholder.com/400x400?text=No+Image',
        category: p.category,
        tag: p.original_price ? 'sale' : null,
        description: p.description,
        stock: p.stock
      }));
      renderProducts();
    }
  } catch (error) {
    console.error('加载商品失败:', error);
    showToast('商品加载失败，请刷新重试', 'error');
  }
}

// ===== 用户UI初始化 =====
function initUserUI() {
  const user = API.User.getCurrentUser();
  const userIcon = document.querySelector('.user-icon');
  
  if (user && userIcon) {
    userIcon.href = '#';
    userIcon.title = `已登录: ${user.username}`;
    userIcon.onclick = (e) => {
      e.preventDefault();
      if (confirm('是否退出登录？')) {
        API.User.logout();
        window.location.reload();
      }
    };
  }
}

// ===== 轮播 =====
function initSlider() {
  const slider = document.getElementById('heroSlider');
  if (!slider) return;
  
  const slides = slider.querySelectorAll('.hero-slide');
  const dots = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');
  
  if (!slides.length) return;
  
  let currentSlide = 0;
  let autoSlide;
  
  // 创建指示点
  if (dots) {
    slides.forEach((_, index) => {
      const dot = document.createElement('span');
      dot.addEventListener('click', () => goToSlide(index));
      dots.appendChild(dot);
    });
    updateDots();
  }
  
  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    updateDots();
  }
  
  function updateDots() {
    if (!dots) return;
    dots.querySelectorAll('span').forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  }
  
  function nextSlide() {
    goToSlide(currentSlide + 1);
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', nextSlide);
  }
  
  autoSlide = setInterval(nextSlide, 5000);
  
  slider.addEventListener('mouseenter', () => clearInterval(autoSlide));
  slider.addEventListener('mouseleave', () => autoSlide = setInterval(nextSlide, 5000));
}

// ===== 移动端菜单 =====
function initMobileMenu() {
  const toggle = document.getElementById('mobileToggle');
  const nav = document.getElementById('nav');
  
  if (!toggle || !nav) return;
  
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    nav.classList.toggle('active');
  });
}

// ===== 购物车 =====
function initCart() {
  // 购物车角标由 api.js 自动更新
  
  const cartIcon = document.querySelector('.cart-icon');
  const cartSidebar = document.getElementById('cartSidebar');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartClose = document.getElementById('cartClose');
  
  if (cartIcon && cartSidebar) {
    cartIcon.addEventListener('click', (e) => {
      e.preventDefault();
      openCart();
    });
  }
  
  if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCart);
  }
  
  if (cartClose) {
    cartClose.addEventListener('click', closeCart);
  }
}

function openCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  if (sidebar) sidebar.classList.add('active');
  if (overlay) overlay.classList.add('active');
  renderCartItems();
}

function closeCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  if (sidebar) sidebar.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
}

function renderCartItems() {
  const container = document.getElementById('cartItems');
  if (!container) return;
  
  const cart = API.Cart.getCart();
  
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <p>购物车是空的</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-info">
        <h4 class="cart-item-title">${item.name}</h4>
        <p class="cart-item-price">¥${item.price.toFixed(2)}</p>
        <div class="cart-item-qty">
          <button onclick="updateCartQty(${item.id}, ${item.qty - 1})">-</button>
          <span>${item.qty}</span>
          <button onclick="updateCartQty(${item.id}, ${item.qty + 1})">+</button>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})">删除</button>
      </div>
    </div>
  `).join('');
  
  updateCartTotal();
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  API.Cart.addItem({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    brand: product.brand
  });
  
  showToast('已添加到购物车');
}

function updateCartQty(productId, qty) {
  API.Cart.updateQty(productId, qty);
  renderCartItems();
}

function removeFromCart(productId) {
  API.Cart.removeItem(productId);
  renderCartItems();
  showToast('已从购物车移除');
}

function updateCartTotal() {
  const total = API.Cart.getTotal();
  const totalEl = document.getElementById('cartTotal');
  if (totalEl) {
    totalEl.textContent = `¥${total.toFixed(2)}`;
  }
}

// ===== 回到顶部 =====
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });
  
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== 滚动效果 =====
function initScrollEffects() {
  const header = document.getElementById('header');
  if (!header) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// ===== 渲染商品 =====
function renderProducts(filter = 'all') {
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  
  let filteredProducts = products;
  
  if (filter !== 'all') {
    filteredProducts = products.filter(p => p.category === filter);
  }
  
  if (filteredProducts.length === 0) {
    grid.innerHTML = '<p style="text-align: center; padding: 40px; color: #999;">暂无商品</p>';
    return;
  }
  
  grid.innerHTML = filteredProducts.map(product => `
    <div class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        ${product.tag ? `<span class="product-tag tag-${product.tag}">${getTagText(product.tag)}</span>` : ''}
        <div class="product-actions">
          <button class="btn-add-cart" onclick="addToCart(${product.id})">加入购物车</button>
          <button class="btn-wishlist" onclick="toggleWishlist(${product.id})">
            ${wishlist.includes(product.id) ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
      <div class="product-info">
        <p class="product-brand">${product.brand}</p>
        <h3 class="product-title">${product.name}</h3>
        <div class="product-price">
          <span class="price-current">¥${product.price}</span>
          ${product.originalPrice ? `<span class="price-original">¥${product.originalPrice}</span>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

function getTagText(tag) {
  const tags = {
    'new': '新品',
    'hot': '热门',
    'sale': '特惠'
  };
  return tags[tag] || '';
}

// ===== 心愿单 =====
function toggleWishlist(productId) {
  const index = wishlist.indexOf(productId);
  
  if (index === -1) {
    wishlist.push(productId);
    showToast('已添加到心愿单');
  } else {
    wishlist.splice(index, 1);
    showToast('已从心愿单移除');
  }
  
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  
  if (document.getElementById('productGrid')) {
    renderProducts(currentFilter);
  }
}

// ===== Toast =====
function showToast(message, type = 'success') {
  let toast = document.querySelector('.toast');
  
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// ===== 商品筛选 =====
function filterProducts(category) {
  currentFilter = category;
  renderProducts(category);
  
  // 更新筛选按钮状态
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === category);
  });
}
