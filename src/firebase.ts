import { initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updatePassword,
  updateProfile as updateFirebaseProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocFromServer,
  getDocs,
  getFirestore,
  initializeFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  setLogLevel,
  updateDoc,
  where,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Suppress noisy internal WebChannel transport timeout console.error logs in proxy/iframe environments
setLogLevel('silent');

const app = initializeApp(firebaseConfig);

function initFirestoreInstance(): Firestore {
  try {
    return initializeFirestore(
      app,
      {
        experimentalAutoDetectLongPolling: true,
      },
      firebaseConfig.firestoreDatabaseId
    );
  } catch {
    return getFirestore(app, firebaseConfig.firestoreDatabaseId);
  }
}

export const db = initFirestoreInstance();
export const auth = getAuth(app);

// Keep sessions persisted across tab close and browser restart until explicit logout
export const authPersistenceReady = setPersistence(auth, browserLocalPersistence).catch(() => {
  // Fallback safely in restricted storage modes
});

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: boolean | string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const message = error instanceof Error ? error.message : String(error);
  const errInfo: FirestoreErrorInfo = {
    error: message,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };

  const isTransientOffline =
    message.includes('client is offline') ||
    message.includes('Could not reach Cloud Firestore backend') ||
    message.includes('unavailable');

  if (isTransientOffline) {
    console.warn('Firestore operating in offline fallback mode:', JSON.stringify(errInfo));
  } else {
    console.error('Firestore Error: ', JSON.stringify(errInfo));
  }

  throw new Error(JSON.stringify(errInfo));
}

export function mapFirebaseAuthError(error: unknown): string {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code?: unknown }).code || '')
      : '';
  const rawMessage = error instanceof Error ? error.message : String(error || '');

  switch (code) {
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by your browser. Please allow popups for this site and try again.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in popup was closed before completing authentication.';
    case 'auth/cancelled-popup-request':
      return 'Sign-in request was cancelled because another sign-in popup is already open.';
    case 'auth/network-request-failed':
      return 'Network connection failed. Check your internet connection and try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please sign in instead.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password. Please verify your credentials or reset your password.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password is too weak. Use at least 6 characters.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a few minutes before trying again.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Contact support for assistance.';
    case 'auth/operation-not-allowed':
      return 'This sign-in provider is not enabled yet in Firebase Authentication Console.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email. Sign in with your original method to link your Google account.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for Google Sign-In in Firebase Console.';
    default:
      if (rawMessage.toLowerCase().includes('network')) {
        return 'Network error occurred while contacting authentication service.';
      }
      return rawMessage || 'Authentication failed. Please try again.';
  }
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'settings', 'public'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore client is currently in offline mode; using local state cache.');
    }
  }
}

testConnection();

export type { FirebaseUser };

export {
  collection,
  createUserWithEmailAndPassword,
  doc,
  getDoc,
  getDocs,
  onAuthStateChanged,
  onSnapshot,
  orderBy,
  query,
  sendEmailVerification,
  sendPasswordResetEmail,
  serverTimestamp,
  setDoc,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateDoc,
  updateFirebaseProfile,
  updatePassword,
  where,
};
