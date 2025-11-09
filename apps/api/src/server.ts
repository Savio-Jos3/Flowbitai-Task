import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import router from './router';



// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

// Core middleware
app.use(cors());            // Enable all CORS requests (for local dev; restrict in prod)
app.use(express.json());    // Automatically parse incoming JSON
app.use(morgan('dev'));    // Log all HTTP requests
app.use('/api', router); // All endpoints start with /api

// Health check route
app.get('/', (_req, res) => {
  res.send('API Server running!');
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});
