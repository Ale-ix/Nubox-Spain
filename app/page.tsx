"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirigir a productos después de un breve delay
    const timer = setTimeout(() => {
      router.push("/products")
    }, 100)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">NuBox Spain</h1>
          <p className="text-gray-600 text-lg">Bienvenido a nuestra tienda online</p>
        </div>

        <div className="mb-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Cargando tienda...</p>
        </div>

        <div className="space-y-4">
          <a
            href="/products"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Ver Productos
          </a>
          <a
            href="/auth/login"
            className="block w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Iniciar Sesión
          </a>
        </div>
      </div>
    </div>
  )
}
