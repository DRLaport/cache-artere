import express from 'express';
import cacheRoutes from './routes/cacheRoutes';

const app = express();
app.use(express.json());
app.use('/cache', cacheRoutes);

export default app;
