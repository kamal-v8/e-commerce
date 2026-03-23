import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 7000 },  // Ramp up to 50 users
    { duration: '1m', target: 7000 }, // Stay at 100 users
    { duration: '30s', target: 10000 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
  },
  insecureSkipTLSVerify: true, // Handle TLS certificate mismatches
};

const BASE_URL = 'https://zaptor.in';
// const BASE_URL = 'http://54.157.92.183';
export default function () {
  // 1. Fetch Products API
  const productsRes = http.get(`${BASE_URL}/api/products`);

  check(productsRes, {
    'status is 200': (r) => r.status === 200,
    'is json': (r) => r.headers['Content-Type'] && r.headers['Content-Type'].includes('application/json'),
    'got products': (r) => {
      try { return r.json().length > 0; } catch (e) { return false; }
    },
  });

  sleep(1);

  // 2. Mock Checkout API
  const payload = JSON.stringify({
    items: [{ id: 1, quantity: 2 }],
    total: 10.50,
  });
  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const checkoutRes = http.post(`${BASE_URL}/api/checkout`, payload, params);

  check(checkoutRes, {
    'checkout status is 200': (r) => r.status === 200,
    'checkout successful': (r) => {
      try { return r.json().message.includes('successfully processed'); } catch (e) { return false; }
    },
  });

  sleep(1);
}
