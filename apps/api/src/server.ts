import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import router from './router';
import { errorHandler } from './middleware/errorHandler';



dotenv.config();

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));         
app.use(express.json());   
app.use(morgan('dev'));    
app.use('/api', router); 

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

app.use(errorHandler);
