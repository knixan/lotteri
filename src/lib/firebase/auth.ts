import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { auth, db } from "@/lib/firebase/client";
import type { UserProfile } from "@/lib/types/user";

export async function signUpWithEmail(
  name: string,
  email: string,
  password: string
) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: name });

  const profile: UserProfile = {
    uid: credential.user.uid,
    displayName: name,
    email,
    role: "member",
    createdAt: new Date().toISOString(),
  };
  await setDoc(doc(db, "users", credential.user.uid), profile);

  return credential.user;
}

export async function signInWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function signOutUser() {
  await signOut(auth);
}
