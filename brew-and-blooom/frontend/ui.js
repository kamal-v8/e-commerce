import { getCart, addToCart, removeFromCart, updateQuantity } from './cart.js';

export function updateCartBadge() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.querySelector('.cart-count');
  if (badge) badge.textContent = totalItems;
}

export function renderProductGrid(products, category = 'All') {
  // Support both standard, modern, and editorial grid containers
  const grid = document.querySelector('.products-grid') || 
               document.getElementById('shop-products-grid') || 
               document.querySelector('.modern-grid');
  if (!grid) return;

  let itemsToDisplay = category === 'All' 
    ? products 
    : products.filter(p => p.category && p.category.toLowerCase().includes(category.toLowerCase()));

  if (grid.dataset.limit) {
    itemsToDisplay = itemsToDisplay.slice(0, parseInt(grid.dataset.limit));
  }

  if (itemsToDisplay.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No products found.</p>';
    return;
  }

  grid.innerHTML = itemsToDisplay.map(product => `
    <article class="product-card">
      <a href="product.html?id=${product.id}" class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </a>
      <div class="product-info">
        <h3><a href="product.html?id=${product.id}">${product.name}</a></h3>
        <p class="product-price">₹${product.price.toFixed(2)}</p>
        <div class="product-actions">
          <a href="product.html?id=${product.id}" class="btn btn-sm btn-outline">View</a>
          <button class="btn btn-sm add-btn" data-id="${product.id}">Add</button>
        </div>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.add-btn').forEach(btn => {
    btn.onclick = () => addToCart(parseInt(btn.dataset.id));
  });

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.innerText === category);
  });
}

export function renderCartPage(products) {
  const itemsContainer = document.getElementById('cart-items-list');
  const summaryContainer = document.getElementById('cart-summary');
  if (!itemsContainer || !summaryContainer) return;

  const cart = getCart();
  if (cart.length === 0) {
    itemsContainer.innerHTML = `
        <div style="text-align: center; padding: 4rem 2rem; background: white; border-radius: 15px;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">☕</div>
            <h3>Your cart is empty</h3>
            <p style="color: #666; margin-bottom: 2rem;">Looks like you haven't discovered your perfect brew yet.</p>
            <a href="/shop" class="btn">Start Shopping</a>
        </div>
    `;
    summaryContainer.style.display = 'none';
    return;
  }

  summaryContainer.style.display = 'block';
  let subtotal = 0;
  
  itemsContainer.innerHTML = cart.map(item => {
    const p = products.find(prod => prod.id === item.id);
    if (!p) return '';
    const total = p.price * item.quantity;
    subtotal += total;
    return `
      <div class="cart-item-card">
        <div class="cart-item-image">
            <img src="${p.image}" alt="${p.name}">
        </div>
        <div class="cart-item-details">
            <span class="cart-item-category">${p.category || 'Coffee'}</span>
            <h3>${p.name}</h3>
            <div class="cart-item-controls">
                <div class="modern-qty-control">
                    <button class="qty-btn-minus" data-id="${p.id}">−</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn-plus" data-id="${p.id}">+</button>
                </div>
                <button class="remove-item-btn" data-id="${p.id}" title="Remove Item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            </div>
        </div>
        <div class="cart-item-price-info">
            <span class="unit-price">₹${p.price.toFixed(2)} each</span>
            <span class="total-price">₹${total.toFixed(2)}</span>
        </div>
      </div>
    `;
  }).join('');

  // Summary Card
  const shipping = 0;
  const total = subtotal + shipping;

  summaryContainer.innerHTML = `
    <h3>Order Summary</h3>
    <div class="summary-line">
        <span>Subtotal</span>
        <span>₹${subtotal.toFixed(2)}</span>
    </div>
    <div class="summary-line">
        <span>Shipping</span>
        <span>₹${shipping.toFixed(2)}</span>
    </div>
    <div class="summary-line total">
        <span>Total</span>
        <span>₹${total.toFixed(2)}</span>
    </div>
    <button class="checkout-btn-modern" onclick="window.location.href='/checkout'">Checkout Now</button>
    <p style="text-align: center; font-size: 0.8rem; margin-top: 1rem; opacity: 0.7;">Taxes calculated at checkout</p>
  `;

  // Add event listeners for quantity and remove buttons
  itemsContainer.querySelectorAll('.qty-btn-minus').forEach(btn => {
    btn.onclick = () => {
      const item = cart.find(i => i.id === parseInt(btn.dataset.id));
      if (item.quantity > 1) {
        updateQuantity(item.id, item.quantity - 1);
        renderCartPage(products);
      }
    };
  });
  itemsContainer.querySelectorAll('.qty-btn-plus').forEach(btn => {
    btn.onclick = () => {
      const item = cart.find(i => i.id === parseInt(btn.dataset.id));
      updateQuantity(item.id, item.quantity + 1);
      renderCartPage(products);
    };
  });
  itemsContainer.querySelectorAll('.remove-item-btn').forEach(btn => {
    btn.onclick = () => {
      if(confirm('Remove this item from your cart?')) {
        removeFromCart(parseInt(btn.dataset.id));
        renderCartPage(products);
      }
    };
  });
}

export function renderProductDetail(products) {
  const container = document.getElementById('product-detail');
  if (!container) return;
  const id = parseInt(new URLSearchParams(window.location.search).get('id'));
  const p = products.find(prod => prod.id === id);
  if (!p) { container.innerHTML = '<p>Product not found.</p>'; return; }

  // Update breadcrumb and title
  document.getElementById('breadcrumb-current').textContent = p.name;
  document.title = `${p.name} | Brew & Bloom`;

  // Update Specs (Mock data for cool visual)
  const roastText = document.getElementById('spec-roast-text');
  const roastFill = document.getElementById('spec-roast-fill');
  if (p.category.includes('Light')) { roastText.textContent = 'Light'; roastFill.style.width = '30%'; }
  else if (p.category.includes('Dark')) { roastText.textContent = 'Dark'; roastFill.style.width = '90%'; }
  else { roastText.textContent = 'Medium'; roastFill.style.width = '60%'; }

  container.innerHTML = `
    <div class="product-gallery">
        <div class="main-image-box">
            <img src="${p.image}" alt="${p.name}">
        </div>
    </div>
    
    <div class="product-essential-info">
        <span class="product-category-tag">${p.category}</span>
        <h1>${p.name}</h1>
        
        <div class="price-row">
            <span class="current-price">₹${p.price.toFixed(2)}</span>
            <span class="stock-status"><span>●</span> In Stock & Ready to Ship</span>
        </div>

        <p class="product-description-cool">${p.description}</p>

        <div class="purchase-area">
            <span class="qty-label">Quantity</span>
            <div class="action-row">
                <div class="modern-qty-selector">
                    <button id="detail-qty-minus">−</button>
                    <input type="number" id="qty-input" value="1" readonly>
                    <button id="detail-qty-plus">+</button>
                </div>
                <button id="add-to-cart-btn" class="btn btn-hero">Add to Collection</button>
            </div>
        </div>
    </div>
  `;

  // Listeners
  const input = document.getElementById('qty-input');
  document.getElementById('detail-qty-minus').onclick = () => { if (input.value > 1) input.value--; };
  document.getElementById('detail-qty-plus').onclick = () => { input.value++; };
  document.getElementById('add-to-cart-btn').onclick = () => addToCart(p.id, parseInt(input.value));

  // Render Related
  const relatedGrid = document.getElementById('related-products-grid');
  if (relatedGrid) {
      const related = products.filter(prod => prod.id !== p.id).slice(0, 4);
      relatedGrid.innerHTML = related.map(product => `
        <article class="product-card">
          <a href="product.html?id=${product.id}" class="product-image">
            <img src="${product.image}" alt="${product.name}">
          </a>
          <div class="product-info">
            <h3><a href="product.html?id=${product.id}">${product.name}</a></h3>
            <p class="product-price">₹${product.price.toFixed(2)}</p>
            <div class="product-actions">
              <button class="btn btn-sm add-btn" data-id="${product.id}">Add</button>
            </div>
          </div>
        </article>
      `).join('');
      
      relatedGrid.querySelectorAll('.add-btn').forEach(btn => {
          btn.onclick = () => addToCart(parseInt(btn.dataset.id));
      });
  }
}

export function renderCheckout(products) {
  const itemsContainer = document.getElementById('checkout-items-list');
  const totalsContainer = document.getElementById('checkout-totals');
  if (!itemsContainer || !totalsContainer) return;

  const cart = getCart();
  if (cart.length === 0) {
    itemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  let subtotal = 0;
  itemsContainer.innerHTML = cart.map(item => {
    const p = products.find(prod => prod.id === item.id);
    if (!p) return '';
    const total = p.price * item.quantity;
    subtotal += total;
    return `
      <div class="summary-item-row">
        <img src="${p.image}" class="summary-item-img">
        <div class="summary-item-info">
          <h4>${p.name}</h4>
          <p>Qty: ${item.quantity}</p>
        </div>
        <span class="price">₹${total.toFixed(2)}</span>
      </div>
    `;
  }).join('');

  const shipping = 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  totalsContainer.innerHTML = `
    <div class="row"><span>Subtotal</span><span>₹${subtotal.toFixed(2)}</span></div>
    <div class="row"><span>Shipping</span><span>₹${shipping.toFixed(2)}</span></div>
    <div class="row"><span>Estimated Tax</span><span>₹${tax.toFixed(2)}</span></div>
    <div class="row total"><span>Total</span><span>₹${total.toFixed(2)}</span></div>
  `;
}

export function setupFooter() {
  const form = document.getElementById('subscribe-form');
  const msg = document.getElementById('subscribe-msg');
  if (!form) return;

  form.onsubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById('subscribe-email').value;
    console.log("Subscribed:", email);
    msg.textContent = "Thanks for subscribing!";
    msg.style.display = "block";
    msg.style.color = "#4CAF50";
    form.reset();
  };
}
