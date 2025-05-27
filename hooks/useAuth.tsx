"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { type User, onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { CartProvider } from "./useCart"

// Importación dinámica de Firebase para evitar errores de SSR
let auth: any = null
let db: any = null

if (typeof window !== "undefined") {
  import("@/lib/firebase").then((firebase) => {
    auth = firebase.auth
    db = firebase.db
  })
}

interface AuthContextType {
  user: User | null
  userRole: string | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [firebaseReady, setFirebaseReady] = useState(false)

  useEffect(() => {
    // Asegurar que Firebase esté listo antes de usar
    const initFirebase = async () => {
      if (typeof window !== "undefined") {
        try {
          const firebase = await import("@/lib/firebase")
          auth = firebase.auth
          db = firebase.db
          setFirebaseReady(true)
        } catch (error) {
          console.error("Error inicializando Firebase:", error)
          setLoading(false)
        }
      }
    }

    initFirebase()
  }, [])

  useEffect(() => {
    if (!firebaseReady || !auth) return

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)

      if (user && db) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid))
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role || "user")
          } else {
            setUserRole("user")
          }
        } catch (error) {
          console.error("Error obteniendo rol del usuario:", error)
          setUserRole("user")
        }
      } else {
        setUserRole(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [firebaseReady])

  return (
    <AuthContext.Provider value={{ user, userRole, loading }}>
      <CartProvider>{children}</CartProvider>
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider")
  }
  return context
}
