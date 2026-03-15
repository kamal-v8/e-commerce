import { getCart, addToCart, removeFromCart, updateQuantity } from './cart.js';

export function updateCartBadge() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.querySelector('.cart-count');
  if (badge) badge.textContent = totalItems;
}

export function renderProductGrid(products, category = 'All') {
  const grid = document.querySelector('.products-grid');
  if (!grid) return;

  let itemsToDisplay = category === 'All' 
    ? products 
    : products.filter(p => p.category === category);

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
        <img src="${product.image}" alt="${product.name}">
      </a>
      <div class="product-info">
        <h3><a href="product.html?id=${product.id}">${product.name}</a></h3>
        <p class="product-price">$${product.price.toFixed(2)}</p>
        <div class="product-actions">
          <a href="product.html?id=${product.id}" class="btn btn-sm btn-outline">View</a>
          <button class="btn btn-sm add-btn" data-id="${product.id}">Add</button>
        </div>
      </div>
    </article>
  `).join('');

  // Add event listeners for the 'Add' buttons
  grid.querySelectorAll('.add-btn').forEach(btn => {
    btn.onclick = () => addToCart(parseInt(btn.dataset.id));
  });

  // Filter Buttons UI
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.innerText === category);
  });
}

export function renderCartPage(products) {
  const tbody = document.getElementById('cart-table')?.querySelector('tbody');
  const summary = document.getElementById('cart-summary');
  if (!tbody || !summary) return;

  const cart = getCart();
  if (cart.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Your cart is empty.</td></tr>';
    summary.innerHTML = '<p>Cart is empty</p>';
    return;
  }

  let subtotal = 0;
  tbody.innerHTML = cart.map(item => {
    const p = products.find(prod => prod.id === item.id);
    if (!p) return '';
    const total = p.price * item.quantity;
    subtotal += total;
    return `
      <tr>
        <td><div class="cart-item-info"><img src="${p.image}" class="cart-item-img"> <span>${p.name}</span></div></td>
        <td>$${p.price.toFixed(2)}</td>
        <td>
          <div class="quantity-control">
            <button class="qty-btn-minus" data-id="${p.id}">-</button>
            <span>${item.quantity}</span>
            <button class="qty-btn-plus" data-id="${p.id}">+</button>
          </div>
        </td>
        <td>$${total.toFixed(2)}</td>
        <td><button class="remove-btn" data-id="${p.id}">&times;</button></td>
      </tr>
    `;
  }).join('');

  // Add event listeners for quantity and remove buttons
  tbody.querySelectorAll('.qty-btn-minus').forEach(btn => {
    btn.onclick = () => {
      const item = cart.find(i => i.id === parseInt(btn.dataset.id));
      updateQuantity(item.id, item.quantity - 1);
      renderCartPage(products);
    };
  });
  tbody.querySelectorAll('.qty-btn-plus').forEach(btn => {
    btn.onclick = () => {
      const item = cart.find(i => i.id === parseInt(btn.dataset.id));
      updateQuantity(item.id, item.quantity + 1);
      renderCartPage(products);
    };
  });
  tbody.querySelectorAll('.remove-btn').forEach(btn => {
    btn.onclick = () => {
      removeFromCart(parseInt(btn.dataset.id));
      renderCartPage(products);
    };
  });

  summary.innerHTML = `
    <h3>Order Summary</h3>
    <div class="summary-row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
    <div class="summary-row"><span>Shipping</span><span>Free</span></div>
    <div class="total-row summary-row"><span>Total</span><span>$${subtotal.toFixed(2)}</span></div>
    <a href="checkout.html" class="btn" style="width:100%; text-align:center; display:block;">Proceed to Checkout</a>
  `;
}

export function renderProductDetail(products) {
  const container = document.getElementById('product-detail');
  if (!container) return;
  const id = parseInt(new URLSearchParams(window.location.search).get('id'));
  const p = products.find(prod => prod.id === id);
  if (!p) { container.innerHTML = '<p>Product not found.</p>'; return; }

  container.innerHTML = `
    <div class="detail-image"><img src="${p.image}"></div>
    <div class="detail-info">
      <h1>${p.name}</h1>
      <p class="detail-price">$${p.price.toFixed(2)}</p>
      <p>${p.description}</p>
      <div class="quantity-control">
        <button id="detail-qty-minus">-</button>
        <input type="number" id="qty-input" value="1" readonly>
        <button id="detail-qty-plus">+</button>
      </div>
      <button id="add-to-cart-btn" class="btn">Add to Cart</button>
    </div>
  `;

  const input = document.getElementById('qty-input');
  document.getElementById('detail-qty-minus').onclick = () => { if (input.value > 1) input.value--; };
  document.getElementById('detail-qty-plus').onclick = () => { input.value++; };
  document.getElementById('add-to-cart-btn').onclick = () => addToCart(p.id, parseInt(input.value));
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
