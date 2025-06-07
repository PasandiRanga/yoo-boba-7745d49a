// routes/byobRoutes.ts
import { Router } from 'express';
import { submitBYOBRequest } from '../controllers/byobController';
// Do NOT import authenticateToken here

const router = Router();

router.post('/submit', submitBYOBRequest); // No auth middleware

export default router;
