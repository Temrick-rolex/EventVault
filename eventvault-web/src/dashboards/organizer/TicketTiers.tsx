import { useState } from 'react'

export default function TicketTiers() {
  const [selectedEvent, setSelectedEvent] = useState('1')
  const [editingTier, setEditingTier] = useState<number | null>(null)

  const events = [
    { id: '1', title: 'Summer Music Festival' },
    { id: '2', title: 'Tech Conference 2024' },
    { id: '3', title: 'Art Exhibition' },
  ]

  const [ticketTiers, setTicketTiers] = useState([
    { id: 1, name: 'VIP', price: 150, quantity: 500, sold: 320, perks: 'Early entry, VIP lounge, complimentary drinks' },
    { id: 2, name: 'Standard', price: 75, quantity: 2000, sold: 1200, perks: 'General admission' },
    { id: 3, name: 'Student', price: 40, quantity: 500, sold: 280, perks: 'Student ID required, general admission' },
  ])

  const [newTier, setNewTier] = useState({ name: '', price: '', quantity: '', perks: '' })

  const handleEdit = (tierId: number) => {
    setEditingTier(tierId)
  }

  const handleSave = () => {
    setEditingTier(null)
  }

  const handleCancel = () => {
    setEditingTier(null)
  }

  const handleDelete = (tierId: number) => {
    setTicketTiers(ticketTiers.filter(tier => tier.id !== tierId))
  }

  const handleAddTier = () => {
    if (newTier.name && newTier.price && newTier.quantity) {
      setTicketTiers([
        ...ticketTiers,
        {
          id: Date.now(),
          name: newTier.name,
          price: parseFloat(newTier.price),
          quantity: parseInt(newTier.quantity),
          sold: 0,
          perks: newTier.perks
        }
      ])
      setNewTier({ name: '', price: '', quantity: '', perks: '' })
    }
  }

  const totalRevenue = ticketTiers.reduce((sum, tier) => sum + (tier.sold * tier.price), 0)
  const totalSold = ticketTiers.reduce((sum, tier) => sum + tier.sold, 0)
  const totalAvailable = ticketTiers.reduce((sum, tier) => sum + tier.quantity, 0)

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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Total Revenue</span>
            <i className="fas fa-dollar-sign text-emerald-400"></i>
          </div>
          <div className="text-2xl font-bold text-slate-100">${totalRevenue.toLocaleString()}</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Tickets Sold</span>
            <i className="fas fa-ticket text-emerald-400"></i>
          </div>
          <div className="text-2xl font-bold text-slate-100">{totalSold.toLocaleString()}</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Available</span>
            <i className="fas fa-check-circle text-emerald-400"></i>
          </div>
          <div className="text-2xl font-bold text-slate-100">{(totalAvailable - totalSold).toLocaleString()}</div>
        </div>
      </div>

      {/* Ticket Tiers List */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 shadow-sm">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-100">Ticket Tiers</h2>
        </div>
        <div className="p-6 space-y-4">
          {ticketTiers.map((tier) => (
            <div key={tier.id} className="p-6 bg-slate-900/50 rounded-lg border border-slate-700">
              {editingTier === tier.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                      <input
                        type="text"
                        value={tier.name}
                        onChange={(e) => {
                          const updated = ticketTiers.map(t => t.id === tier.id ? { ...t, name: e.target.value } : t)
                          setTicketTiers(updated)
                        }}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 transition-all text-slate-100 placeholder-slate-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Price ($)</label>
                      <input
                        type="number"
                        value={tier.price}
                        onChange={(e) => {
                          const updated = ticketTiers.map(t => t.id === tier.id ? { ...t, price: parseFloat(e.target.value) } : t)
                          setTicketTiers(updated)
                        }}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 transition-all text-slate-100 placeholder-slate-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Quantity</label>
                      <input
                        type="number"
                        value={tier.quantity}
                        onChange={(e) => {
                          const updated = ticketTiers.map(t => t.id === tier.id ? { ...t, quantity: parseInt(e.target.value) } : t)
                          setTicketTiers(updated)
                        }}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 transition-all text-slate-100 placeholder-slate-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Perks</label>
                    <textarea
                      value={tier.perks}
                      onChange={(e) => {
                        const updated = ticketTiers.map(t => t.id === tier.id ? { ...t, perks: e.target.value } : t)
                        setTicketTiers(updated)
                      }}
                      rows={2}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 transition-all resize-none text-slate-100 placeholder-slate-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                      <i className="fas fa-save mr-2"></i>Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-100 text-lg">{tier.name}</h3>
                      <p className="text-sm text-slate-400">{tier.perks}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-100">${tier.price}</div>
                      <div className="text-sm text-slate-400">per ticket</div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-400">Sales Progress</span>
                      <span className="font-medium text-slate-100">{tier.sold} / {tier.quantity}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all"
                        style={{ width: `${(tier.sold / tier.quantity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(tier.id)}
                      className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors text-sm font-medium"
                    >
                      <i className="fas fa-edit mr-2"></i>Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tier.id)}
                      className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
                    >
                      <i className="fas fa-trash mr-2"></i>Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add New Tier */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 shadow-sm">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-100">Add New Tier</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
              <input
                type="text"
                value={newTier.name}
                onChange={(e) => setNewTier({ ...newTier, name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-100 placeholder-slate-500"
                placeholder="e.g., VIP, Standard"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Price ($)</label>
              <input
                type="number"
                value={newTier.price}
                onChange={(e) => setNewTier({ ...newTier, price: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-100 placeholder-slate-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
              <input
                type="number"
                value={newTier.quantity}
                onChange={(e) => setNewTier({ ...newTier, quantity: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-100 placeholder-slate-500"
                placeholder="0"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Perks</label>
            <textarea
              value={newTier.perks}
              onChange={(e) => setNewTier({ ...newTier, perks: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
              placeholder="List perks included in this tier"
            />
          </div>
          <button
            onClick={handleAddTier}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all font-medium"
          >
            <i className="fas fa-plus mr-2"></i>Add Tier
          </button>
        </div>
      </div>
    </div>
  )
}
