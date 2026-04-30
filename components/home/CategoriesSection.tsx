'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import api from '@/lib/axios'
import { Category } from '@/types'

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/categories?limit=8')
      .then(res => setCategories(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-primary-600 font-medium text-sm uppercase tracking-widest mb-2">Explore</p>
            <h2 className="section-title">Shop by Category</h2>
          </div>
          <Link href="/categories" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="skeleton w-20 h-20 rounded-2xl" />
                <div className="skeleton h-3 w-16 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((cat, i) => (
              <Link
                key={cat._id}
                href={`/categories/${cat._id}`}
                className="group flex flex-col items-center gap-3 p-3 rounded-2xl hover:bg-primary-50 transition-all duration-300"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 border-2 border-gray-100 group-hover:border-primary-200 transition-colors">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="80px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <span className="text-xs font-medium text-gray-700 text-center group-hover:text-primary-600 transition-colors line-clamp-1">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
