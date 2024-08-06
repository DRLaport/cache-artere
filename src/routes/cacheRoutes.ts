import { Router } from 'express';
import { getCache, setCache, deleteCache, getCacheStatsController, backupCacheController, restoreCacheController } from '../controllers/cacheController';

const router = Router();

router.get('/stats', getCacheStatsController); 
router.get('/:key', getCache);
router.post('/', setCache);
router.delete('/:key', deleteCache);
router.post('/backup', backupCacheController);
router.post('/restore', restoreCacheController);

export default router;
