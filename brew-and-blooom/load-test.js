import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 9000 }, // ramp up to 20 users over 30s
    { duration: '1m', target: 20 },  // stay at 20 users for 1 minute
    { duration: '30s', target: 0 },  // ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
  },
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  // 1. Fetch Products
  const productsRes = http.get(`${BASE_URL}/api/products`);
  check(productsRes, {
    'status is 200': (r) => r.status === 200,
    'got products': (r) => r.json().length > 0,
  });

  sleep(1);

  // 2. Mock Checkout
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
    'checkout successful': (r) => r.json().message.includes('successfully processed'),
  });

  sleep(1);
}
