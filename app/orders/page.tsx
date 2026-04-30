'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import api from '@/lib/axios'
import { Order } from '@/types'
import Link from 'next/link'
import Image from 'next/image'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    api.get(`/orders/user/${user._id}`)
      .then(res => setOrders(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user])

  if (!user) return (
    <div className="pt-16 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Please login to view orders</h2>
        <Link href="/auth/login" className="btn-primary">Login</Link>
      </div>
    </div>
  )

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="section-title mb-2">My Orders</h1>
        <p className="text-gray-500 text-sm mb-8">{orders.length} total orders</p>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="skeleton h-5 w-40 rounded mb-4" />
                <div className="skeleton h-16 w-full rounded" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
            <Link href="/products" className="btn-primary inline-block">Shop Now</Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {/* Order Header */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Order ID</p>
                      <p className="text-sm font-mono font-semibold text-gray-800">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div className="w-px h-8 bg-gray-200" />
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Placed on</p>
                      <p className="text-sm font-medium text-gray-800">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="w-px h-8 bg-gray-200" />
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Payment</p>
                      <p className="text-sm font-medium text-gray-800 capitalize">{order.paymentMethodType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`badge ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {order.isPaid ? '✓ Paid' : 'Pending Payment'}
                    </span>
                    <span className={`badge ${order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {order.isDelivered ? '✓ Delivered' : '🚚 In Transit'}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="flex flex-wrap gap-3 mb-5">
                    {order.cartItems.slice(0, 4).map((item, i) => (
                      <div key={i} className="relative w-16 h-16 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                        <img
                          src={item.product.imageCover}
                          alt={item.product.title}
                          className="w-full h-full object-contain p-1"
                        />
                        {item.count > 1 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                            {item.count}
                          </span>
                        )}
                      </div>
                    ))}
                    {order.cartItems.length > 4 && (
                      <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                        <span className="text-xs text-gray-500 font-medium">+{order.cartItems.length - 4}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">{order.cartItems.length} items</p>
                      <p className="text-xl font-bold text-gray-900">{order.totalOrderPrice.toLocaleString()} EGP</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Shipping to</p>
                      <p className="text-sm font-medium text-gray-700">{order.shippingAddress?.city}, Egypt</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
