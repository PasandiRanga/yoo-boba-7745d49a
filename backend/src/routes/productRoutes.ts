import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  getFeaturedProducts,
} from '../controllers/productController';

const router = Router();

router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);

export default router;
