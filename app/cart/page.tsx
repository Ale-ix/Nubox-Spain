"use client"

import { useCart } from "@/hooks/useCart"
import { useState } from "react"
import html2canvas from "html2canvas"

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, getTotal } = useCart()
  const [isGenerating, setIsGenerating] = useState(false)

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
    } else {
      updateQuantity(id, quantity)
    }
  }

  const generateInvoice = async () => {
    setIsGenerating(true)
    try {
      const invoiceElement = document.getElementById("invoice-section")
      if (invoiceElement) {
        const canvas = await html2canvas(invoiceElement, {
          backgroundColor: "#ffffff",
          scale: 2,
          useCORS: true,
        })

        const link = document.createElement("a")
        link.download = `factura-nubox-spain-${Date.now()}.png`
        link.href = canvas.toDataURL()
        link.click()
      }
    } catch (error) {
      console.error("Error generating invoice:", error)
      alert("Error al generar la factura")
    } finally {
      setIsGenerating(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Carrito de Compras</h1>
          <p className="text-gray-600 text-lg mb-6">Tu carrito está vacío</p>
          <a href="/products" className="btn-primary">
            Continuar Comprando
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Carrito de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cart Items */}
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="card p-4">
              <div className="flex items-center space-x-4">
                <img
                  src={item.imageUrl || "/placeholder.svg?height=80&width=80"}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, Number.parseInt(e.target.value))}
                    className="w-16 input-field text-center"
                  />
                  <button onClick={() => removeFromCart(item.id)} className="btn-danger text-sm">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between pt-4">
            <button onClick={clearCart} className="btn-secondary">
              Vaciar Carrito
            </button>
            <a href="/products" className="btn-primary">
              Continuar Comprando
            </a>
          </div>
        </div>

        {/* Invoice Section */}
        <div className="lg:sticky lg:top-4">
          <div id="invoice-section" className="card p-6 bg-white">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-blue-600">NuBox Spain</h2>
              <p className="text-gray-600">Factura de Compra</p>
              <p className="text-sm text-gray-500">Fecha: {new Date().toLocaleDateString("es-ES")}</p>
            </div>

            <div className="space-y-3 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantity} x ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-gray-300 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-800">Total:</span>
                <span className="text-xl font-bold text-blue-600">${getTotal().toFixed(2)}</span>
              </div>
            </div>

            <button onClick={generateInvoice} disabled={isGenerating} className="btn-success w-full">
              {isGenerating ? "Generando..." : "Descargar Factura PNG"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
