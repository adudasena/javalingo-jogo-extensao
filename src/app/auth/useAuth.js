// src/app/auth/useAuth.js
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Cadastro
  async function signup(email, password, name) {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        xp: 0,
        level: 1,
        coins: 0,
        skins: ["javaliClassico"],
        createdAt: new Date(),
      });

      return user;
    } catch (err) {
      setError(err.message);
      console.error("Erro ao cadastrar:", err);
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Login
  async function login(email, password) {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          email,
          xp: 0,
          level: 1,
          coins: 0,
          skins: ["javaliClassico"],
          createdAt: new Date(),
        });
      }

      return user;
    } catch (err) {
      setError(err.message);
      console.error("Erro ao logar:", err);
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Logout
  async function logout() {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Erro ao sair:", err);
    }
  }

  return { signup, login, logout, loading, error };
}
