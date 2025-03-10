"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
} from "firebase/auth"
import axios from "axios"
import { app } from "@/lib/firebase"

interface User {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  token?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, name: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithGithub: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const auth = getAuth(app)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get the ID token
        const token = await firebaseUser.getIdToken()

        // Create or update user in MongoDB
        try {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/user`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
        } catch (error) {
          console.error("Error syncing user with database:", error)
        }

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          token,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [auth])

  const signUp = async (email: string, password: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(userCredential.user, { displayName: name })

    // Get the ID token
    const token = await userCredential.user.getIdToken()

    // Create user in MongoDB
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/user`,
      {
        name,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    // Update the user state with the display name and token
    setUser({
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: name,
      photoURL: userCredential.user.photoURL,
      token,
    })
  }

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  const signInWithGithub = async () => {
    const provider = new GithubAuthProvider()
    await signInWithPopup(auth, provider)
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signInWithGoogle, signInWithGithub, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

