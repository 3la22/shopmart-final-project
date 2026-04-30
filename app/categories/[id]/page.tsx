'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import api from '@/lib/axios'
import { Category, Subcategory, Product } from '@/types'
import ProductCard from '@/components/product/ProductCard'
import { ProductGridSkeleton } from '@/components/common/Skeletons'

export default function CategoryDetailPage() {
  const { id } = useParams()
  const [category, setCategory] = useState<Category | null>(null)
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSub, setSelectedSub] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    Promise.all([
      api.get(`/categories/${id}`),
      api.get(`/categories/${id}/subcategories`),
      api.get(`/products?category[in][]=${id}&limit=20`)
    ])
      .then(([catRes, subRes, prodRes]) => {
        setCategory(catRes.data.data)
        setSubcategories(subRes.data.data || [])
        setProducts(prodRes.data.data || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  const filteredProducts = selectedSub
    ? products.filter(p => p.subcategory?.some(s => s._id === selectedSub))
    : products

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-primary-600">Categories</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{category?.name}</span>
          </nav>

          {loading ? (
            <div className="flex items-center gap-6">
              <div className="skeleton w-20 h-20 rounded-2xl" />
              <div className="skeleton h-8 w-48 rounded" />
            </div>
          ) : category && (
            <div className="flex items-center gap-6">
              <div className="relative w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0">
                <Image src={category.image} alt={category.name} fill sizes="80px" className="object-cover" />
              </div>
              <div>
                <h1 className="section-title mb-1">{category.name}</h1>
                <p className="text-gray-500 text-sm">{products.length} products</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Subcategories Filter */}
      {subcategories.length > 0 && (
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedSub(null)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  !selectedSub ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {subcategories.map(sub => (
                <button
                  key={sub._id}
                  onClick={() => setSelectedSub(sub._id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedSub === sub._id ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500">No products found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
