'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import api from '@/lib/axios'
import { Product } from '@/types'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import ProductCard from '@/components/product/ProductCard'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addToCart, isLoading: cartLoading } = useCart()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.get(`/products/${id}`)
      .then(res => {
        setProduct(res.data.data)
        return api.get(`/products?category[in][]=${res.data.data.category._id}&limit=4`)
      })
      .then(res => setRelated(res.data.data.filter((p: Product) => p._id !== id)))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="skeleton h-96 rounded-3xl" />
          <div className="space-y-4">
            <div className="skeleton h-6 w-1/3 rounded" />
            <div className="skeleton h-8 w-full rounded" />
            <div className="skeleton h-8 w-3/4 rounded" />
            <div className="skeleton h-20 w-full rounded" />
            <div className="skeleton h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )

  if (!product) return (
    <div className="pt-16 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-800">Product not found</p>
        <Link href="/products" className="btn-primary mt-4 inline-block">Back to Products</Link>
      </div>
    </div>
  )

  const inWishlist = isInWishlist(product._id)
  const allImages = [product.imageCover, ...product.images]
  const discount = product.priceAfterDiscount
    ? Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100)
    : null

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary-600">Products</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium line-clamp-1">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative h-96 bg-white rounded-3xl overflow-hidden border border-gray-100">
              <Image
                src={allImages[selectedImage] || product.imageCover}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-6"
              />
              {discount && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl">
                  -{discount}% OFF
                </span>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      i === selectedImage ? 'border-primary-600' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image src={img} alt="" fill sizes="80px" className="object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Brand + Category */}
            <div className="flex items-center gap-3">
              <Link href={`/brands/${product.brand?._id}`} className="badge bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                {product.brand?.name}
              </Link>
              <Link href={`/categories/${product.category?._id}`} className="badge bg-primary-50 text-primary-700">
                {product.category?.name}
              </Link>
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)' }} className="text-3xl font-bold text-gray-900 leading-tight">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} className={`w-5 h-5 ${s <= Math.round(product.ratingsAverage) ? 'stars-filled' : 'stars-empty'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700">{product.ratingsAverage}</span>
              <span className="text-sm text-gray-400">({product.ratingsQuantity} reviews)</span>
              <span className="text-sm text-gray-400">• {product.sold} sold</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-gray-900">
                {(product.priceAfterDiscount || product.price).toLocaleString()} EGP
              </span>
              {product.priceAfterDiscount && (
                <span className="text-xl text-gray-400 line-through">
                  {product.price.toLocaleString()} EGP
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed text-sm">
              {product.description}
            </p>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${product.quantity > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`text-sm font-medium ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.quantity > 0 ? `In Stock (${product.quantity} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity + Actions */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-11 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                >−</button>
                <span className="w-12 text-center text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.quantity, q + 1))}
                  className="w-10 h-11 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                >+</button>
              </div>

              <button
                onClick={() => addToCart(product._id)}
                disabled={cartLoading || product.quantity === 0}
                className="flex-1 btn-primary flex items-center justify-center gap-2 py-3"
              >
                {cartLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>

              <button
                onClick={() => inWishlist ? removeFromWishlist(product._id) : addToWishlist(product._id)}
                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${
                  inWishlist ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500'
                }`}
              >
                <svg className="w-5 h-5" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="section-title mb-8">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {related.slice(0, 4).map(p => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
