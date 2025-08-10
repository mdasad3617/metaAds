'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { api } from '@/lib/api'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Target, Calendar, DollarSign, Plus, Settings } from 'lucide-react'

interface Campaign {
  id: string
  name: string
  objective: string
  status: string
  budget?: number
  startDate?: string
  endDate?: string
  createdAt: string
  metaCampaignId?: string
  adSets: AdSet[]
}

interface AdSet {
  id: string
  name: string
  budget?: number
  bidStrategy?: string
  ads: Ad[]
}

interface Ad {
  id: string
  name: string
  status: string
  adCopy?: {
    headline: string
    primaryText: string
    description: string
    callToAction: string
  }
  adCreative?: {
    imageUrl: string
    type: string
  }
}

export default function CampaignDetailsPage() {
  const { user } = useAuth()
  const params = useParams()
  const campaignId = params.id as string
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && campaignId) {
      fetchCampaign()
    }
  }, [user, campaignId])

  const fetchCampaign = async () => {
    try {
      const response = await api.get(`/ads/campaigns/${campaignId}`)
      setCampaign(response.data)
    } catch (error) {
      console.error('Error fetching campaign:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Campaign Not Found</h2>
          <Link href="/dashboard/campaigns" className="btn btn-primary">
            Back to Campaigns
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link href="/dashboard/campaigns" className="mr-4">
                <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-900" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
                <div className="flex items-center mt-1 space-x-4 text-sm text-gray-600">
                  <span className={`px-2 py-1 rounded-full ${
                    campaign.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    campaign.status === 'PAUSED' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {campaign.status}
                  </span>
                  <span>{campaign.objective}</span>
                  {campaign.budget && <span>${campaign.budget}/day</span>}
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="btn btn-secondary flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </button>
              {!campaign.metaCampaignId && (
                <button className="btn btn-facebook">
                  Publish to Meta
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Campaign Overview */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Objective</p>
                <p className="text-lg font-semibold text-gray-900">{campaign.objective}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Daily Budget</p>
                <p className="text-lg font-semibold text-gray-900">
                  {campaign.budget ? `$${campaign.budget}` : 'Not set'}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Created</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(campaign.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ad Sets */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Ad Sets</h2>
            <button className="btn btn-primary flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Create Ad Set
            </button>
          </div>

          {campaign.adSets.length > 0 ? (
            <div className="space-y-4">
              {campaign.adSets.map((adSet) => (
                <div key={adSet.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{adSet.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      {adSet.budget && <span>${adSet.budget}/day</span>}
                      <span>{adSet.ads.length} ads</span>
                    </div>
                  </div>

                  {/* Ads in this Ad Set */}
                  {adSet.ads.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {adSet.ads.map((ad) => (
                        <div key={ad.id} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{ad.name}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              ad.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {ad.status}
                            </span>
                          </div>
                          
                          {ad.adCopy && (
                            <div className="text-sm text-gray-600">
                              <p className="font-medium">{ad.adCopy.headline}</p>
                              <p className="truncate">{ad.adCopy.primaryText}</p>
                            </div>
                          )}
                          
                          {ad.adCreative && (
                            <div className="mt-2">
                              <img
                                src={ad.adCreative.imageUrl}
                                alt="Ad creative"
                                className="w-full h-24 object-cover rounded"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No ads in this ad set yet</p>
                      <button className="btn btn-secondary mt-2">
                        Create First Ad
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No ad sets yet
              </h3>
              <p className="text-gray-600 mb-4">
                Create ad sets to organize your ads and define targeting options.
              </p>
              <button className="btn btn-primary">
                Create Your First Ad Set
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}