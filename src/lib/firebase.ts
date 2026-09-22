import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { UserProfile, UserRole, ClassroomPack, StudentQuizSubmission } from '@/types';

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDkUh7uf_pHoETYGyxyNz7svIRRUgRWMas',
  authDomain: 'kaksha-ai-portal.firebaseapp.com',
  projectId: 'kaksha-ai-portal',
  storageBucket: 'kaksha-ai-portal.firebasestorage.app',
  messagingSenderId: '876774484101',
  appId: '1:876774484101:web:b20fee177edf9e1612a1ec',
};

// Initialize Firebase App singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

const USERS_COLLECTION = 'users';
const PACKS_COLLECTION = 'classroom_packs';
const SUBMISSIONS_COLLECTION = 'submissions';

/**
 * Register a new user with real Firebase Email & Password
 */
export async function registerWithEmail(
  email: string,
  pass: string,
  profile: {
    name: string;
    role: UserRole;
    department?: string;
    enrollmentOrStaffId?: string;
    institution?: string;
  }
): Promise<UserProfile> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const fbUser = userCredential.user;

  // Update Firebase display name
  await updateProfile(fbUser, {
    displayName: profile.name,
  });

  const userProfile: UserProfile = {
    id: fbUser.uid,
    name: profile.name,
    email: fbUser.email || email,
    role: profile.role,
    institution: profile.institution || 'Institute of Advanced Research',
    department: profile.department || (profile.role === 'STAFF' ? 'Faculty of Engineering & AI' : 'B.Tech AI & Data Science'),
  };

  // Persist to Cloud Firestore if reachable
  try {
    const userDocRef = doc(db, USERS_COLLECTION, fbUser.uid);
    await setDoc(userDocRef, {
      ...userProfile,
      enrollmentOrStaffId: profile.enrollmentOrStaffId || '',
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('[Firebase] Firestore user profile sync skipped (rules or offline):', err);
  }

  // Also cache locally for instant offline load
  if (typeof window !== 'undefined') {
    localStorage.setItem(`kaksha_profile_${fbUser.uid}`, JSON.stringify(userProfile));
  }

  return userProfile;
}

/**
 * Sign in existing user with real Firebase Email & Password
 */
export async function loginWithEmail(
  email: string,
  pass: string,
  fallbackRole: UserRole = 'STUDENT'
): Promise<UserProfile> {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  const fbUser = userCredential.user;

  // Try to load user profile from Firestore
  try {
    const userDocRef = doc(db, USERS_COLLECTION, fbUser.uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        id: fbUser.uid,
        name: data.name || fbUser.displayName || email.split('@')[0],
        email: fbUser.email || email,
        role: data.role || fallbackRole,
        institution: data.institution || 'Institute of Advanced Research',
        department: data.department || '',
      };
    }
  } catch (err) {
    console.warn('[Firebase] Could not fetch user doc from Firestore:', err);
  }

  // Check local cache
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(`kaksha_profile_${fbUser.uid}`);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // ignore
      }
    }
  }

  // Default constructed profile
  return {
    id: fbUser.uid,
    name: fbUser.displayName || email.split('@')[0],
    email: fbUser.email || email,
    role: fallbackRole,
    institution: 'Institute of Advanced Research',
    department: fallbackRole === 'STAFF' ? 'Department of Computer Science & AI' : 'B.Tech AI & Data Science',
  };
}

/**
 * Sign in with Google (1-Click OAuth)
 */
export async function loginWithGoogle(intendedRole: UserRole = 'STUDENT'): Promise<UserProfile> {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const fbUser = userCredential.user;

  // Check if profile exists
  try {
    const userDocRef = doc(db, USERS_COLLECTION, fbUser.uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        id: fbUser.uid,
        name: data.name || fbUser.displayName || 'Google User',
        email: fbUser.email || '',
        role: data.role || intendedRole,
        institution: data.institution || 'Institute of Advanced Research',
        department: data.department || '',
      };
    } else {
      // Save new Google user
      const newProfile: UserProfile = {
        id: fbUser.uid,
        name: fbUser.displayName || 'Google User',
        email: fbUser.email || '',
        role: intendedRole,
        institution: 'Institute of Advanced Research',
        department: intendedRole === 'STAFF' ? 'Faculty of Engineering & AI' : 'B.Tech AI & Data Science',
      };
      await setDoc(userDocRef, {
        ...newProfile,
        createdAt: new Date().toISOString(),
      });
      return newProfile;
    }
  } catch (err) {
    console.warn('[Firebase] Google sign-in Firestore sync fallback:', err);
    return {
      id: fbUser.uid,
      name: fbUser.displayName || 'Google User',
      email: fbUser.email || '',
      role: intendedRole,
      institution: 'Institute of Advanced Research',
      department: intendedRole === 'STAFF' ? 'Faculty of Engineering & AI' : 'B.Tech AI & Data Science',
    };
  }
}

/**
 * Sign out
 */
export async function logoutFirebase(): Promise<void> {
  await signOut(auth);
}

/**
 * Listen to real-time Firebase Auth state changes
 */
export function onFirebaseAuthState(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Cloud Storage: Save a generated Classroom Pack to Firestore so all students can access it
 */
export async function savePackToFirestore(pack: ClassroomPack): Promise<void> {
  try {
    const packRef = doc(db, PACKS_COLLECTION, pack.id);
    await setDoc(packRef, {
      ...pack,
      syncedAt: new Date().toISOString(),
    });
    console.log(`[Firebase] Classroom pack "${pack.topic}" saved to Cloud Firestore!`);
  } catch (err) {
    console.warn('[Firebase] Could not save pack to Firestore (using local storage fallback):', err);
  }
}

/**
 * Cloud Storage: Fetch all active published classroom packs
 */
export async function fetchPacksFromFirestore(): Promise<ClassroomPack[]> {
  try {
    const q = query(collection(db, PACKS_COLLECTION), limit(20));
    const snapshot = await getDocs(q);
    const packs: ClassroomPack[] = [];
    snapshot.forEach((d) => {
      packs.push(d.data() as ClassroomPack);
    });
    return packs;
  } catch (err) {
    console.warn('[Firebase] Could not fetch packs from Firestore:', err);
    return [];
  }
}

/**
 * Cloud Storage: Submit student quiz response to Firestore
 */
export async function submitQuizToFirestore(submission: StudentQuizSubmission): Promise<void> {
  try {
    const subRef = doc(db, SUBMISSIONS_COLLECTION, submission.id);
    await setDoc(subRef, {
      ...submission,
      submittedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('[Firebase] Could not sync quiz submission to Firestore:', err);
  }
}
