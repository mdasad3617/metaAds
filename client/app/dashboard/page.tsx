'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, Plus, FileText, Image, Target, BarChart3 } from 'lucide-react'

export default function DashboardPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Sparkles className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Meta Ads AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name || user.email}</span>
              <Link href="/dashboard/settings" className="btn btn-secondary">
                Settings
              </Link>
              <button
                onClick={logout}
                className="btn btn-secondary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Create AI-powered Meta ads that convert. Start by generating copy or creatives.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/dashboard/generate-copy" className="card hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Generate Copy</h3>
                <p className="text-sm text-gray-600">AI-powered ad copy</p>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/generate-creative" className="card hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Image className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Generate Creative</h3>
                <p className="text-sm text-gray-600">AI-generated images</p>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/campaigns" className="card hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Campaigns</h3>
                <p className="text-sm text-gray-600">Manage ad campaigns</p>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/analytics" className="card hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
                <p className="text-sm text-gray-600">Performance insights</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Ad Copies</h2>
              <Link href="/dashboard/generate-copy" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">No ad copies generated yet</p>
                <Link href="/dashboard/generate-copy" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Generate your first copy →
                </Link>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Creatives</h2>
              <Link href="/dashboard/generate-creative" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">No creatives generated yet</p>
                <Link href="/dashboard/generate-creative" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Generate your first creative →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="mt-8 card bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
          <div className="flex items-start">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Plus className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ready to create your first AI-powered ad?
              </h3>
              <p className="text-gray-600 mb-4">
                Start by generating compelling ad copy or eye-catching creatives using our AI tools.
              </p>
              <div className="flex space-x-4">
                <Link href="/dashboard/generate-copy" className="btn btn-primary">
                  Generate Copy
                </Link>
                <Link href="/dashboard/generate-creative" className="btn btn-secondary">
                  Generate Creative
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}