import "server-only";

import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

function createAdminApp() {
  if (getApps().length) return getApp();

  // Emulator suite doesn't need real credentials, just a project id.
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    return initializeApp({ projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID });
  }

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

let cachedAuth: Auth | undefined;
let cachedDb: Firestore | undefined;

// Lazy on purpose: Next.js executes this module - including any top-level
// code - while collecting build-time page data for routes that import it,
// even fully dynamic ones. Initializing eagerly meant a Vercel build with
// the service account env vars not set yet failed before a single request
// had happened. Deferring the actual initializeApp()/cert() call until
// something asks for it keeps the build unaffected either way.
export function getAdminAuth(): Auth {
  cachedAuth ??= getAuth(createAdminApp());
  return cachedAuth;
}

export function getAdminDb(): Firestore {
  cachedDb ??= getFirestore(createAdminApp());
  return cachedDb;
}
