const CART_KEY = 'coffee_cart';
const USER_KEY = 'coffee_user';

export function getCart() {
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    localStorage.removeItem(CART_KEY);
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  document.dispatchEvent(new CustomEvent('cartUpdated'));
}

export function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ id: productId, quantity: quantity });
  }

  saveCart(cart);
  alert('Item added to cart!');
}

export function removeFromCart(productId) {
  const cart = getCart();
  const newCart = cart.filter(item => item.id !== productId);
  saveCart(newCart);
}

export function updateQuantity(productId, newQuantity) {
  if (newQuantity < 1) return;
  const cart = getCart();
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity = newQuantity;
    saveCart(cart);
  }
}

export function clearCart() {
  saveCart([]);
}

export function getUser() {
  try {
    const user = localStorage.getItem(USER_KEY);
    // Only return if it's a valid object with a name
    const parsed = user ? JSON.parse(user) : null;
    return (parsed && parsed.name) ? parsed : null;
  } catch (e) {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem('token');
  window.location.href = '/';
}
