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

// --- Traffic Counter Start ---
const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});
register.registerMetric(httpRequestsTotal);

// Middleware to count every request
app.use((req, res, next) => {
  res.on('finish', () => {
    // We exclude the /metrics endpoint itself to avoid noise
    if (req.path !== '/metrics') {
      httpRequestsTotal.inc({
        method: req.method,
        route: req.path,
        status: res.statusCode
      });
    }
  });
  next();
});
// --- Traffic Counter End ---

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
