'use client'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import Link from 'next/link'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart()

  if (!cart || cart.products?.length === 0) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-20">
          <div className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-14 h-14 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Add some products to get started</p>
          <Link href="/products" className="btn-primary inline-flex items-center gap-2">
            Start Shopping
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="section-title">Shopping Cart
            <span className="text-base font-normal text-gray-500 ml-3">({cart.numOfCartItems} items)</span>
          </h1>
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1 font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.products.map(item => (
              <div key={item._id} className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-4">
                <Link href={`/products/${item.product._id}`} className="flex-shrink-0">
                  <div className="relative w-24 h-24 bg-gray-50 rounded-xl overflow-hidden">
                    <Image
                      src={item.product.imageCover}
                      alt={item.product.title}
                      fill
                      sizes="96px"
                      className="object-contain p-2"
                    />
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-primary-600 font-medium mb-1">{item.product.category?.name}</p>
                      <Link href={`/products/${item.product._id}`}>
                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-primary-600 transition-colors">
                          {item.product.title}
                        </h3>
                      </Link>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => item.count > 1 ? updateQuantity(item.product._id, item.count - 1) : removeFromCart(item.product._id)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                      >−</button>
                      <span className="w-8 text-center text-sm font-semibold">{item.count}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.count + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                      >+</button>
                    </div>
                    <p className="font-bold text-gray-900">{(item.price * item.count).toLocaleString()} EGP</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal ({cart.numOfCartItems} items)</span>
                  <span className="font-medium">{cart.totalCartPrice?.toLocaleString()} EGP</span>
                </div>
                {cart.totalAfterDiscount && cart.totalAfterDiscount < cart.totalCartPrice && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount</span>
                    <span className="text-green-600 font-medium">-{(cart.totalCartPrice - cart.totalAfterDiscount).toLocaleString()} EGP</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary-600">{(cart.totalAfterDiscount || cart.totalCartPrice)?.toLocaleString()} EGP</span>
                </div>
              </div>

              {/* Coupon */}
              <div className="flex gap-2 mb-5">
                <input
                  type="text"
                  placeholder="Coupon code"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
                <button className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
                  Apply
                </button>
              </div>

              <Link
                href="/checkout"
                className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base"
              >
                Proceed to Checkout
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              <Link href="/products" className="block text-center text-sm text-gray-500 mt-4 hover:text-primary-600">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
