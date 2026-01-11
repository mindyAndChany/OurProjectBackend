// import { Request, Response } from 'express';
// import * as authService from '../services/auth.service.js';

// export const login = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;
//     const userData = await authService.login(email, password);
//     res.json(userData);
//   } catch (err: any) {
//     res.status(401).json({ error: err.message });
//   }
// };
// auth.controller.ts
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('logIn')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    try {
      return await this.authService.login(email, password);
    } catch (err: any) {
      throw new UnauthorizedException(err.message);
    }
  }
}
