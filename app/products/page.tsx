"use client"

import { useState, useEffect } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import ProductCard from "@/components/ProductCard"
import { useCart } from "@/hooks/useCart"

interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"))
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[]
        setProducts(productsData)
      } catch (error) {
        console.error("Error fetching products:", error)
        setError("Error al cargar los productos")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md mx-auto">
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="mt-2 btn-primary">
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Catálogo de Productos</h1>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">¡Próximamente!</h2>
            <p className="text-blue-600 mb-4">Estamos preparando nuestro catálogo de productos.</p>
            <p className="text-sm text-blue-500">
              Mientras tanto, puedes registrarte para recibir notificaciones cuando estén disponibles.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={() => addToCart(product)} />
          ))}
        </div>
      )}
    </div>
  )
}
