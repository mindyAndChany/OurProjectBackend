import bcrypt from 'bcrypt';
import { User } from '../models/user.model.js';
import { Role } from '../models/role.model.js';
// firebase-admin מסומן כ-"external" ב-esbuild, ואם החבילה חסרה ב-node_modules
// ייבוא סטטי של מודול שמתייחס אליה מפיל את כל השרת בעלייה. לכן המודול שלנו
// עצמו נטען רק כאן, בזמן שימוש, ולא בהפעלת האפליקציה.


export type AddUserInput = {
  name: string;
  email: string;
  password?: string;
  password_hash?: string;
  institution_code: string;
  role_id: number;
  active?: boolean;
};

export type UpdateUserInput = Partial<AddUserInput>;

const resolvePasswordHash = async (data: { password?: string; password_hash?: string }) => {
  if (data.password) {
    return bcrypt.hash(data.password, 10);
  }
  return data.password_hash;
};

export const getUsers = async () => {
  return await User.findAll({ include: [Role] });
};

export const getUserById = async (id: number) => {
  return await User.findByPk(id, { include: [Role] });
};

/**
 * יוצר משתמש ב־Firebase Auth (Admin SDK).
 * אם המייל כבר קיים בפיירבייס – מאמץ את המשתמש הקיים ומחזיר את ה־UID שלו
 * (במקום להיכשל). אם Firebase Admin לא מוגדר – מדלג בשקט.
 */
async function createFirebaseUser(email: string, password: string): Promise<string | undefined> {
  let getFirebaseAuth: typeof import('../config/firebaseAdmin.js').getFirebaseAuth;
  try {
    ({ getFirebaseAuth } = await import('../config/firebaseAdmin.js'));
  } catch (err: any) {
    console.warn('⚠️ Firebase Admin לא זמין:', err?.message);
    return undefined;
  }

  const fb = await getFirebaseAuth();
  if (!fb) return undefined;

  try {
    const record = await fb.createUser({ email, password });
    return record.uid;
  } catch (err: any) {
    // מייל כבר קיים בפיירבייס – נאמץ את המשתמש הקיים לפי המייל
    if (err?.code === 'auth/email-already-exists') {
      const record = await fb.getUserByEmail(email);
      return record.uid;
    }
    throw err;
  }
}

export const addUser = async (data: AddUserInput) => {
  const password_hash = await resolvePasswordHash(data);
  if (!password_hash) {
    throw new Error('Password is required');
  }
  if (!data.email) {
    throw new Error('Email is required');
  }

  // 1. יצירת המשתמש ב־Firebase Auth (Clone/upsert לפי מייל)
  if (data.password) {
    await createFirebaseUser(data.email, data.password);
  }

  // 2. יצירת המשתמש ב־DB
  return await User.create({
    name: data.name,
    email: data.email,
    password_hash,
    institution_code: data.institution_code,
    role_id: data.role_id,
    active: data.active ?? true,
  } as any);
};

export const updateUserById = async (id: number, data: UpdateUserInput) => {
  const item = await User.findByPk(id);
  if (!item) return null;
  const password_hash = await resolvePasswordHash(data);
  const updatePayload: any = { ...data };
  if (password_hash) updatePayload.password_hash = password_hash;
  if (data.password) delete updatePayload.password;
  await item.update(updatePayload);
  return await User.findByPk(id, { include: [Role] });
};

export const deleteUserById = async (id: number) => {
  const deleted = await User.destroy({ where: { id } });
  return deleted > 0;
};
