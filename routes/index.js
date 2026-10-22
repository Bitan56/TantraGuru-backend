import { Router } from 'express';
import productRoutes from './product.routes.js';
import youtubeRoutes from './youtube.routes.js';

const router = Router();

router.use('/products', productRoutes);
router.use('/youtube', youtubeRoutes);

export default router;