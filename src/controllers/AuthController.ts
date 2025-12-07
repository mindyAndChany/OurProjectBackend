import { Request, Response } from 'express';
import { UserRepository } from '../repositories/UserRepository.js';
import { AuthService } from '../services/AuthService.js';
import { RegisterPayload, AuthPayload } from '../models/User.js';

export class AuthController {
  // רישום משתמש חדש
  static register(req: Request, res: Response): void {
    try {
      const { name, email, password } = req.body as RegisterPayload;

      // בדיקת שדות
      if (!name || !email || !password) {
        res.status(400).json({ error: 'שם, אימייל וסיסמה נדרשים' });
        return;
      }

      // בדיקה האם המשתמש קיים כבר
      if (UserRepository.findByEmail(email)) {
        res.status(409).json({ error: 'אימייל זה כבר רשום' });
        return;
      }

      // הצפנת סיסמה
      const hashedPassword = AuthService.hashPassword(password);

      // יצירת משתמש חדש
      const user = UserRepository.create({
        name,
        email,
        password: hashedPassword
      });

      // יצירת Token
      const token = AuthService.generateToken(user.id, user.email);

      res.status(201).json({
        message: 'הרשמה בוצעה בהצלחה',
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        token
      });
    } catch (error) {
      res.status(500).json({ error: 'שגיאה בעת הרשמה' });
    }
  }

  // התחברות משתמש
  static login(req: Request, res: Response): void {
    try {
      const { email, password } = req.body as AuthPayload;

      // בדיקת שדות
      if (!email || !password) {
        res.status(400).json({ error: 'אימייל וסיסמה נדרשים' });
        return;
      }

      // חיפוש משתמש
      const user = UserRepository.findByEmail(email);
      if (!user) {
        res.status(401).json({ error: 'אימייל או סיסמה שגויים' });
        return;
      }

      // בדיקת סיסמה
      if (!AuthService.comparePassword(password, user.password)) {
        res.status(401).json({ error: 'אימייל או סיסמה שגויים' });
        return;
      }

      // יצירת Token
      const token = AuthService.generateToken(user.id, user.email);

      res.status(200).json({
        message: 'התחברות בוצעה בהצלחה',
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        token
      });
    } catch (error) {
      res.status(500).json({ error: 'שגיאה בעת התחברות' });
    }
  }
}
