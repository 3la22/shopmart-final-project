import Link from 'next/link'

export default function PromoSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Shipping */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl p-8 flex items-center gap-5">
            <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12a2 2 0 002 2h8a2 2 0 002-2L19 8m-9 4v4m4-4v4" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Free Shipping</h3>
              <p className="text-sm text-gray-600">On all orders above 500 EGP</p>
            </div>
          </div>

          {/* Big Sale Banner */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-center relative overflow-hidden col-span-1">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-400 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-400 rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>
            <div className="relative z-10">
              <span className="bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Limited Offer
              </span>
              <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-3xl font-bold text-white mt-3 mb-1">Up to 50% OFF</h3>
              <p className="text-gray-400 text-sm mb-5">On selected items this season</p>
              <Link href="/products" className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors">
                Shop the Sale
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Secure Payment */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Secure Payment</h3>
              <p className="text-sm text-gray-600">100% secured transactions</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
