import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { sequelize, initializeModels } from './api/db.js';
import { errorHandler } from './api/errors/index.js';
import routes from './api/routes/index.js';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
app.use(express.static(path.join(__dirname, 'admin')));

// Serve static files for admin pages
app.get('/admin/:page', (req, res) => {
  const page = req.params.page;
  const filePath = path.join(__dirname, 'admin', page, 'index.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).json({ success: false, message: `ENOENT: no such file or directory, stat '${filePath}'` });
    }
  });
});

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// Serve admin dashboard for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'dashboard', 'index.html'));
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
