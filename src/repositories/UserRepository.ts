import * as crypto from 'crypto';

export type UserRecord = {
	id: string;
	name: string;
	email: string;
	password: string;
	createdAt: Date;
};

const users: UserRecord[] = [];

export class UserRepository {
	static findByEmail(email: string): UserRecord | undefined {
		return users.find(u => u.email === email);
	}

	static create(payload: { name: string; email: string; password: string }): UserRecord {
		const user: UserRecord = {
			id: crypto.randomUUID(),
			name: payload.name,
			email: payload.email,
			password: payload.password,
			createdAt: new Date()
		};
		users.push(user);
		return user;
	}

	static findById(id: string): UserRecord | undefined {
		return users.find(u => u.id === id);
	}
}

export default UserRepository;
