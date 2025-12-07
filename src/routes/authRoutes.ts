import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/AuthController.js';

const router = Router();

// POST /auth/register - רישום משתמש חדש
router.post('/register', (req: Request, res: Response) => {
  AuthController.register(req, res);
});

// POST /auth/login - התחברות משתמש
router.post('/login', (req: Request, res: Response) => {
  AuthController.login(req, res);
});

export default router;
