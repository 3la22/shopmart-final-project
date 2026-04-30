import type { Metadata } from 'next'
import '../styles/globals.scss'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/context/WishlistContext'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'ShopMart — Premium E-Commerce',
  description: 'Discover amazing products at the best prices',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Navbar />
              <main className="min-h-screen">
                {children}
              </main>
              <Footer />
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: '#1a1a1a',
                    color: '#fff',
                    borderRadius: '12px',
                    fontSize: '14px',
                  },
                  success: {
                    iconTheme: { primary: '#16a34a', secondary: '#fff' },
                  },
                }}
              />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
