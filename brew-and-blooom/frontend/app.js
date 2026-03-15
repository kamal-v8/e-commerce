import { fetchProducts, submitOrder, login, register } from './api.js';
import { getUser, logout, getCart, clearCart, saveUser } from './cart.js';
import { updateCartBadge, renderProductGrid, renderProductDetail, renderCartPage, renderCheckout, setupFooter } from './ui.js';

console.log("app.js loaded");

async function init() {
  console.log("init() starting...");
  let products = [];
  try {
    console.log("Calling fetchProducts()...");
    const rawProducts = await fetchProducts();
    console.log("fetchProducts() success, count:", rawProducts.length);
    products = rawProducts.map(p => ({ ...p, price: parseFloat(p.price) }));
  } catch (err) {
    console.error("CRITICAL: fetchProducts failed:", err);
  }

  try {
    console.log("Starting initial renders...");
    renderProductGrid(products);
    renderProductDetail(products);
    renderCartPage(products);
    renderCheckout(products);
    updateCartBadge();
    setupFooter();
    console.log("Renders complete.");
  } catch (err) {
    console.error("Error during initial render:", err);
  }

  // 3. Setup Listeners
  try {
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
    console.log("Listeners setup complete.");
  } catch (err) {
    console.error("Error setting up listeners:", err);
  }
}

console.log("Registering DOMContentLoaded listener...");
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOMContentLoaded fired!");
  init();
});
