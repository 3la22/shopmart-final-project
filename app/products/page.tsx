'use client'
import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/axios'
import { Product, Category, Brand } from '@/types'
import ProductCard from '@/components/product/ProductCard'
import { ProductGridSkeleton } from '@/components/common/Skeletons'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [sortBy, setSortBy] = useState('-createdAt')
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [showFilters, setShowFilters] = useState(false)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: '12',
        sort: sortBy,
        ...(selectedCategory && { 'category[in][]': selectedCategory }),
        ...(selectedBrand && { 'brand[in][]': selectedBrand }),
        'price[gte]': String(priceRange[0]),
        'price[lte]': String(priceRange[1]),
      })
      const res = await api.get(`/products?${params}`)
      setProducts(res.data.data)
      setTotalPages(res.data.metadata?.numberOfPages || 1)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [currentPage, sortBy, selectedCategory, selectedBrand, priceRange])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  useEffect(() => {
    api.get('/categories?limit=50').then(r => setCategories(r.data.data))
    api.get('/brands?limit=50').then(r => setBrands(r.data.data))
  }, [])

  const clearFilters = () => {
    setSelectedCategory('')
    setSelectedBrand('')
    setSortBy('-createdAt')
    setPriceRange([0, 50000])
    setCurrentPage(1)
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="section-title mb-2">All Products</h1>
          <p className="text-gray-500 text-sm">Discover our full collection</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6 bg-white rounded-2xl p-4 border border-gray-100">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filters {(selectedCategory || selectedBrand) && <span className="w-2 h-2 bg-primary-600 rounded-full" />}
          </button>

          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-500">Sort by:</label>
            <select
              value={sortBy}
              onChange={e => { setSortBy(e.target.value); setCurrentPage(1) }}
              className="text-sm border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
            >
              <option value="-createdAt">Newest</option>
              <option value="-ratingsAverage">Top Rated</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-sold">Best Selling</option>
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters sidebar */}
          {showFilters && (
            <div className="w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Filters</h3>
                  <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-600">Clear all</button>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Category</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="category" value="" checked={!selectedCategory} onChange={() => { setSelectedCategory(''); setCurrentPage(1) }} className="text-primary-600" />
                      <span className="text-sm text-gray-600">All Categories</span>
                    </label>
                    {categories.map(cat => (
                      <label key={cat._id} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="category" value={cat._id} checked={selectedCategory === cat._id} onChange={() => { setSelectedCategory(cat._id); setCurrentPage(1) }} className="text-primary-600" />
                        <span className="text-sm text-gray-600">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brand Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Brand</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="brand" value="" checked={!selectedBrand} onChange={() => { setSelectedBrand(''); setCurrentPage(1) }} className="text-primary-600" />
                      <span className="text-sm text-gray-600">All Brands</span>
                    </label>
                    {brands.map(brand => (
                      <label key={brand._id} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="brand" value={brand._id} checked={selectedBrand === brand._id} onChange={() => { setSelectedBrand(brand._id); setCurrentPage(1) }} className="text-primary-600" />
                        <span className="text-sm text-gray-600">{brand.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Max Price: {priceRange[1].toLocaleString()} EGP</h4>
                  <input
                    type="range"
                    min={0}
                    max={50000}
                    step={500}
                    value={priceRange[1]}
                    onChange={e => setPriceRange([0, Number(e.target.value)])}
                    className="w-full accent-primary-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Products grid */}
          <div className="flex-1">
            {loading ? (
              <ProductGridSkeleton count={12} />
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters</p>
                <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-10">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-gray-50"
                    >
                      ← Prev
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + Math.max(1, currentPage - 2)
                      if (page > totalPages) return null
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${
                            page === currentPage ? 'bg-primary-600 text-white' : 'border border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    })}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-gray-50"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
