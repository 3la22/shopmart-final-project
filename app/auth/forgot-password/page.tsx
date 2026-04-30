'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import api from '@/lib/axios'
import toast from 'react-hot-toast'

type Step = 'email' | 'verify' | 'reset'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email')
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const router = useRouter()

  // Step 1: Email
  const emailForm = useForm<{ email: string }>()
  const verifyForm = useForm<{ resetCode: string }>()
  const resetForm = useForm<{ newPassword: string }>()

  const sendCode = async (data: { email: string }) => {
    setLoading(true)
    try {
      await api.post('/auth/forgotPasswords', { email: data.email })
      setEmail(data.email)
      toast.success('Reset code sent to your email')
      setStep('verify')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Email not found')
    } finally {
      setLoading(false)
    }
  }

  const verifyCode = async (data: { resetCode: string }) => {
    setLoading(true)
    try {
      await api.post('/auth/verifyResetCode', { resetCode: data.resetCode })
      toast.success('Code verified!')
      setStep('reset')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid or expired code')
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (data: { newPassword: string }) => {
    setLoading(true)
    try {
      await api.put('/auth/resetPassword', { email, newPassword: data.newPassword })
      toast.success('Password reset successfully!')
      router.push('/auth/login')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  const steps = ['email', 'verify', 'reset']
  const currentStep = steps.indexOf(step)

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
          <h1 style={{ fontFamily: 'var(--font-display)' }} className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-500 text-sm">Follow the steps to recover access</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {['Email', 'Verify', 'Reset'].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${
                i <= currentStep ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {i < currentStep ? '✓' : i + 1}
              </div>
              <span className={`text-xs ${i <= currentStep ? 'text-primary-600 font-medium' : 'text-gray-400'}`}>{label}</span>
              {i < 2 && <div className={`w-8 h-0.5 ${i < currentStep ? 'bg-primary-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-green-100/50 border border-gray-100 p-8">
          {step === 'email' && (
            <form onSubmit={emailForm.handleSubmit(sendCode)} className="space-y-5">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">Enter your email and we&apos;ll send you a reset code</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input-field"
                  {...emailForm.register('email', { required: 'Email is required' })}
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 flex items-center justify-center">
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Send Reset Code'}
              </button>
            </form>
          )}

          {step === 'verify' && (
            <form onSubmit={verifyForm.handleSubmit(verifyCode)} className="space-y-5">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">Enter the 6-digit code sent to <strong>{email}</strong></p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Reset Code</label>
                <input
                  placeholder="123456"
                  className="input-field text-center text-2xl tracking-widest font-mono"
                  maxLength={6}
                  {...verifyForm.register('resetCode', { required: 'Code is required', minLength: { value: 6, message: '6-digit code' } })}
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 flex items-center justify-center">
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Verify Code'}
              </button>
              <button type="button" onClick={() => setStep('email')} className="w-full text-sm text-gray-500 hover:text-gray-700">
                ← Back
              </button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={resetForm.handleSubmit(resetPassword)} className="space-y-5">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">Create your new password</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                <input
                  type="password"
                  placeholder="Min. 6 characters"
                  className="input-field"
                  {...resetForm.register('newPassword', { required: 'Password required', minLength: { value: 6, message: 'Min 6 characters' } })}
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 flex items-center justify-center">
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Reset Password'}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            Remember your password?{' '}
            <Link href="/auth/login" className="text-primary-600 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
