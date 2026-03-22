import http from 'k6/http';
import { check } from 'k6';

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 167,              // 167 requests per second (approx 10k/min)
      timeUnit: '1s',         // count the rate per 1 second
      duration: '1m',         // run for 1 minute
      preAllocatedVUs: 100,   // Start with more VUs
      maxVUs: 500,            // Allow up to 500 VUs
    },
  },
};

const BASE_URL = 'https://zaptor.in';

export default function () {
  const res = http.get(`${BASE_URL}/shop`);

  // Log every 100th request locally in k6 just to verify it's working
  if (__ITER % 100 === 0) {
    console.log(`Request ${__ITER} sent to ${BASE_URL}`);
  }

  check(res, { 'status is 200': (r) => r.status === 200 });
}
