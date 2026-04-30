'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from '@/lib/axios'
import { Cart } from '@/types'
import toast from 'react-hot-toast'
import { useAuth } from './AuthContext'

interface CartContextType {
  cart: Cart | null
  cartCount: number
  addToCart: (productId: string) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  updateQuantity: (productId: string, count: number) => Promise<void>
  clearCart: () => Promise<void>
  fetchCart: () => Promise<void>
  isLoading: boolean
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { token } = useAuth()

  const fetchCart = async () => {
    if (!token) return
    try {
      const res = await api.get('/cart')
      setCart(res.data.data)
    } catch {
      setCart(null)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [token])

  const addToCart = async (productId: string) => {
    setIsLoading(true)
    try {
      const res = await api.post('/cart', { productId })
      setCart(res.data.data)
      toast.success('Added to cart!')
    } catch {
      toast.error('Please login first')
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromCart = async (productId: string) => {
    try {
      const res = await api.delete(`/cart/${productId}`)
      setCart(res.data.data)
      toast.success('Removed from cart')
    } catch {
      toast.error('Error removing item')
    }
  }

  const updateQuantity = async (productId: string, count: number) => {
    try {
      const res = await api.put(`/cart/${productId}`, { count })
      setCart(res.data.data)
    } catch {
      toast.error('Error updating quantity')
    }
  }

  const clearCart = async () => {
    try {
      await api.delete('/cart')
      setCart(null)
    } catch {
      toast.error('Error clearing cart')
    }
  }

  return (
    <CartContext.Provider value={{
      cart,
      cartCount: cart?.numOfCartItems || 0,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      fetchCart,
      isLoading,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
