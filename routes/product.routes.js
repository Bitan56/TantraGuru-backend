import { Router } from 'express';
import multer from 'multer';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', upload.array('images', 8), createProduct);
router.put('/:id', upload.array('images', 8), updateProduct);
router.delete('/:id', deleteProduct);

export default router;
