import { useState } from 'react'

export default function CreateEvent() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    ticketTiers: [{ name: '', price: '', quantity: '', perks: '' }],
    artwork: null as File | null,
    artworkPrompt: '',
  })

  const steps = [
    { id: 1, title: 'Basic Info', icon: 'fa-info-circle' },
    { id: 2, title: 'Ticket Tiers', icon: 'fa-ticket' },
    { id: 3, title: 'Artwork', icon: 'fa-palette' },
    { id: 4, title: 'Review', icon: 'fa-check-circle' },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleTicketTierChange = (index: number, field: string, value: string) => {
    const newTiers = [...formData.ticketTiers]
    newTiers[index] = { ...newTiers[index], [field]: value }
    setFormData(prev => ({ ...prev, ticketTiers: newTiers }))
  }

  const addTicketTier = () => {
    setFormData(prev => ({
      ...prev,
      ticketTiers: [...prev.ticketTiers, { name: '', price: '', quantity: '', perks: '' }]
    }))
  }

  const removeTicketTier = (index: number) => {
    if (formData.ticketTiers.length > 1) {
      setFormData(prev => ({
        ...prev,
        ticketTiers: prev.ticketTiers.filter((_, i) => i !== index)
      }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, artwork: e.target.files![0] }))
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = () => {
    console.log('Form submitted:', formData)
    alert('Event created successfully!')
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    currentStep >= step.id
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  <i className={`fas ${step.icon}`}></i>
                </div>
                <span className={`text-sm mt-2 ${currentStep >= step.id ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-4 ${currentStep > step.id ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 shadow-sm p-8">
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-slate-100 mb-6">Basic Information</h2>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Event Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-100 placeholder-slate-500"
                placeholder="Enter event title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                placeholder="Describe your event"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-100 placeholder-slate-500"
                placeholder="Event venue or address"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-100 placeholder-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-100 placeholder-slate-500"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-slate-100 mb-6">Ticket Tiers</h2>
            {formData.ticketTiers.map((tier, index) => (
              <div key={index} className="p-6 bg-slate-900/50 rounded-lg border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-slate-100">Tier {index + 1}</h3>
                  {formData.ticketTiers.length > 1 && (
                    <button
                      onClick={() => removeTicketTier(index)}
                      className="cursor-pointer text-red-400 hover:text-red-300 text-sm"
                    >
                      <i className="fas fa-trash mr-1"></i>Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                    <input
                      type="text"
                      value={tier.name}
                      onChange={(e) => handleTicketTierChange(index, 'name', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-100 placeholder-slate-500"
                      placeholder="e.g., VIP, Standard"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Price (XAF)</label>
                    <input
                      type="number"
                      value={tier.price}
                      onChange={(e) => handleTicketTierChange(index, 'price', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-100 placeholder-slate-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Quantity</label>
                    <input
                      type="number"
                      value={tier.quantity}
                      onChange={(e) => handleTicketTierChange(index, 'quantity', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-100 placeholder-slate-500"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Perks</label>
                  <textarea
                    value={tier.perks}
                    onChange={(e) => handleTicketTierChange(index, 'perks', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                    placeholder="List perks included in this tier"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addTicketTier}
              className="cursor-pointer w-full px-4 py-3 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors font-medium"
            >
              <i className="fas fa-plus mr-2"></i>Add Another Tier
            </button>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-slate-100 mb-6">Event Artwork</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Upload Artwork</label>
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    id="artwork-upload"
                  />
                  <label htmlFor="artwork-upload" className="cursor-pointer">
                    <i className="fas fa-cloud-upload-alt text-4xl text-slate-500 mb-4"></i>
                    <p className="text-slate-400 mb-2">Click to upload or drag and drop</p>
                    <p className="text-sm text-slate-500">PNG, JPG up to 5MB</p>
                  </label>
                  {formData.artwork && (
                    <p className="mt-4 text-sm text-emerald-400">
                      <i className="fas fa-check-circle mr-1"></i>{formData.artwork.name}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Or Generate with AI</label>
                <textarea
                  name="artworkPrompt"
                  value={formData.artworkPrompt}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                  placeholder="Describe the artwork you want to generate..."
                />
                <button className="cursor-pointer mt-4 w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all font-medium">
                  <i className="fas fa-magic mr-2"></i>Generate Artwork
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-slate-100 mb-6">Review & Submit</h2>
            <div className="space-y-4">
              <div className="p-4 bg-slate-900/50 rounded-lg">
                <h3 className="font-medium text-slate-100 mb-2">Event Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Title:</span>
                    <p className="text-slate-100">{formData.title || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Date:</span>
                    <p className="text-slate-800">{formData.date || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Location:</span>
                    <p className="text-slate-800">{formData.location || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Time:</span>
                    <p className="text-slate-800">{formData.time || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-lg">
                <h3 className="font-medium text-slate-100 mb-2">Ticket Tiers</h3>
                {formData.ticketTiers.map((tier, index) => (
                  <div key={index} className="flex justify-between text-sm py-2 border-b border-slate-700 last:border-0">
                    <span className="text-slate-400">{tier.name || `Tier ${index + 1}`}</span>
                    <span className="text-slate-100">XAF {tier.price || '0'} × {tier.quantity || '0'}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-slate-900/50 rounded-lg">
                <h3 className="font-medium text-slate-100 mb-2">Artwork</h3>
                <p className="text-sm text-slate-400">
                  {formData.artwork ? formData.artwork.name : formData.artworkPrompt ? 'AI generation requested' : 'Not provided'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-slate-700">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`cursor-pointer px-6 py-3 rounded-lg font-medium transition-all ${
              currentStep === 1
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <i className="fas fa-arrow-left mr-2"></i>Previous
          </button>
          {currentStep === steps.length ? (
            <button
              onClick={handleSubmit}
              className="cursor-pointer px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all font-medium"
            >
              <i className="fas fa-check mr-2"></i>Create Event
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="cursor-pointer px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all font-medium"
            >
              Next<i className="fas fa-arrow-right ml-2"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
