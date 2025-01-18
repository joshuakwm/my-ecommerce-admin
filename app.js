import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { sequelize, initializeModels } from './api/db.js';
import { errorHandler } from './api/errors/index.js';
import routes from './api/routes/index.js';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection test
sequelize.authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection error:', err));

// Initialize models and associations
initializeModels()
  .then(() => console.log('Models initialized successfully'))
  .catch(err => console.error('Error initializing models:', err));

// Serve static files from admin directory
app.use(express.static('admin'));

// Serve static files for admin pages
app.get('/admin/products/', (req, res) => {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  res.sendFile(path.join(__dirname, 'admin/products/index.html'));
});

app.get('/admin/orders/', (req, res) => {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  res.sendFile(path.join(__dirname, 'admin/orders/index.html'));
});

app.get('/admin/reports/', (req, res) => {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  res.sendFile(path.join(__dirname, 'admin/reports/index.html'));
});

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// Serve admin dashboard for root route
app.get('/', (req, res) => {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  res.sendFile(path.join(__dirname, 'admin/dashboard/index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

const getAvailablePort = (port = 3000) => {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      server.close();
      resolve(port);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(getAvailablePort(port + 1));
      } else {
        reject(err);
      }
    });
  });
};

const startServer = async () => {
  try {
    const port = await getAvailablePort(process.env.PORT || 3000);
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

export default app;
