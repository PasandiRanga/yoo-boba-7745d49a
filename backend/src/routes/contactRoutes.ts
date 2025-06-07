// routes/contactRoutes.ts
import { Router } from 'express';
import { submitContactRequest } from '../controllers/contactController';

const router = Router();

router.post('/submit', submitContactRequest);

export default router;
