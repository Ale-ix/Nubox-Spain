"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [firebaseReady, setFirebaseReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Cargar Firebase dinámicamente
    import("@/lib/firebase")
      .then(() => {
        setFirebaseReady(true)
      })
      .catch((error) => {
        console.error("Error cargando Firebase:", error)
        setError("Error de configuración. Por favor, recarga la página.")
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!firebaseReady) {
      setError("Firebase aún no está listo. Por favor, espera un momento.")
      return
    }

    setError("")
    setLoading(true)

    try {
      const { signInWithEmailAndPassword } = await import("firebase/auth")
      const { auth } = await import("@/lib/firebase")

      await signInWithEmailAndPassword(auth, email, password)
      router.push("/products")
    } catch (error: any) {
      console.error("Error de login:", error)
      setError("Credenciales incorrectas. Por favor, verifica tu email y contraseña.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Iniciar Sesión</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Accede a tu cuenta de NuBox Spain</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field mt-1"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field mt-1"
                placeholder="Tu contraseña"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !firebaseReady}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? "Iniciando sesión..." : !firebaseReady ? "Cargando..." : "Iniciar Sesión"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{" "}
              <Link href="/auth/register" className="text-blue-600 hover:text-blue-500">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
