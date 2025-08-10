'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Copy, Eye } from 'lucide-react'

interface AdCopy {
  id: string
  headline: string
  primaryText: string
  description: string
  callToAction: string
}

export default function GenerateCopyPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [generatedCopies, setGeneratedCopies] = useState<AdCopy[]>([])
  
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    targetAudience: '',
    adObjective: 'CONVERSIONS',
    tone: 'professional',
    variations: 3,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.post('/ai/generate-copy', formData)
      setGeneratedCopies(response.data)
      toast.success(`Generated ${response.data.length} ad copy variations!`)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to generate ad copy')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
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
              <Sparkles className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Generate Ad Copy</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Product Information
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  placeholder="e.g., Wireless Bluetooth Headphones"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Description *
                </label>
                <textarea
                  required
                  rows={4}
                  className="textarea"
                  placeholder="Describe your product's key features, benefits, and what makes it unique..."
                  value={formData.productDescription}
                  onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience *
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  placeholder="e.g., Tech-savvy professionals aged 25-40"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Objective
                  </label>
                  <select
                    className="input"
                    value={formData.adObjective}
                    onChange={(e) => setFormData({ ...formData, adObjective: e.target.value })}
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
                    Tone
                  </label>
                  <select
                    className="input"
                    value={formData.tone}
                    onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="friendly">Friendly</option>
                    <option value="urgent">Urgent</option>
                    <option value="luxury">Luxury</option>
                    <option value="playful">Playful</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Variations
                </label>
                <select
                  className="input"
                  value={formData.variations}
                  onChange={(e) => setFormData({ ...formData, variations: parseInt(e.target.value) })}
                >
                  <option value={1}>1 variation</option>
                  <option value={2}>2 variations</option>
                  <option value={3}>3 variations</option>
                  <option value={5}>5 variations</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading ? 'Generating...' : 'Generate Ad Copy'}
              </button>
            </form>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {generatedCopies.length > 0 && (
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Generated Ad Copies
                </h2>
                
                <div className="space-y-6">
                  {generatedCopies.map((copy, index) => (
                    <div key={copy.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Variation {index + 1}
                        </h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => copyToClipboard(`${copy.headline}\n\n${copy.primaryText}\n\n${copy.description}\n\nCTA: ${copy.callToAction}`)}
                            className="p-2 text-gray-600 hover:text-gray-900"
                            title="Copy all"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                            Headline
                          </label>
                          <p className="text-gray-900 font-medium">{copy.headline}</p>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                            Primary Text
                          </label>
                          <p className="text-gray-900">{copy.primaryText}</p>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                            Description
                          </label>
                          <p className="text-gray-900">{copy.description}</p>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                            Call to Action
                          </label>
                          <p className="text-gray-900 font-medium">{copy.callToAction}</p>
                        </div>
                      </div>

                      {/* Ad Preview */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                          Facebook Ad Preview
                        </label>
                        <div className="ad-preview">
                          <div className="p-4">
                            <div className="flex items-center mb-3">
                              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                              <div className="ml-2">
                                <p className="text-sm font-medium">Your Business</p>
                                <p className="text-xs text-gray-500">Sponsored</p>
                              </div>
                            </div>
                            <p className="text-sm mb-3">{copy.primaryText}</p>
                            <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center mb-3">
                              <Eye className="h-8 w-8 text-gray-400" />
                            </div>
                            <div className="border-t pt-3">
                              <p className="font-medium text-sm">{copy.headline}</p>
                              <p className="text-xs text-gray-600 mb-2">{copy.description}</p>
                              <button className="btn btn-facebook text-sm px-4 py-1">
                                {copy.callToAction}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {generatedCopies.length === 0 && (
              <div className="card text-center py-12">
                <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Ready to generate ad copy?
                </h3>
                <p className="text-gray-600">
                  Fill out the form on the left to generate AI-powered ad copy variations.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}