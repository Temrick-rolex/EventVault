import { useState } from 'react'

export default function AIArtworkGenerator() {
  const [selectedEvent, setSelectedEvent] = useState('1')
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [qrZonePosition, setQrZonePosition] = useState({ x: 50, y: 80 })

  const events = [
    { id: '1', title: 'Summer Music Festival' },
    { id: '2', title: 'Tech Conference 2024' },
    { id: '3', title: 'Art Exhibition' },
  ]

  const styleSuggestions = [
    'Modern minimalist with blue gradients',
    'Vibrant neon cyberpunk style',
    'Elegant watercolor aesthetic',
    'Bold geometric patterns',
    'Vintage poster design',
    'Abstract digital art',
  ]

  const handleGenerate = () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    
    setTimeout(() => {
      setGeneratedImage('https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=600&fit=crop')
      setIsGenerating(false)
    }, 3000)
  }

  const handleSave = () => {
    console.log('Saving artwork for event:', selectedEvent)
    alert('Artwork saved successfully!')
  }

  return (
    <div className="space-y-6">
      {/* Event Selector */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Select Event</label>
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="w-full md:w-96 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-100"
        >
          {events.map(event => (
            <option key={event.id} value={event.id}>{event.title}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Input */}
        <div className="space-y-6">
          {/* Prompt Input */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-100 mb-4">Generate Artwork</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Describe your artwork</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none text-slate-100 placeholder-slate-500"
                  placeholder="Describe the artwork you want to generate for your event..."
                />
              </div>
              
              {/* Style Suggestions */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Style suggestions</label>
                <div className="flex flex-wrap gap-2">
                  {styleSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setPrompt(suggestion)}
                      className="px-3 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors text-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className={`w-full px-6 py-3 rounded-lg font-medium transition-all ${
                  !prompt.trim() || isGenerating
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700'
                }`}
              >
                {isGenerating ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>Generating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-magic mr-2"></i>Generate Artwork
                  </>
                )}
              </button>
            </div>
          </div>

          {/* QR Zone Positioning */}
          {generatedImage && (
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-100 mb-4">QR Code Zone</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Position X (%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={qrZonePosition.x}
                    onChange={(e) => setQrZonePosition({ ...qrZonePosition, x: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-sm text-slate-400 mt-1">{qrZonePosition.x}%</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Position Y (%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={qrZonePosition.y}
                    onChange={(e) => setQrZonePosition({ ...qrZonePosition, y: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-sm text-slate-400 mt-1">{qrZonePosition.y}%</div>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <p className="text-sm text-slate-400">
                    <i className="fas fa-info-circle mr-2 text-emerald-400"></i>
                    The QR code will be positioned at these coordinates on the artwork. This area will be reserved for the dynamic QR code on tickets.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Preview */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Preview</h2>
          <div className="relative aspect-[4/3] bg-slate-900 rounded-lg overflow-hidden">
            {generatedImage ? (
              <>
                <img
                  src={generatedImage}
                  alt="Generated artwork"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute border-2 border-dashed border-white bg-white/20 backdrop-blur-sm rounded flex items-center justify-center"
                  style={{
                    left: `${qrZonePosition.x}%`,
                    top: `${qrZonePosition.y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: '80px',
                    height: '80px',
                  }}
                >
                  <i className="fas fa-qrcode text-white text-3xl"></i>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                <i className="fas fa-image text-6xl mb-4"></i>
                <p className="text-lg">Artwork preview will appear here</p>
                <p className="text-sm">Generate artwork to see the preview</p>
              </div>
            )}
          </div>
          {generatedImage && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all font-medium"
              >
                <i className="fas fa-save mr-2"></i>Save to Event
              </button>
              <button
                onClick={() => setGeneratedImage(null)}
                className="px-4 py-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
              >
                <i className="fas fa-redo"></i>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-emerald-500/10 rounded-xl border border-emerald-500/20 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
            <i className="fas fa-lightbulb text-xl"></i>
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 mb-2">About AI Artwork Generation</h3>
            <p className="text-sm text-slate-400">
              Our AI-powered artwork generator creates unique, professional designs for your event tickets. 
              Simply describe your vision, and our AI will generate a custom artwork that you can use for your event. 
              The QR code zone allows you to specify where the dynamic QR code will be placed on each ticket.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
