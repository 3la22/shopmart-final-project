'use client'
import { useWishlist } from '@/context/WishlistContext'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import Link from 'next/link'

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  if (wishlist.length === 0) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-20">
          <div className="w-28 h-28 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-14 h-14 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-2xl font-bold text-gray-800 mb-3">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8">Save your favorite products here</p>
          <Link href="/products" className="btn-primary inline-flex items-center gap-2">
            Explore Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="section-title mb-2">My Wishlist</h1>
        <p className="text-gray-500 text-sm mb-8">{wishlist.length} saved items</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {wishlist.map(product => (
            <div key={product._id} className="product-card group">
              {/* Remove button */}
              <button
                onClick={() => removeFromWishlist(product._id)}
                className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-red-400 hover:text-red-600 hover:scale-110 transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              <Link href={`/products/${product._id}`}>
                <div className="relative overflow-hidden bg-gray-50 h-52">
                  <Image
                    src={product.imageCover}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </Link>

              <div className="p-4">
                <p className="text-xs text-primary-600 font-medium mb-1 uppercase tracking-wide">{product.category?.name}</p>
                <Link href={`/products/${product._id}`}>
                  <h3 className="text-sm font-medium text-gray-900 mb-3 line-clamp-2 hover:text-primary-600 transition-colors">
                    {product.title}
                  </h3>
                </Link>

                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className={`w-3 h-3 ${s <= Math.round(product.ratingsAverage) ? 'stars-filled' : 'stars-empty'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-xs text-gray-400 ml-1">({product.ratingsQuantity})</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    {(product.priceAfterDiscount || product.price).toLocaleString()} EGP
                  </span>
                  <button
                    onClick={() => addToCart(product._id)}
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium px-3 py-2 rounded-xl transition-all active:scale-95"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
