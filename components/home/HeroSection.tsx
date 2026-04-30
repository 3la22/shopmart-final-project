'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const slides = [
  {
    tag: 'New Collection',
    title: 'Discover Premium',
    highlight: 'Products',
    subtitle: 'Shop the latest trends with exclusive deals and unbeatable prices',
    cta: 'Shop Now',
    href: '/products',
    bg: 'from-emerald-50 to-green-100',
    accent: 'bg-primary-600',
  },
  {
    tag: 'Top Brands',
    title: 'Shop Your',
    highlight: 'Favorite Brands',
    subtitle: 'Explore hundreds of trusted brands from around the world',
    cta: 'View Brands',
    href: '/brands',
    bg: 'from-amber-50 to-orange-100',
    accent: 'bg-amber-500',
  },
  {
    tag: 'All Categories',
    title: 'Everything You',
    highlight: 'Need',
    subtitle: 'From electronics to fashion — find it all in one place',
    cta: 'Browse Categories',
    href: '/categories',
    bg: 'from-blue-50 to-indigo-100',
    accent: 'bg-blue-600',
  },
]

export default function HeroSection() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % slides.length), 5000)
    return () => clearInterval(timer)
  }, [])

  const slide = slides[current]

  return (
    <section className={`pt-16 min-h-[90vh] bg-gradient-to-br ${slide.bg} transition-all duration-700 flex items-center`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16">
          {/* Text */}
          <div key={current} className="animate-slide-up">
            <span className={`inline-block ${slide.accent} text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest`}>
              {slide.tag}
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)' }} className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
              {slide.title}{' '}
              <span className="text-primary-600 relative">
                {slide.highlight}
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
                  <path d="M0 6 Q50 0 100 6 Q150 12 200 6" stroke="#16a34a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md leading-relaxed">
              {slide.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={slide.href} className="btn-primary flex items-center gap-2 text-base">
                {slide.cta}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="/auth/register" className="btn-outline flex items-center gap-2 text-base">
                Get Started Free
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12 pt-8 border-t border-gray-200">
              {[
                { value: '10K+', label: 'Products' },
                { value: '500+', label: 'Brands' },
                { value: '50K+', label: 'Customers' },
              ].map(stat => (
                <div key={stat.label}>
                  <p style={{ fontFamily: 'var(--font-display)' }} className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="hidden lg:flex justify-center relative">
            <div className="relative w-80 h-80">
              {/* Decorative circles */}
              <div className="absolute inset-0 rounded-full bg-primary-100 opacity-50 animate-pulse-slow" />
              <div className="absolute inset-8 rounded-full bg-primary-200 opacity-40" />
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 bg-white rounded-3xl shadow-xl flex items-center justify-center rotate-12 hover:rotate-0 transition-transform duration-500">
                  <svg className="w-20 h-20 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
              {/* Floating cards */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg p-3 flex items-center gap-2 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-lg">✓</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">Free Delivery</p>
                  <p className="text-xs text-gray-400">On orders +500 EGP</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-3 flex items-center gap-2 animate-bounce" style={{ animationDuration: '4s' }}>
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-lg">⭐</div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">4.9 Rating</p>
                  <p className="text-xs text-gray-400">50K+ Reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 pb-8">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'bg-primary-600 w-8 h-2' : 'bg-gray-300 w-2 h-2'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
