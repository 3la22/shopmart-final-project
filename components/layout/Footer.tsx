import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span style={{ fontFamily: 'var(--font-display)' }} className="text-xl font-bold text-white">
                Shop<span className="text-primary-400">Mart</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your premium destination for quality products at unbeatable prices.
            </p>
            <div className="flex gap-3 mt-6">
              {['facebook', 'twitter', 'instagram', 'youtube'].map(social => (
                <a key={social} href="#" className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                  <span className="text-xs uppercase text-gray-400">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Shop</h3>
            <ul className="space-y-2">
              {[
                { href: '/products', label: 'All Products' },
                { href: '/brands', label: 'Brands' },
                { href: '/categories', label: 'Categories' },
                { href: '/wishlist', label: 'Wishlist' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Account</h3>
            <ul className="space-y-2">
              {[
                { href: '/auth/login', label: 'Login' },
                { href: '/auth/register', label: 'Register' },
                { href: '/orders', label: 'My Orders' },
                { href: '/cart', label: 'Cart' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Newsletter</h3>
            <p className="text-sm text-gray-400 mb-4">Get the latest deals and updates.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
              />
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">© 2024 ShopMart. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-300">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
