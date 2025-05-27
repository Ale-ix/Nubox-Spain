"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useCart } from "@/hooks/useCart"

export default function Navbar() {
  const { user, userRole } = useAuth()
  const { cart } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      const { signOut } = await import("firebase/auth")
      const { auth } = await import("@/lib/firebase")
      await signOut(auth)
    } catch (error) {
      console.error("Error cerrando sesión:", error)
    }
  }

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <nav className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold hover:text-blue-200 transition-colors">
            NuBox Spain
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/products" className="hover:text-blue-200 transition-colors">
              Productos
            </Link>

            <Link href="/cart" className="hover:text-blue-200 transition-colors relative">
              Carrito
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {user ? (
              <>
                {userRole === "admin" && (
                  <Link href="/admin" className="hover:text-blue-200 transition-colors">
                    Admin
                  </Link>
                )}
                <button onClick={handleSignOut} className="hover:text-blue-200 transition-colors">
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="hover:text-blue-200 transition-colors">
                  Iniciar Sesión
                </Link>
                <Link href="/auth/register" className="hover:text-blue-200 transition-colors">
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden focus:outline-none">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-500">
            <div className="flex flex-col space-y-3">
              <Link href="/products" className="hover:text-blue-200 transition-colors">
                Productos
              </Link>

              <Link href="/cart" className="hover:text-blue-200 transition-colors flex items-center">
                Carrito
                {cartItemsCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {user ? (
                <>
                  {userRole === "admin" && (
                    <Link href="/admin" className="hover:text-blue-200 transition-colors">
                      Admin
                    </Link>
                  )}
                  <button onClick={handleSignOut} className="hover:text-blue-200 transition-colors text-left">
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="hover:text-blue-200 transition-colors">
                    Iniciar Sesión
                  </Link>
                  <Link href="/auth/register" className="hover:text-blue-200 transition-colors">
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
