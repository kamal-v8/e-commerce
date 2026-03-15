import { fetchProducts, submitOrder, login, register } from './api.js';
import { getUser, logout, getCart, clearCart, saveUser } from './cart.js';
import { updateCartBadge, renderProductGrid, renderProductDetail, renderCartPage, renderCheckout, setupFooter } from './ui.js';

async function init() {
  // 1. Initial Logic
  let products = [];
  try {
    const rawProducts = await fetchProducts();
    products = rawProducts.map(p => ({ ...p, price: parseFloat(p.price) }));
  } catch (err) {
    console.error("API error", err);
  }

  // 2. Initial Render
  console.log("Found Products:", products.length);
  const id = new URLSearchParams(window.location.search).get('id');
  if (id) console.log("Current Product ID:", id);

  renderProductGrid(products);
  renderProductDetail(products);
  renderCartPage(products);
  renderCheckout(products);
  updateCartBadge();
  setupFooter();

  // 3. Setup Listeners
  document.addEventListener('cartUpdated', updateCartBadge);

  // Filter listener
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.onclick = () => renderProductGrid(products, btn.innerText.trim());
  });

  // Auth Status (Fixed)
  const user = getUser();
  const authLink = document.getElementById('auth-link');
  if (user && authLink) {
    authLink.textContent = `Hi, ${user.name}`;
    authLink.onclick = (e) => { 
      e.preventDefault(); 
      if (confirm('Logout?')) logout(); 
    };
  }

  // Login Form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.onsubmit = async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      try {
        const data = await login(email, password);
        saveUser(data.user);
        localStorage.setItem('token', data.token);
        window.location.href = '/';
      } catch (err) { alert('Login Failed: ' + err.message); }
    };
  }

  // Register Form
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.onsubmit = async (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value;
      const email = document.getElementById('reg-email').value;
      const password = document.getElementById('reg-password').value;
      try {
        await register(name, email, password);
        alert('Registration Success! Please Login.');
        window.location.reload();
      } catch (err) { alert('Registration Failed'); }
    };
  }
}

document.addEventListener('DOMContentLoaded', init);
