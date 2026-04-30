'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import api from '@/lib/axios'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface CheckoutForm {
  alias: string
  details: string
  phone: string
  city: string
  postalCode: string
}

type PaymentMethod = 'cash' | 'card'

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [loading, setLoading] = useState(false)
  const { cart, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>()

  if (!user) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please login to checkout</h2>
          <Link href="/auth/login" className="btn-primary">Login</Link>
        </div>
      </div>
    )
  }

  if (!cart || cart.products?.length === 0) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <Link href="/products" className="btn-primary">Shop Now</Link>
        </div>
      </div>
    )
  }

  const onSubmit = async (data: CheckoutForm) => {
    setLoading(true)
    try {
      const shippingAddress = {
        alias: data.alias,
        details: data.details,
        phone: data.phone,
        city: data.city,
        postalCode: data.postalCode,
      }

      if (paymentMethod === 'cash') {
        await api.post(`/orders/${cart._id}`, { shippingAddress })
        await clearCart()
        toast.success('Order placed successfully! 🎉')
        router.push('/orders')
      } else {
        const res = await api.post(
          `/orders/checkout-session/${cart._id}?url=http://localhost:3000`,
          { shippingAddress }
        )
        if (res.data.session?.url) {
          window.location.href = res.data.session.url
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Order failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="section-title mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary-100 text-primary-700 rounded-lg flex items-center justify-center text-sm font-bold">1</span>
                Shipping Address
              </h2>
              <form id="checkout-form" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Address Label</label>
                    <input placeholder="Home / Work / Other" className={`input-field ${errors.alias ? 'border-red-300' : ''}`}
                      {...register('alias', { required: 'Label is required' })} />
                    {errors.alias && <p className="text-red-500 text-xs mt-1">{errors.alias.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                    <input placeholder="01234567890" className={`input-field ${errors.phone ? 'border-red-300' : ''}`}
                      {...register('phone', {
                        required: 'Phone is required',
                        pattern: { value: /^01[0125][0-9]{8}$/, message: 'Valid Egyptian number' }
                      })} />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Address Details</label>
                    <input placeholder="Street, Building, Apartment..." className={`input-field ${errors.details ? 'border-red-300' : ''}`}
                      {...register('details', { required: 'Address details required' })} />
                    {errors.details && <p className="text-red-500 text-xs mt-1">{errors.details.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                    <input placeholder="Cairo" className={`input-field ${errors.city ? 'border-red-300' : ''}`}
                      {...register('city', { required: 'City is required' })} />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Postal Code</label>
                    <input placeholder="11511" className={`input-field ${errors.postalCode ? 'border-red-300' : ''}`}
                      {...register('postalCode', { required: 'Postal code required' })} />
                    {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode.message}</p>}
                  </div>
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary-100 text-primary-700 rounded-lg flex items-center justify-center text-sm font-bold">2</span>
                Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Cash */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                    paymentMethod === 'cash'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cash' ? 'border-primary-600' : 'border-gray-300'}`}>
                      {paymentMethod === 'cash' && <div className="w-2.5 h-2.5 bg-primary-600 rounded-full" />}
                    </div>
                    <span className="text-2xl">💵</span>
                    <span className="font-semibold text-gray-900">Cash on Delivery</span>
                  </div>
                  <p className="text-xs text-gray-500 ml-8">Pay when your order arrives at your door</p>
                </button>

                {/* Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                    paymentMethod === 'card'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-primary-600' : 'border-gray-300'}`}>
                      {paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-primary-600 rounded-full" />}
                    </div>
                    <span className="text-2xl">💳</span>
                    <span className="font-semibold text-gray-900">Online Payment</span>
                  </div>
                  <p className="text-xs text-gray-500 ml-8">Secure payment via Stripe</p>
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
                {cart.products.map(item => (
                  <div key={item._id} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex-shrink-0 overflow-hidden relative">
                      <img src={item.product.imageCover} alt={item.product.title} className="w-full h-full object-contain p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-700 line-clamp-1">{item.product.title}</p>
                      <p className="text-xs text-gray-400">Qty: {item.count}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 flex-shrink-0">{(item.price * item.count).toLocaleString()} EGP</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{cart.totalCartPrice?.toLocaleString()} EGP</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-primary-600">{(cart.totalAfterDiscount || cart.totalCartPrice)?.toLocaleString()} EGP</span>
                </div>
              </div>

              <button
                form="checkout-form"
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {paymentMethod === 'cash' ? '🛍️ Place Order' : '💳 Pay Now'}
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secured by SSL encryption
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
