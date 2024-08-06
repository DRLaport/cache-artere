import express from 'express';
import cacheRoutes from './routes/cacheRoutes';
import { restoreCache } from './services/cacheService';

const app = express();
app.use(express.json());
app.use('/cache', cacheRoutes);

restoreCache();

export default app;
