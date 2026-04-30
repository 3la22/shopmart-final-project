'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from '@/lib/axios'
import { WishlistItem } from '@/types'
import toast from 'react-hot-toast'
import { useAuth } from './AuthContext'

interface WishlistContextType {
  wishlist: WishlistItem[]
  wishlistIds: string[]
  addToWishlist: (productId: string) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
  fetchWishlist: () => Promise<void>
}

const WishlistContext = createContext<WishlistContextType | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [wishlistIds, setWishlistIds] = useState<string[]>([])
  const { token } = useAuth()

  const fetchWishlist = async () => {
    if (!token) return
    try {
      const res = await api.get('/wishlist')
      setWishlist(res.data.data || [])
      setWishlistIds((res.data.data || []).map((p: WishlistItem) => p._id))
    } catch {
      setWishlist([])
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [token])

  const addToWishlist = async (productId: string) => {
    try {
      await api.post('/wishlist', { productId })
      setWishlistIds(prev => [...prev, productId])
      toast.success('Added to wishlist ❤️')
      await fetchWishlist()
    } catch {
      toast.error('Please login first')
    }
  }

  const removeFromWishlist = async (productId: string) => {
    try {
      await api.delete(`/wishlist/${productId}`)
      setWishlistIds(prev => prev.filter(id => id !== productId))
      setWishlist(prev => prev.filter(p => p._id !== productId))
      toast.success('Removed from wishlist')
    } catch {
      toast.error('Error removing item')
    }
  }

  const isInWishlist = (productId: string) => wishlistIds.includes(productId)

  return (
    <WishlistContext.Provider value={{
      wishlist,
      wishlistIds,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      fetchWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
