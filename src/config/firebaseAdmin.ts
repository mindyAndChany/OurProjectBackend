import { readFileSync, existsSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { initializeApp, cert, App, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

/**
 * מודול אתחול של Firebase Admin SDK בשרת.
 * טוען את קובץ ה־service account (firebase-adminsdk) מתיקיית config/.
 *
 * אם לא נמצא קובץ credentials – מחזיר null בלי לשבור את השרת,
 * כך שמערכת המשתמשים ממשיכה לעבוד (רק ללא יצירת משתמשים בפיירבס).
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// מחפש קובץ service account (firebase-adminsdk*.json) בתיקיית config/
function findServiceAccountFile(): string | null {
  const configDir = path.resolve(__dirname, '..', '..', 'config');
  if (!existsSync(configDir)) return null;
  const found = readdirSync(configDir).find((f) => f.includes('firebase-adminsdk'));
  return found ? path.join(configDir, found) : null;
}

let app: App | null = null;

export function getFirebaseAdmin(): App | null {
  if (app) return app;

  // אם כבר אותחל אפ (למשל ע"י מודול אחר)
  const existing = getApps();
  if (existing.length > 0) {
    app = existing[0] ?? null;
    return app;
  }

  const serviceAccountPath = findServiceAccountFile();
  if (!serviceAccountPath) {
    console.warn('⚠️ Firebase Admin: לא נמצא קובץ service account. יצירת משתמשים בפיירבס לא תהיה זמינה.');
    return null;
  }

  try {
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
    app = initializeApp({
      credential: cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key,
      }),
    });
    console.log('🔥 Firebase Admin initialized for project:', serviceAccount.project_id);
  } catch (err: any) {
    console.error('❌ Firebase Admin: failed to initialize:', err?.message);
    return null;
  }

  return app;
}

export function getFirebaseAuth() {
  const fb = getFirebaseAdmin();
  if (!fb) return null;
  return getAuth(fb);
}
