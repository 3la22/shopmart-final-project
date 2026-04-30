'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import api from '@/lib/axios'
import { Brand } from '@/types'

export default function BrandsSection() {
  const [brands, setBrands] = useState<Brand[]>([])

  useEffect(() => {
    api.get('/brands?limit=12')
      .then(res => setBrands(res.data.data))
      .catch(console.error)
  }, [])

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-primary-600 font-medium text-sm uppercase tracking-widest mb-2">Partners</p>
          <h2 className="section-title">Top Brands</h2>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {brands.map(brand => (
            <Link
              key={brand._id}
              href={`/brands/${brand._id}`}
              className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-center h-20 hover:border-primary-200 hover:shadow-md transition-all duration-300 group"
            >
              <Image
                src={brand.image}
                alt={brand.name}
                width={80}
                height={40}
                className="object-contain max-h-12 grayscale group-hover:grayscale-0 transition-all duration-300"
              />
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/brands" className="btn-outline inline-flex items-center gap-2">
            View All Brands
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
