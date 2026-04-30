'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import api from '@/lib/axios'
import { Brand } from '@/types'

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/brands?limit=100')
      .then(res => setBrands(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = brands.filter(b => b.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="section-title mb-2">All Brands</h1>
          <p className="text-gray-500 text-sm mb-6">Explore products from top brands worldwide</p>
          <div className="relative max-w-sm">
            <input
              type="text"
              placeholder="Search brands..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-10"
            />
            <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array(12).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center gap-3">
                <div className="skeleton w-20 h-14 rounded-lg" />
                <div className="skeleton h-3 w-16 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No brands found for "{search}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filtered.map(brand => (
              <Link
                key={brand._id}
                href={`/brands/${brand._id}`}
                className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center gap-3 hover:border-primary-200 hover:shadow-md transition-all duration-300 group"
              >
                <div className="relative w-24 h-16 flex items-center justify-center">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    sizes="96px"
                    className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <span className="text-xs font-medium text-gray-600 group-hover:text-primary-600 transition-colors text-center line-clamp-1">
                  {brand.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
