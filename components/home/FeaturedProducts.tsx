'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import api from '@/lib/axios'
import { Product } from '@/types'
import ProductCard from '@/components/product/ProductCard'
import { ProductGridSkeleton } from '@/components/common/Skeletons'

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/products?limit=8&sort=-ratingsAverage')
      .then(res => setProducts(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-primary-600 font-medium text-sm uppercase tracking-widest mb-2">Top Picks</p>
            <h2 className="section-title">Featured Products</h2>
          </div>
          <Link href="/products" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
