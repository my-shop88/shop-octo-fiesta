// ===== 商品数据 =====
const products = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max 256GB',
    brand: 'Apple',
    price: 9999,
    originalPrice: 11999,
    image: 'https://images.unsplash.com/photo-1695043133143-2e7c535f1e0d?w=400&q=80',
    category: 'electronics',
    tag: 'hot',
    description: 'A17 Pro芯片，钛金属设计，专业相机系统',
    stock: 50
  },
  {
    id: 2,
    name: 'MacBook Pro 14英寸 M3',
    brand: 'Apple',
    price: 15999,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
    category: 'electronics',
    tag: 'new',
    description: 'M3 Pro芯片，Liquid Retina XDR显示屏',
    stock: 30
  },
  {
    id: 3,
    name: 'Nike Air Max 90 运动鞋',
    brand: 'Nike',
    price: 699,
    originalPrice: 899,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    category: 'sports',
    tag: 'sale',
    description: '经典设计，舒适缓震，透气网面',
    stock: 100
  },
  {
    id: 4,
    name: 'Adidas Ultraboost 22',
    brand: 'Adidas',
    price: 899,
    originalPrice: 1199,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&q=80',
    category: 'sports',
    tag: 'sale',
    description: 'Boost中底，Primeknit鞋面，极致舒适',
    stock: 80
  },
  {
    id: 5,
    name: 'SK-II 神仙水精华液 230ml',
    brand: 'SK-II',
    price: 1590,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80',
    category: 'beauty',
    tag: 'new',
    description: 'PITERA™成分，深层护肤，焕活肌肤',
    stock: 45
  },
  {
    id: 6,
    name: '戴森 V15 吸尘器',
    brand: 'Dyson',
    price: 4990,
    originalPrice: 5990,
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&q=80',
    category: 'home',
    tag: 'sale',
    description: '强劲吸力，智能感应，激光除尘',
    stock: 25
  },
  {
    id: 7,
    name: 'AirPods Pro 第二代',
    brand: 'Apple',
    price: 1899,
    originalPrice: 1999,
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&q=80',
    category: 'electronics',
    tag: 'hot',
    description: '主动降噪，空间音频，MagSafe充电盒',
    stock: 120
  },
  {
    id: 8,
    name: '索尼 WH-1000XM5 耳机',
    brand: 'Sony',
    price: 2499,
    originalPrice: 2799,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&q=80',
    category: 'electronics',
    tag: 'sale',
    description: '业界领先降噪，30小时续航，LDAC音质',
    stock: 60
  },
  {
    id: 9,
    name: '华为 Mate 60 Pro',
    brand: 'Huawei',
    price: 6999,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80',
    category: 'electronics',
    tag: 'new',
    description: '麒麟9000s芯片，卫星通信，超光变XMAGE',
    stock: 40
  },
  {
    id: 10,
    name: '小米电视 ES70',
    brand: 'Xiaomi',
    price: 3999,
    originalPrice: 4599,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80',
    category: 'electronics',
    tag: 'sale',
    description: '4K量子点屏，多分区背光，MEMC运动补偿',
    stock: 35
  },
  {
    id: 11,
    name: '优衣库 纯棉T恤',
    brand: 'UNIQLO',
    price: 79,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80',
    category: 'clothing',
    tag: null,
    description: '100%纯棉，舒适透气，多色可选',
    stock: 200
  },
  {
    id: 12,
    name: '宜家 简约书桌',
    brand: 'IKEA',
    price: 599,
    originalPrice: 799,
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&q=80',
    category: 'home',
    tag: 'sale',
    description: '北欧设计，实用收纳，易于安装',
    stock: 55
  }
];

// ===== 全局变量 =====
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let currentFilter = 'all';

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', function() {
  initSlider();
  initMobileMenu();
  initCart();
  initBackToTop();
  initScrollEffects();
  
  if (document.getElementById('productGrid')) {
    renderProducts();
  }
});

// ===== 轮播 =====
function initSlider() {
  const slider = document.getElementById('heroSlider');
  if (!slider) return;
  
  const slides = slider.querySelectorAll('.hero-slide');
  const dots = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');
  
  let currentSlide = 0;
  let autoSlide;
  
  // 创建指示点
  slides.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.addEventListener('click', () => goToSlide(index));
    dots.appendChild(dot);
  });
  
  updateDots();
  
  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    updateDots();
  }
  
  function updateDots() {
    dots.querySelectorAll('span').forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  }
  
  function nextSlide() {
    goToSlide(currentSlide + 1);
  }
  
  prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  nextBtn.addEventListener('click', nextSlide);
  
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
  updateCartBadge();
  
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
  document.getElementById('cartSidebar').classList.add('active');
  document.getElementById('cartOverlay').classList.add('active');
  renderCartItems();
}

function closeCart() {
  document.getElementById('cartSidebar').classList.remove('active');
  document.getElementById('cartOverlay').classList.remove('active');
}

function renderCartItems() {
  const container = document.getElementById('cartItems');
  if (!container) return;
  
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <p>购物车是空的</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-info">
        <h4 class="cart-item-title">${item.name}</h4>
        <p class="cart-item-price">¥${item.price.toFixed(2)}</p>
        <div class="cart-item-qty">
          <button onclick="updateCartQty(${index}, -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="updateCartQty(${index}, 1)">+</button>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${index})">删除</button>
      </div>
    </div>
  `).join('');
  
  updateCartTotal();
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  
  saveCart();
  showToast('已添加到购物车');
}

function updateCartQty(index, delta) {
  cart[index].qty += delta;
  
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  
  saveCart();
  renderCartItems();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCartItems();
  showToast('已从购物车移除');
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (badge) {
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    badge.textContent = total;
    badge.style.display = total > 0 ? 'block' : 'none';
  }
}

function updateCartTotal() {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
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
function showToast(message) {
  let toast = document.querySelector('.toast');
  
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}