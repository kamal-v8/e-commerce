const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();
const promClient = require('prom-client');

const app = express();
const port = process.env.PORT || 3000;

// Prometheus Monitoring Setup
const register = new promClient.Registry();
register.setDefaultLabels({ app: 'brew-and-bloom-api' });
promClient.collectDefaultMetrics({ register });

// --- Prometheus Metrics Start ---
const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});
register.registerMetric(httpRequestsTotal);

const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10] 
});
register.registerMetric(httpRequestDurationMicroseconds);

// Middleware to count requests and measure duration
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000; // Convert to seconds
    if (req.path !== '/metrics') {
      httpRequestsTotal.inc({
        method: req.method,
        route: req.path,
        status: res.statusCode
      });
      httpRequestDurationMicroseconds.labels(req.method, req.path, res.statusCode).observe(duration);
    }
  });
  next();
});
// --- Prometheus Metrics End ---

app.use(cors());
app.use(express.json());

// Route: Get metrics for Prometheus
app.get('/metrics', async (req, res) => {
  try {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route: Get all products 
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Route: Checkout (Mock) 
app.post('/api/checkout', async (req, res) => {
  try {
    console.log("Order received:", req.body);
    res.json({ message: "Order successfully processed by the server!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
