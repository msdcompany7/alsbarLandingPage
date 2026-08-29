import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage, type Storage } from "firebase-admin/storage";

const FIREBASE_ADMIN_PRIVATE_KEY_ENV = "FIREBASE_ADMIN_PRIVATE_KEY";
const PKCS8_BEGIN = "-----BEGIN PRIVATE KEY-----";
const PKCS8_END = "-----END PRIVATE KEY-----";

function stripSurroundingQuotes(value: string) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function normalizePrivateKey(raw: string) {
  let key = raw.replace(/^\uFEFF/, "").trim();
  key = stripSurroundingQuotes(key);
  key = key.replace(/\\n/g, "\n");
  key = key.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  return key.trim();
}

function getPrivateKeyDiagnostics(key: string) {
  return {
    beginMarkerPresent: key.startsWith(PKCS8_BEGIN),
    endMarkerPresent: key.endsWith(PKCS8_END),
    containsNewlines: key.includes("\n"),
    normalizedLength: key.length,
  };
}

function formatPrivateKeyValidationError(key: string) {
  const diagnostics = getPrivateKeyDiagnostics(key);

  return (
    `${FIREBASE_ADMIN_PRIVATE_KEY_ENV} PEM validation failed after normalization. ` +
    `BEGIN marker present: ${diagnostics.beginMarkerPresent}. ` +
    `END marker present: ${diagnostics.endMarkerPresent}. ` +
    `Contains newline characters: ${diagnostics.containsNewlines}. ` +
    `Normalized length: ${diagnostics.normalizedLength}.`
  );
}

function assertValidPrivateKeyPem(key: string) {
  const diagnostics = getPrivateKeyDiagnostics(key);

  if (!diagnostics.beginMarkerPresent || !diagnostics.endMarkerPresent) {
    throw new Error(formatPrivateKeyValidationError(key));
  }
}

function structurePkcs8PrivateKey(key: string) {
  const beginIndex = key.indexOf(PKCS8_BEGIN);
  const endIndex = key.lastIndexOf(PKCS8_END);

  if (beginIndex === -1 || endIndex === -1 || endIndex < beginIndex) {
    throw new Error(formatPrivateKeyValidationError(key));
  }

  const body = key.slice(beginIndex + PKCS8_BEGIN.length, endIndex);
  const base64 = body.replace(/\s/g, "");

  if (!base64) {
    throw new Error(formatPrivateKeyValidationError(key));
  }

  const wrapped = base64.match(/.{1,64}/g)?.join("\n") ?? base64;

  return `${PKCS8_BEGIN}\n${wrapped}\n${PKCS8_END}`;
}

export function getFirebaseAdminPrivateKey() {
  const raw = process.env[FIREBASE_ADMIN_PRIVATE_KEY_ENV]?.trim();
  if (!raw) {
    return undefined;
  }

  const normalized = normalizePrivateKey(raw);
  assertValidPrivateKeyPem(normalized);

  return structurePkcs8PrivateKey(normalized);
}

function createAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0]!;
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();
  const privateKey = getFirebaseAdminPrivateKey();

  if (!projectId) {
    throw new Error("Missing FIREBASE_ADMIN_PROJECT_ID.");
  }

  if (!clientEmail) {
    throw new Error("Missing FIREBASE_ADMIN_CLIENT_EMAIL.");
  }

  if (!privateKey) {
    throw new Error(
      "FIREBASE_ADMIN_PRIVATE_KEY is missing or invalid. Paste the full PEM private key from your Firebase service account JSON (including BEGIN/END lines). In .env, use \\n for line breaks inside quotes.",
    );
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

let adminApp: App | undefined;
let adminAuth: Auth | undefined;
let adminDb: Firestore | undefined;
let adminStorage: Storage | undefined;

export function getAdminApp(): App {
  if (!adminApp) {
    adminApp = createAdminApp();
  }
  return adminApp;
}

export function getAdminAuth(): Auth {
  if (!adminAuth) {
    adminAuth = getAuth(getAdminApp());
  }
  return adminAuth;
}

export function getAdminDb(): Firestore {
  if (!adminDb) {
    adminDb = getFirestore(getAdminApp());
  }
  return adminDb;
}

export function getAdminStorage(): Storage {
  if (!adminStorage) {
    adminStorage = getStorage(getAdminApp());
  }
  return adminStorage;
}
