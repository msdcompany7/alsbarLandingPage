import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage, type Storage } from "firebase-admin/storage";

function normalizePrivateKey(raw: string) {
  return raw.replace(/\\n/g, "\n").trim();
}

function isValidPrivateKeyPem(key: string) {
  return (
    key.includes("BEGIN PRIVATE KEY") ||
    key.includes("BEGIN RSA PRIVATE KEY") ||
    key.includes("BEGIN EC PRIVATE KEY")
  );
}

export function getFirebaseAdminPrivateKey() {
  const raw = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.trim();
  if (!raw) {
    return undefined;
  }

  const key = normalizePrivateKey(raw);
  if (!isValidPrivateKeyPem(key)) {
    return undefined;
  }

  return key;
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
