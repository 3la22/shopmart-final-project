export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-100 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-primary-600 rounded-full border-t-transparent animate-spin" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary-600 rounded-md flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-display)' }} className="text-lg font-bold text-gray-900">
            Shop<span className="text-primary-600">Mart</span>
          </span>
        </div>
      </div>
    </div>
  )
}
