"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { db, storage } from "@/lib/firebase"

interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
}

export default function AdminPanel() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: null as File | null,
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

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
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      let imageUrl = editingProduct?.imageUrl || ""

      // Upload image if provided
      if (formData.image) {
        const imageRef = ref(storage, `products/${Date.now()}_${formData.image.name}`)
        await uploadBytes(imageRef, formData.image)
        imageUrl = await getDownloadURL(imageRef)
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        imageUrl,
      }

      if (editingProduct) {
        // Update existing product
        await updateDoc(doc(db, "products", editingProduct.id), productData)
      } else {
        // Add new product
        await addDoc(collection(db, "products"), productData)
      }

      // Reset form
      setFormData({ name: "", description: "", price: "", image: null })
      setEditingProduct(null)
      fetchProducts()

      alert(editingProduct ? "Producto actualizado" : "Producto añadido")
    } catch (error) {
      console.error("Error saving product:", error)
      alert("Error al guardar el producto")
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: null,
    })
  }

  const handleDelete = async (product: Product) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      return
    }

    try {
      // Delete from Firestore
      await deleteDoc(doc(db, "products", product.id))

      // Delete image from Storage if exists
      if (product.imageUrl) {
        try {
          const imageRef = ref(storage, product.imageUrl)
          await deleteObject(imageRef)
        } catch (error) {
          console.log("Image not found in storage or already deleted")
        }
      }

      fetchProducts()
      alert("Producto eliminado")
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Error al eliminar el producto")
    }
  }

  const cancelEdit = () => {
    setEditingProduct(null)
    setFormData({ name: "", description: "", price: "", image: null })
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando productos...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Product Form */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {editingProduct ? "Editar Producto" : "Añadir Nuevo Producto"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="Nombre del producto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows={3}
              placeholder="Descripción del producto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="input-field"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagen del Producto</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
              className="input-field"
            />
            {editingProduct && !formData.image && (
              <p className="text-sm text-gray-500 mt-1">Deja vacío para mantener la imagen actual</p>
            )}
          </div>

          <div className="flex space-x-4">
            <button type="submit" disabled={uploading} className="btn-primary">
              {uploading ? "Guardando..." : editingProduct ? "Actualizar" : "Añadir"} Producto
            </button>

            {editingProduct && (
              <button type="button" onClick={cancelEdit} className="btn-secondary">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Products List */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Productos Existentes ({products.length})</h2>

        {products.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No hay productos registrados</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                <img
                  src={product.imageUrl || "/placeholder.svg?height=150&width=200"}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />

                <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>

                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>

                <p className="text-lg font-bold text-blue-600 mb-3">${product.price.toFixed(2)}</p>

                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(product)} className="btn-primary text-sm flex-1">
                    Editar
                  </button>

                  <button onClick={() => handleDelete(product)} className="btn-danger text-sm flex-1">
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
