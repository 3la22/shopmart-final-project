'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useForm } from 'react-hook-form'
import api from '@/lib/axios'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Address } from '@/types'

type Tab = 'profile' | 'password' | 'addresses'

interface PasswordForm {
  currentPassword: string
  password: string
  rePassword: string
}

interface AddressForm {
  alias: string
  details: string
  phone: string
  city: string
  postalCode: string
}

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const [tab, setTab] = useState<Tab>('profile')
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loadingAddr, setLoadingAddr] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [loadingPw, setLoadingPw] = useState(false)

  const pwForm = useForm<PasswordForm>()
  const addrForm = useForm<AddressForm>()

  useEffect(() => {
    if (tab === 'addresses') fetchAddresses()
  }, [tab])

  const fetchAddresses = async () => {
    setLoadingAddr(true)
    try {
      const res = await api.get('/addresses')
      setAddresses(res.data.data || [])
    } catch { }
    finally { setLoadingAddr(false) }
  }

  const changePassword = async (data: PasswordForm) => {
    setLoadingPw(true)
    try {
      await api.put('/users/changeMyPassword', data)
      toast.success('Password changed successfully!')
      pwForm.reset()
      logout()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setLoadingPw(false)
    }
  }

  const addAddress = async (data: AddressForm) => {
    try {
      await api.post('/addresses', data)
      toast.success('Address added!')
      addrForm.reset()
      setShowAddressForm(false)
      fetchAddresses()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add address')
    }
  }

  const removeAddress = async (addrId: string) => {
    try {
      await api.delete(`/addresses/${addrId}`)
      toast.success('Address removed')
      fetchAddresses()
    } catch {
      toast.error('Failed to remove address')
    }
  }

  if (!user) return (
    <div className="pt-16 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Please login first</h2>
        <Link href="/auth/login" className="btn-primary">Login</Link>
      </div>
    </div>
  )

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 flex items-center gap-5">
          <div className="w-16 h-16 bg-primary-100 text-primary-700 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <p className="text-gray-400 text-xs mt-0.5">{user.phone}</p>
          </div>
          <div className="ml-auto">
            <Link href="/orders" className="btn-outline text-sm py-2 px-4">My Orders</Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-white rounded-t-2xl px-2">
          {(['profile', 'password', 'addresses'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-4 text-sm font-medium capitalize transition-all border-b-2 -mb-px ${
                tab === t ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t === 'profile' ? '👤 Profile' : t === 'password' ? '🔐 Password' : '📍 Addresses'}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-b-2xl border border-gray-100 border-t-0 p-8">
          {/* Profile Tab */}
          {tab === 'profile' && (
            <div className="max-w-md space-y-4">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Account Information</h2>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                <div className="input-field bg-gray-50 text-gray-700">{user.name}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                <div className="input-field bg-gray-50 text-gray-700">{user.email}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                <div className="input-field bg-gray-50 text-gray-700">{user.phone}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                <div className="input-field bg-gray-50 text-gray-700 capitalize">{user.role}</div>
              </div>
            </div>
          )}

          {/* Password Tab */}
          {tab === 'password' && (
            <form onSubmit={pwForm.handleSubmit(changePassword)} className="max-w-md space-y-4">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Change Password</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                <input
                  type="password"
                  placeholder="Your current password"
                  className={`input-field ${pwForm.formState.errors.currentPassword ? 'border-red-300' : ''}`}
                  {...pwForm.register('currentPassword', { required: 'Required' })}
                />
                {pwForm.formState.errors.currentPassword && <p className="text-red-500 text-xs mt-1">{pwForm.formState.errors.currentPassword.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                <input
                  type="password"
                  placeholder="Min. 6 characters"
                  className={`input-field ${pwForm.formState.errors.password ? 'border-red-300' : ''}`}
                  {...pwForm.register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 characters' } })}
                />
                {pwForm.formState.errors.password && <p className="text-red-500 text-xs mt-1">{pwForm.formState.errors.password.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Repeat new password"
                  className={`input-field ${pwForm.formState.errors.rePassword ? 'border-red-300' : ''}`}
                  {...pwForm.register('rePassword', {
                    required: 'Required',
                    validate: val => val === pwForm.watch('password') || 'Passwords do not match'
                  })}
                />
                {pwForm.formState.errors.rePassword && <p className="text-red-500 text-xs mt-1">{pwForm.formState.errors.rePassword.message}</p>}
              </div>
              <button type="submit" disabled={loadingPw} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                {loadingPw ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Update Password'}
              </button>
            </form>
          )}

          {/* Addresses Tab */}
          {tab === 'addresses' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Saved Addresses</h2>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Address
                </button>
              </div>

              {/* Add Address Form */}
              {showAddressForm && (
                <form onSubmit={addrForm.handleSubmit(addAddress)} className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">New Address</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Label (Alias)</label>
                      <input placeholder="Home / Work" className="input-field" {...addrForm.register('alias', { required: true })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                      <input placeholder="01234567890" className="input-field" {...addrForm.register('phone', { required: true })} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Details</label>
                      <input placeholder="Street, Building, Apt..." className="input-field" {...addrForm.register('details', { required: true })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                      <input placeholder="Cairo" className="input-field" {...addrForm.register('city', { required: true })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Postal Code</label>
                      <input placeholder="11511" className="input-field" {...addrForm.register('postalCode', { required: true })} />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button type="submit" className="btn-primary text-sm py-2 px-5">Save Address</button>
                    <button type="button" onClick={() => setShowAddressForm(false)} className="text-sm text-gray-500 hover:text-gray-700 px-4">Cancel</button>
                  </div>
                </form>
              )}

              {/* Address List */}
              {loadingAddr ? (
                <div className="space-y-3">
                  {[1,2].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl">
                  <div className="text-4xl mb-3">📍</div>
                  <p className="text-gray-500">No addresses saved yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map(addr => (
                    <div key={addr._id} className="flex items-start justify-between p-5 bg-gray-50 rounded-2xl border border-gray-200">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                          {addr.alias === 'Home' ? '🏠' : addr.alias === 'Work' ? '🏢' : '📍'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{addr.alias}</p>
                          <p className="text-sm text-gray-600">{addr.details}</p>
                          <p className="text-sm text-gray-500">{addr.city}, {addr.postalCode}</p>
                          <p className="text-sm text-gray-500">{addr.phone}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeAddress(addr._id!)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
