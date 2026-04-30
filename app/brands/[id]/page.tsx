'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import api from '@/lib/axios'
import { Brand, Product } from '@/types'
import ProductCard from '@/components/product/ProductCard'
import { ProductGridSkeleton } from '@/components/common/Skeletons'

export default function BrandDetailPage() {
  const { id } = useParams()
  const [brand, setBrand] = useState<Brand | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([
      api.get(`/brands/${id}`),
      api.get(`/products?brand[in][]=${id}&limit=20`)
    ])
      .then(([brandRes, productsRes]) => {
        setBrand(brandRes.data.data)
        setProducts(productsRes.data.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Brand Hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <Link href="/brands" className="hover:text-primary-600">Brands</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{brand?.name}</span>
          </nav>

          {loading ? (
            <div className="flex items-center gap-6">
              <div className="skeleton w-24 h-24 rounded-2xl flex-shrink-0" />
              <div className="space-y-2">
                <div className="skeleton h-6 w-40 rounded" />
                <div className="skeleton h-4 w-24 rounded" />
              </div>
            </div>
          ) : brand && (
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0">
                <Image src={brand.image} alt={brand.name} fill sizes="96px" className="object-contain p-3" />
              </div>
              <div>
                <h1 className="section-title mb-1">{brand.name}</h1>
                <p className="text-gray-500 text-sm">{products.length} products available</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6">All Products</h2>
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500">No products found for this brand</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
