'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { api } from '@/lib/api'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { ArrowLeft, Plus, Target, Calendar, DollarSign, BarChart3 } from 'lucide-react'

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
  adSets: any[]
}

export default function CampaignsPage() {
  const { user } = useAuth()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    objective: 'CONVERSIONS',
    budget: '',
  })

  useEffect(() => {
    if (user) {
      fetchCampaigns()
    }
  }, [user])

  const fetchCampaigns = async () => {
    try {
      const response = await api.get('/ads/campaigns')
      setCampaigns(response.data)
    } catch (error) {
      console.error('Error fetching campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  const createCampaign = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/ads/campaigns', {
        name: newCampaign.name,
        objective: newCampaign.objective,
        budget: newCampaign.budget ? parseFloat(newCampaign.budget) : undefined,
      })
      setShowCreateForm(false)
      setNewCampaign({ name: '', objective: 'CONVERSIONS', budget: '' })
      fetchCampaigns()
    } catch (error) {
      console.error('Error creating campaign:', error)
    }
  }

  const publishCampaign = async (campaignId: string) => {
    try {
      await api.post(`/ads/campaigns/${campaignId}/publish`)
      toast.success('Campaign published to Meta successfully!')
      fetchCampaigns()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to publish campaign')
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link href="/dashboard" className="mr-4">
                <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-900" />
              </Link>
              <div className="flex items-center">
                <Target className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Campaigns</span>
              </div>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Campaign Form */}
        {showCreateForm && (
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Campaign</h2>
            <form onSubmit={createCampaign} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Name
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  placeholder="e.g., Holiday Sale 2024"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Objective
                  </label>
                  <select
                    className="input"
                    value={newCampaign.objective}
                    onChange={(e) => setNewCampaign({ ...newCampaign, objective: e.target.value })}
                  >
                    <option value="CONVERSIONS">Conversions</option>
                    <option value="TRAFFIC">Traffic</option>
                    <option value="AWARENESS">Brand Awareness</option>
                    <option value="ENGAGEMENT">Engagement</option>
                    <option value="LEAD_GENERATION">Lead Generation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Daily Budget (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="input"
                    placeholder="50.00"
                    value={newCampaign.budget}
                    onChange={(e) => setNewCampaign({ ...newCampaign, budget: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="btn btn-primary">
                  Create Campaign
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Campaigns List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : campaigns.length > 0 ? (
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="card">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                      <span className={`ml-3 px-2 py-1 text-xs rounded-full ${
                        campaign.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        campaign.status === 'PAUSED' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {campaign.status}
                      </span>
                      {campaign.metaCampaignId && (
                        <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          Published to Meta
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Target className="h-4 w-4 mr-1" />
                        {campaign.objective}
                      </div>
                      {campaign.budget && (
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          ${campaign.budget}/day
                        </div>
                      )}
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Created {new Date(campaign.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <BarChart3 className="h-4 w-4 mr-1" />
                        {campaign.adSets.length} ad sets
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/dashboard/campaigns/${campaign.id}`}
                      className="btn btn-secondary text-sm"
                    >
                      View Details
                    </Link>
                    {!campaign.metaCampaignId ? (
                      <button 
                        onClick={() => publishCampaign(campaign.id)}
                        className="btn btn-facebook text-sm"
                      >
                        Publish to Meta
                      </button>
                    ) : (
                      <button className="btn btn-secondary text-sm" disabled>
                        Published
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No campaigns yet
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first ad campaign to get started with Meta advertising.
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn btn-primary"
            >
              Create Your First Campaign
            </button>
          </div>
        )}
      </main>
    </div>
  )
}