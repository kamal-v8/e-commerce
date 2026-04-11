import { fetchProducts, submitOrder, login, register } from './api.js';
import { getUser, logout, getCart, clearCart, saveUser } from './cart.js';
import { updateCartBadge, renderProductGrid, renderProductDetail, renderCartPage, renderCheckout, setupFooter } from './ui.js';

console.log("app.js loaded");

async function init() {
  console.log("init() starting...");
  // 1. Initial Logic
  let products = [];
  try {
    const CACHE_VERSION = 'v2'; // Increment version to force refresh
    const cachedVersion = sessionStorage.getItem('products_cache_version');
    const cachedProducts = sessionStorage.getItem('products_cache');
    
    if (cachedProducts && cachedVersion === CACHE_VERSION) {
      console.log("Using cached products...");
      products = JSON.parse(cachedProducts);
    } else {
      console.log("Calling fetchProducts()...");
      const rawProducts = await fetchProducts();
      products = rawProducts.map(p => ({ ...p, price: parseFloat(p.price) }));
      sessionStorage.setItem('products_cache', JSON.stringify(products));
      sessionStorage.setItem('products_cache_version', CACHE_VERSION);
      console.log("fetchProducts() success, count:", products.length);
    }
  } catch (err) {
    console.error("CRITICAL: fetchProducts failed:", err);
  }

  // 2. Initial Render
  try {
    console.log("Starting initial renders...");
    // Target any product grid variant (Home/Shop/Modern)
    const grid = document.querySelector('.products-grid, .modern-products-grid, .modern-grid, #shop-products-grid');
    if (grid) renderProductGrid(products);

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

    // Sticky Header Logic
    window.onscroll = () => {
        const header = document.querySelector('.main-header');
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }
    };

    // Filter listener (Modern & Standard)
    const filterElements = document.querySelectorAll('.filter-pill, .filter-btn');
    filterElements.forEach(btn => {
      btn.onclick = () => {
        const category = btn.dataset.category || btn.innerText.trim();
        renderProductGrid(products, category);
        
        // Update active state
        filterElements.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      };
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
        } catch (err) { 
          alert('Registration Failed: ' + err.message); 
        }
      };
    }
    console.log("Listeners setup complete.");
  } catch (err) {
    console.error("Error setting up listeners:", err);
  }

  // Checkout Form
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    const cart = getCart();
    if (cart.length === 0) {
      alert("Your cart is empty. Please add items before checking out.");
      window.location.href = '/shop';
      return;
    }

    checkoutForm.onsubmit = async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('place-order-btn');
      const originalBtnText = submitBtn.textContent;
      
      const orderData = {
        customer: {
          email: document.getElementById('email').value,
          firstName: document.getElementById('first-name').value,
          lastName: document.getElementById('last-name').value,
          address: document.getElementById('address').value,
          city: document.getElementById('city').value,
          zip: document.getElementById('zip').value,
        },
        items: cart,
        payment: {
          cardNumber: document.getElementById('card-number').value,
          expiry: document.getElementById('expiry').value,
          cvv: document.getElementById('cvv').value,
        }
      };

      try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';
        
        await submitOrder(orderData);
        
        // Success Logic
        clearCart();
        const modal = document.getElementById('success-modal');
        if (modal) modal.style.display = 'flex';
      } catch (err) {
        alert('Checkout Failed: ' + err.message);
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    };
  }
}

console.log("Registering DOMContentLoaded listener...");
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOMContentLoaded fired!");
  init();
});
