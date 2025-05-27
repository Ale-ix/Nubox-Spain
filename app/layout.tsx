import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import { AuthProvider } from "@/hooks/useAuth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NuBox Spain - E-commerce",
  description: "Plataforma de e-commerce moderna para NuBox Spain",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div id="__next">
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen bg-gray-50">{children}</main>
          </AuthProvider>
        </div>
      </body>
    </html>
  )
}
