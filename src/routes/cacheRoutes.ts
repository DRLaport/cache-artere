import { Router } from 'express';
import { getCache, setCache, deleteCache } from '../controllers/cacheController';

const router = Router();

router.get('/:key', getCache);
router.post('/', setCache);
router.delete('/:key', deleteCache);

export default router;
