import * as crypto from 'crypto';

export class AuthService {
	private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

	// הצפנת סיסמה (sha256)
	static hashPassword(password: string): string {
		return crypto.createHash('sha256').update(password).digest('hex');
	}

	// השוואת סיסמה
	static comparePassword(password: string, hash: string): boolean {
		return this.hashPassword(password) === hash;
	}

	// יצירת JWT Token פשוט (לא URL-safe, לשימוש פנימי בלבד)
	static generateToken(userId: string, email: string): string {
		const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
		const payloadObj = {
			userId,
			email,
			iat: Math.floor(Date.now() / 1000),
			exp: Math.floor(Date.now() / 1000) + 86400 // 24 שעות
		} as const;
		const payload = Buffer.from(JSON.stringify(payloadObj)).toString('base64');

		const signature = crypto
			.createHmac('sha256', AuthService.JWT_SECRET)
			.update(`${header}.${payload}`)
			.digest('base64');

		return `${header}.${payload}.${signature}`;
	}

	// אימות Token
	static verifyToken(token: string): any | null {
		try {
			const parts = token.split('.');
			if (parts.length !== 3) return null;

			const [header, payload, signature] = parts;
			if (!payload) return null;
			const expectedSignature = crypto
				.createHmac('sha256', AuthService.JWT_SECRET)
				.update(`${header}.${payload}`)
				.digest('base64');

			if (signature !== expectedSignature) return null;

			const payloadStr = Buffer.from(payload, 'base64').toString();
			const decodedPayload = JSON.parse(payloadStr);
			if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) return null; // Token פג תוקף

			return decodedPayload;
		} catch (error) {
			return null;
		}
	}
}

export default AuthService;
