import { readFileSync, existsSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

/**
 * מודול אתחול של Firebase Admin SDK בשרת.
 * טוען את קובץ ה־service account (firebase-adminsdk) מתיקיית config/.
 *
 * אם לא נמצא קובץ credentials – מחזיר null בלי לשבור את השרת,
 * כך שמערכת המשתמשים ממשיכה לעבוד (רק ללא יצירת משתמשים בפיירבס).
 *
 * החבילה `firebase-admin` נטענת **דינמית** ולא בסטטיים בראש הקובץ:
 * היא מסומנת כ-external ב-esbuild, ואם היא חסרה ב-node_modules ייבוא סטטי
 * מפיל את כל השרת בעלייה (ERR_MODULE_NOT_FOUND), גם כשלא משתמשים במשתמשים.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// מחפש קובץ service account (firebase-adminsdk*.json) בתיקיית config/
function findServiceAccountFile(): string | null {
  const configDir = path.resolve(__dirname, '..', '..', 'config');
  if (!existsSync(configDir)) return null;
  const found = readdirSync(configDir).find((f) => f.includes('firebase-adminsdk'));
  return found ? path.join(configDir, found) : null;
}

// טיפוסים מקומיים: מאפשרים קומפילציה גם כש-firebase-admin לא מותקן.
type FirebaseAdminApp = unknown;
export type FirebaseAuthLike = {
  createUser(props: { email: string; password: string }): Promise<{ uid: string }>;
  getUserByEmail(email: string): Promise<{ uid: string }>;
};

let app: FirebaseAdminApp | null = null;
let sdk: {
  initializeApp: (options: any) => FirebaseAdminApp;
  cert: (serviceAccount: any) => any;
  getApps: () => FirebaseAdminApp[];
  getAuth: (app: FirebaseAdminApp) => FirebaseAuthLike;
} | null = null;
let sdkLoadFailed = false;

async function loadSdk() {
  if (sdk) return sdk;
  if (sdkLoadFailed) return null;
  try {
    const [appMod, authMod] = await Promise.all([
      import('firebase-admin/app'),
      import('firebase-admin/auth'),
    ]);
    sdk = {
      initializeApp: appMod.initializeApp,
      cert: appMod.cert,
      getApps: appMod.getApps,
      getAuth: authMod.getAuth as unknown as (a: FirebaseAdminApp) => FirebaseAuthLike,
    };
    return sdk;
  } catch (err: any) {
    sdkLoadFailed = true;
    console.warn('⚠️ Firebase Admin: החבילה firebase-admin אינה זמינה:', err?.message);
    return null;
  }
}

export async function getFirebaseAdmin(): Promise<FirebaseAdminApp | null> {
  if (app) return app;

  const serviceAccountPath = findServiceAccountFile();
  if (!serviceAccountPath) {
    console.warn('⚠️ Firebase Admin: לא נמצא קובץ service account. יצירת משתמשים בפיירבס לא תהיה זמינה.');
    return null;
  }

  const sdkModule = await loadSdk();
  if (!sdkModule) return null;

  // אם כבר אותחל אפ (למשל ע"י מודול אחר)
  const existing = sdkModule.getApps();
  if (existing.length > 0) {
    app = existing[0] ?? null;
    return app;
  }

  try {
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
    app = sdkModule.initializeApp({
      credential: sdkModule.cert({
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

export async function getFirebaseAuth(): Promise<FirebaseAuthLike | null> {
  const fb = await getFirebaseAdmin();
  if (!fb || !sdk) return null;
  return sdk.getAuth(fb);
}
