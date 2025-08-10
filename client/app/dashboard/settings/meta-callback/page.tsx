'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { api } from '@/lib/api'
import { CheckCircle, XCircle, Loader } from 'lucide-react'

export default function MetaCallbackPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      const error = searchParams.get('error')
      const errorDescription = searchParams.get('error_description')

      if (error) {
        setStatus('error')
        setMessage(errorDescription || 'Authorization was denied or cancelled')
        
        // Notify parent window
        if (window.opener) {
          window.opener.postMessage({
            type: 'META_AUTH_ERROR',
            error: errorDescription || error
          }, window.location.origin)
        }
        return
      }

      if (!code) {
        setStatus('error')
        setMessage('No authorization code received')
        
        if (window.opener) {
          window.opener.postMessage({
            type: 'META_AUTH_ERROR',
            error: 'No authorization code'
          }, window.location.origin)
        }
        return
      }

      try {
        const redirectUri = window.location.origin + window.location.pathname
        
        await api.post('/meta/connect', {
          code,
          redirectUri
        })

        setStatus('success')
        setMessage('Successfully connected to Meta!')

        // Notify parent window
        if (window.opener) {
          window.opener.postMessage({
            type: 'META_AUTH_SUCCESS'
          }, window.location.origin)
        }

        // Close popup after a short delay
        setTimeout(() => {
          window.close()
        }, 2000)

      } catch (error: any) {
        setStatus('error')
        setMessage(error.response?.data?.message || 'Failed to connect to Meta')
        
        if (window.opener) {
          window.opener.postMessage({
            type: 'META_AUTH_ERROR',
            error: error.response?.data?.message || 'Connection failed'
          }, window.location.origin)
        }
      }
    }

    handleCallback()
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <Loader className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Connecting to Meta...
            </h2>
            <p className="text-gray-600">
              Please wait while we complete the connection process.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Connection Successful!
            </h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">
              This window will close automatically...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Connection Failed
            </h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => window.close()}
              className="btn btn-secondary"
            >
              Close Window
            </button>
          </>
        )}
      </div>
    </div>
  )
}