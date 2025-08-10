'use client'

import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'
import { ArrowLeft, BarChart3, TrendingUp, Eye, MousePointer, DollarSign, Users } from 'lucide-react'

export default function AnalyticsPage() {
  const { user } = useAuth()

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
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Analytics</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Impressions</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MousePointer className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Clicks</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">CTR</p>
                <p className="text-2xl font-bold text-gray-900">--%</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Spend</p>
                <p className="text-2xl font-bold text-gray-900">$--</p>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Coming Soon */}
        <div className="card text-center py-16">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Analytics Dashboard Coming Soon
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Once you start running campaigns and have Meta API integration set up, 
            you'll see detailed performance metrics, insights, and optimization recommendations here.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                📊 Performance Metrics
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Real-time campaign performance</li>
                <li>• Impressions, clicks, and conversions</li>
                <li>• Cost per acquisition (CPA)</li>
                <li>• Return on ad spend (ROAS)</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                🎯 AI Insights
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Automated optimization suggestions</li>
                <li>• Audience performance analysis</li>
                <li>• Creative performance comparison</li>
                <li>• Budget allocation recommendations</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard/campaigns" className="btn btn-primary">
              Create Your First Campaign
            </Link>
            <Link href="/dashboard/generate-copy" className="btn btn-secondary">
              Generate Ad Copy
            </Link>
          </div>

          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto">
            <h4 className="font-medium text-yellow-900 mb-2">🔧 To Enable Full Analytics:</h4>
            <ol className="text-sm text-yellow-800 space-y-1 text-left">
              <li>1. Set up Meta Developer App and get API credentials</li>
              <li>2. Connect your Facebook Ad Account</li>
              <li>3. Publish campaigns through the platform</li>
              <li>4. Analytics will automatically populate with real data</li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  )
}