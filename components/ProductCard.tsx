"use client"

interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
}

interface ProductCardProps {
  product: Product
  onAddToCart: () => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="card">
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={product.imageUrl || "/placeholder.svg?height=200&width=300"}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-blue-600">${product.price.toFixed(2)}</span>

          <button onClick={onAddToCart} className="btn-primary text-sm">
            Añadir al Carrito
          </button>
        </div>
      </div>
    </div>
  )
}
