'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

interface RegisterForm {
  name: string
  email: string
  phone: string
  password: string
  rePassword: string
}

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const { register: authRegister } = useAuth()
  const router = useRouter()
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>()
  const password = watch('password')

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true)
    try {
      await authRegister(data)
      toast.success('Account created successfully! 🎉')
      router.push('/')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span style={{ fontFamily: 'var(--font-display)' }} className="text-2xl font-bold text-gray-900">
              Shop<span className="text-primary-600">Mart</span>
            </span>
          </Link>
          <h1 style={{ fontFamily: 'var(--font-display)' }} className="text-3xl font-bold text-gray-900 mb-2">Create account</h1>
          <p className="text-gray-500 text-sm">Join thousands of happy shoppers</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-green-100/50 border border-gray-100 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input
                placeholder="Ahmed Mohamed"
                className={`input-field ${errors.name ? 'border-red-300' : ''}`}
                {...register('name', {
                  required: 'Name is required',
                  minLength: { value: 3, message: 'Minimum 3 characters' },
                  maxLength: { value: 40, message: 'Maximum 40 characters' }
                })}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className={`input-field ${errors.email ? 'border-red-300' : ''}`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' }
                })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
              <input
                placeholder="01234567890"
                className={`input-field ${errors.phone ? 'border-red-300' : ''}`}
                {...register('phone', {
                  required: 'Phone is required',
                  pattern: { value: /^01[0125][0-9]{8}$/, message: 'Enter a valid Egyptian number' }
                })}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  className={`input-field pr-12 ${errors.password ? 'border-red-300' : ''}`}
                  {...register('password', {
                    required: 'Password required',
                    minLength: { value: 6, message: 'Min 6 characters' },
                    pattern: { value: /^(?=.*[A-Za-z])(?=.*\d)/, message: 'Must include letters and numbers' }
                  })}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-3 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Repeat your password"
                className={`input-field ${errors.rePassword ? 'border-red-300' : ''}`}
                {...register('rePassword', {
                  required: 'Please confirm password',
                  validate: val => val === password || 'Passwords do not match'
                })}
              />
              {errors.rePassword && <p className="text-red-500 text-xs mt-1">{errors.rePassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary-600 font-medium hover:text-primary-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
