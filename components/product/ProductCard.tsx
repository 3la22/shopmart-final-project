'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isLoading } = useCart()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const inWishlist = isInWishlist(product._id)

  const discount = product.priceAfterDiscount
    ? Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100)
    : null

  return (
    <div className="product-card group relative">
      {/* Discount Badge */}
      {discount && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
          -{discount}%
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={() => inWishlist ? removeFromWishlist(product._id) : addToWishlist(product._id)}
        className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
          inWishlist
            ? 'bg-red-500 text-white'
            : 'bg-white text-gray-400 hover:text-red-500 hover:scale-110'
        }`}
      >
        <svg className="w-4 h-4" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {/* Image */}
      <Link href={`/products/${product._id}`}>
        <div className="relative overflow-hidden bg-gray-50 h-52">
          <Image
            src={product.imageCover}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-primary-600 font-medium mb-1 uppercase tracking-wide">
          {product.category?.name}
        </p>

        {/* Title */}
        <Link href={`/products/${product._id}`}>
          <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors leading-snug">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
              <svg key={star} className={`w-3 h-3 ${star <= Math.round(product.ratingsAverage) ? 'stars-filled' : 'stars-empty'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.ratingsQuantity})</span>
        </div>

        {/* Price + Add to Cart */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">
              {(product.priceAfterDiscount || product.price).toLocaleString()} EGP
            </span>
            {product.priceAfterDiscount && (
              <span className="text-xs text-gray-400 line-through ml-2">
                {product.price.toLocaleString()} EGP
              </span>
            )}
          </div>
          <button
            onClick={() => addToCart(product._id)}
            disabled={isLoading}
            className="w-9 h-9 bg-primary-600 hover:bg-primary-700 text-white rounded-xl flex items-center justify-center transition-all active:scale-95 disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
