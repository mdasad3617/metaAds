'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { api } from '@/lib/api'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { ArrowLeft, Settings, Facebook, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'

interface MetaConnectionStatus {
  connected: boolean
  user?: {
    id: string
    name: string
  }
  adAccountId?: string
  error?: any
}

interface AdAccount {
  id: string
  name: string
  account_status: number
  currency: string
  timezone_name: string
}

export default function SettingsPage() {
  const { user } = useAuth()
  const [metaStatus, setMetaStatus] = useState<MetaConnectionStatus | null>(null)
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)

  useEffect(() => {
    if (user) {
      checkMetaConnection()
    }
  }, [user])

  const checkMetaConnection = async () => {
    try {
      const response = await api.get('/meta/connection-status')
      setMetaStatus(response.data)
      
      if (response.data.connected) {
        fetchAdAccounts()
      }
    } catch (error) {
      console.error('Error checking Meta connection:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAdAccounts = async () => {
    try {
      const response = await api.get('/meta/ad-accounts')
      setAdAccounts(response.data)
    } catch (error) {
      console.error('Error fetching ad accounts:', error)
      toast.error('Failed to fetch ad accounts')
    }
  }

  const connectToMeta = async () => {
    setConnecting(true)
    try {
      const redirectUri = `${window.location.origin}/dashboard/settings/meta-callback`
      const response = await api.get(`/meta/auth-url?redirect_uri=${encodeURIComponent(redirectUri)}`)
      
      // Open Meta OAuth in a popup
      const popup = window.open(
        response.data.authUrl,
        'meta-auth',
        'width=600,height=600,scrollbars=yes,resizable=yes'
      )

      // Listen for the popup to close or send a message
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed)
          setConnecting(false)
          // Refresh connection status
          checkMetaConnection()
        }
      }, 1000)

      // Listen for messages from the popup
      const messageListener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return
        
        if (event.data.type === 'META_AUTH_SUCCESS') {
          clearInterval(checkClosed)
          popup?.close()
          setConnecting(false)
          toast.success('Successfully connected to Meta!')
          checkMetaConnection()
          window.removeEventListener('message', messageListener)
        } else if (event.data.type === 'META_AUTH_ERROR') {
          clearInterval(checkClosed)
          popup?.close()
          setConnecting(false)
          toast.error('Failed to connect to Meta')
          window.removeEventListener('message', messageListener)
        }
      }

      window.addEventListener('message', messageListener)
    } catch (error) {
      setConnecting(false)
      toast.error('Failed to initiate Meta connection')
    }
  }

  const selectAdAccount = async (adAccountId: string) => {
    try {
      await api.post('/meta/ad-account', { adAccountId })
      toast.success('Ad account selected successfully!')
      checkMetaConnection()
    } catch (error) {
      toast.error('Failed to select ad account')
    }
  }

  const disconnectMeta = async () => {
    if (!confirm('Are you sure you want to disconnect your Meta account?')) return

    try {
      await api.post('/meta/disconnect')
      toast.success('Meta account disconnected')
      setMetaStatus({ connected: false })
      setAdAccounts([])
    } catch (error) {
      toast.error('Failed to disconnect Meta account')
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link href="/dashboard" className="mr-4">
              <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-900" />
            </Link>
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-gray-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Settings</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Meta Integration */}
        <div className="card mb-8">
          <div className="flex items-center mb-6">
            <Facebook className="h-8 w-8 text-blue-600" />
            <h2 className="ml-3 text-2xl font-bold text-gray-900">Meta (Facebook) Integration</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : metaStatus?.connected ? (
            <div className="space-y-6">
              {/* Connection Status */}
              <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div className="ml-3">
                  <p className="text-green-800 font-medium">Connected to Meta</p>
                  <p className="text-green-700 text-sm">
                    Logged in as: {metaStatus.user?.name} (ID: {metaStatus.user?.id})
                  </p>
                </div>
              </div>

              {/* Ad Account Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Ad Account</h3>
                {adAccounts.length > 0 ? (
                  <div className="space-y-3">
                    {adAccounts.map((account) => (
                      <div
                        key={account.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          metaStatus.adAccountId === account.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => selectAdAccount(account.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{account.name}</p>
                            <p className="text-sm text-gray-600">
                              ID: {account.id} • Currency: {account.currency} • Status: {account.account_status === 1 ? 'Active' : 'Inactive'}
                            </p>
                          </div>
                          {metaStatus.adAccountId === account.id && (
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      <p className="ml-2 text-yellow-800">No ad accounts found. Make sure you have access to Facebook ad accounts.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-4">
                <button
                  onClick={disconnectMeta}
                  className="btn btn-secondary"
                >
                  Disconnect Meta Account
                </button>
                <a
                  href="https://business.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary flex items-center"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Manage on Facebook
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Facebook className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Connect Your Meta Account
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Connect your Facebook account to publish campaigns directly to Meta's advertising platform. 
                You'll need access to a Facebook Business account with ad management permissions.
              </p>
              
              <button
                onClick={connectToMeta}
                disabled={connecting}
                className="btn btn-facebook flex items-center mx-auto"
              >
                <Facebook className="h-5 w-5 mr-2" />
                {connecting ? 'Connecting...' : 'Connect to Meta'}
              </button>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-left max-w-2xl mx-auto">
                <h4 className="font-medium text-blue-900 mb-2">📋 Requirements:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Facebook Business account</li>
                  <li>• Access to Facebook ad accounts</li>
                  <li>• Ads management permissions</li>
                  <li>• Valid payment method on your ad account</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Other Settings */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Account Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <p className="text-gray-900">{user.name || 'Not set'}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}