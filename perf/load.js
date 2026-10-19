// Exercise 23 - k6 load test.
// Start the app: npm run app   (or npm run app:slow)
// In a second terminal: npm run perf:load
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  vus: 10,
  duration: '20s',
  // TODO: thresholds - criteria that make the test fail (slides 111–112)
  // TODO: scenarios - load and spike for /api/search
};

export default function () {
  const res = http.get(`${BASE_URL}/api/products`);
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1); // user "think time"
}
