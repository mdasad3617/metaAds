'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Sparkles, Download, Eye } from 'lucide-react'

interface AdCreative {
  id: string
  type: string
  imageUrl: string
  prompt: string
  style: string
}

export default function GenerateCreativePage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [generatedCreative, setGeneratedCreative] = useState<AdCreative | null>(null)
  
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    style: 'modern',
    aspectRatio: '1:1',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.post('/ai/generate-image', formData)
      setGeneratedCreative(response.data)
      toast.success('Creative generated successfully!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to generate creative')
    } finally {
      setLoading(false)
    }
  }

  const downloadImage = (imageUrl: string, filename: string) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
              <span className="ml-2 text-xl font-bold text-gray-900">Generate Creative</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Creative Requirements
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
                  placeholder="Describe your product's appearance, key features, and desired visual style..."
                  value={formData.productDescription}
                  onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visual Style
                  </label>
                  <select
                    className="input"
                    value={formData.style}
                    onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                  >
                    <option value="modern">Modern</option>
                    <option value="minimalist">Minimalist</option>
                    <option value="luxury">Luxury</option>
                    <option value="vibrant">Vibrant</option>
                    <option value="professional">Professional</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="product-focused">Product Focused</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aspect Ratio
                  </label>
                  <select
                    className="input"
                    value={formData.aspectRatio}
                    onChange={(e) => setFormData({ ...formData, aspectRatio: e.target.value })}
                  >
                    <option value="1:1">Square (1:1)</option>
                    <option value="16:9">Landscape (16:9)</option>
                    <option value="9:16">Portrait (9:16)</option>
                    <option value="4:5">Instagram (4:5)</option>
                  </select>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">💡 Tips for better results:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Be specific about colors, lighting, and composition</li>
                  <li>• Mention the target audience or use case</li>
                  <li>• Include details about the product's key features</li>
                  <li>• Specify the mood or emotion you want to convey</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading ? 'Generating Creative...' : 'Generate Creative'}
              </button>
            </form>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {generatedCreative && (
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Generated Creative
                  </h2>
                  <button
                    onClick={() => downloadImage(generatedCreative.imageUrl, `${formData.productName}-creative.png`)}
                    className="btn btn-secondary flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="relative">
                    <Image
                      src={generatedCreative.imageUrl}
                      alt={`Generated creative for ${formData.productName}`}
                      width={500}
                      height={500}
                      className="w-full rounded-lg shadow-lg"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Style
                      </label>
                      <p className="text-gray-900 capitalize">{generatedCreative.style}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Type
                      </label>
                      <p className="text-gray-900">{generatedCreative.type}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Generation Prompt
                    </label>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {generatedCreative.prompt}
                    </p>
                  </div>

                  {/* Ad Preview */}
                  <div className="pt-4 border-t border-gray-200">
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
                        <p className="text-sm mb-3">Check out our amazing {formData.productName}!</p>
                        <div className="relative mb-3">
                          <Image
                            src={generatedCreative.imageUrl}
                            alt="Ad preview"
                            width={300}
                            height={300}
                            className="w-full rounded-lg"
                          />
                        </div>
                        <div className="border-t pt-3">
                          <p className="font-medium text-sm">{formData.productName}</p>
                          <p className="text-xs text-gray-600 mb-2">Premium quality guaranteed</p>
                          <button className="btn btn-facebook text-sm px-4 py-1">
                            Shop Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!generatedCreative && (
              <div className="card text-center py-12">
                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Ready to generate a creative?
                </h3>
                <p className="text-gray-600 mb-4">
                  Fill out the form on the left to generate an AI-powered ad creative.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                  <h4 className="font-medium text-blue-900 mb-2">💡 Image Generation Setup:</h4>
                  <p className="text-sm text-blue-800 mb-2">
                    To enable AI image generation, you need a Stability AI API key:
                  </p>
                  <ol className="text-sm text-blue-800 space-y-1 ml-4">
                    <li>1. Get an API key from <a href="https://platform.stability.ai/" target="_blank" className="underline">platform.stability.ai</a></li>
                    <li>2. Add STABILITY_API_KEY to your server/.env file</li>
                    <li>3. Restart the server</li>
                  </ol>
                  <p className="text-sm text-blue-800 mt-2">
                    <strong>For now:</strong> Try the <a href="/dashboard/generate-copy" className="underline font-medium">Ad Copy Generator</a> which works with your current Gemini setup!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}