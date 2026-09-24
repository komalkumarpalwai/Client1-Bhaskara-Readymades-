import app from '../src/app.js';
import http from 'http';

const PORT = 5055;

async function runVerification() {
  const server = http.createServer(app);

  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Test server running on port ${PORT}`);

  const endpoints = [
    { path: '/api', method: 'GET' },
    { path: '/api/products', method: 'GET' },
    { path: '/api/products/test-product-123', method: 'GET' },
    { path: '/api/products/search?q=shirt', method: 'GET' },
    { path: '/api/products/category/men', method: 'GET' },
    { path: '/api/cart', method: 'GET' },
    { path: '/api/orders', method: 'GET' },
    { path: '/api/auth/login', method: 'POST', body: { email: 'test@example.com' } },
    { path: '/api/admin/products', method: 'GET' },
    { path: '/api/admin/orders', method: 'GET' },
    { path: '/api/admin/customers', method: 'GET' }
  ];

  let allPassed = true;

  for (const ep of endpoints) {
    try {
      const res = await fetch(`http://localhost:${PORT}${ep.path}`, {
        method: ep.method,
        headers: { 'Content-Type': 'application/json' },
        body: ep.body ? JSON.stringify(ep.body) : undefined
      });

      const json = await res.json();
      if (res.status >= 200 && res.status < 300 && json.success === true) {
        console.log(`[PASS] ${ep.method} ${ep.path} -> Status: ${res.status}`);
      } else {
        console.error(`[FAIL] ${ep.method} ${ep.path} -> Status: ${res.status}`, json);
        allPassed = false;
      }
    } catch (err) {
      console.error(`[ERROR] ${ep.method} ${ep.path}:`, err.message);
      allPassed = false;
    }
  }

  await new Promise((resolve) => server.close(resolve));
  console.log('Test server closed.');

  if (!allPassed) {
    process.exit(1);
  }
  console.log('All backend endpoints verified successfully!');
}

runVerification().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
