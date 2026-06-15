import { useState } from 'react'

export default function EventsManagement() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const events = [
    { id: 1, title: 'Summer Music Festival', date: '2024-07-15', location: 'Central Park, NYC', status: 'Published', ticketsSold: 3200, totalTickets: 5000, revenue: 192000 },
    { id: 2, title: 'Tech Conference 2024', date: '2024-08-20', location: 'Convention Center, SF', status: 'Published', ticketsSold: 1500, totalTickets: 2000, revenue: 75000 },
    { id: 3, title: 'Art Exhibition', date: '2024-09-10', location: 'Gallery District, LA', status: 'Draft', ticketsSold: 0, totalTickets: 500, revenue: 0 },
    { id: 4, title: 'Charity Gala', date: '2024-10-05', location: 'Grand Hotel, Chicago', status: 'Published', ticketsSold: 800, totalTickets: 1000, revenue: 40000 },
    { id: 5, title: 'Jazz Night', date: '2024-11-12', location: 'Blue Note, NY', status: 'Draft', ticketsSold: 0, totalTickets: 200, revenue: 0 },
    { id: 6, title: 'Startup Pitch Day', date: '2024-12-01', location: 'Innovation Hub, Austin', status: 'Published', ticketsSold: 450, totalTickets: 800, revenue: 22500 },
  ]

  const filteredEvents = events.filter(event => {
    const matchesFilter = filter === 'all' || event.status.toLowerCase() === filter.toLowerCase()
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) || 
                         event.location.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published': return 'bg-emerald-500/20 text-emerald-400'
      case 'Draft': return 'bg-slate-700 text-slate-400'
      case 'Cancelled': return 'bg-red-500/20 text-red-400'
      case 'Completed': return 'bg-emerald-500/20 text-emerald-400'
      default: return 'bg-slate-700 text-slate-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search events by title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-100 placeholder-slate-500"
          />
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-sm">
          <i className="fas fa-plus mr-2"></i>Create Event
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['All', 'Published', 'Draft', 'Cancelled', 'Completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status.toLowerCase())}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === status.toLowerCase()
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-slate-800/50 rounded-xl border border-slate-700 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="h-40 bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center">
              <i className="fas fa-calendar-days text-white text-5xl opacity-50"></i>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-slate-100 text-lg">{event.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
              </div>
              <div className="space-y-2 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <i className="fas fa-calendar text-emerald-400 w-5"></i>
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-map-marker-alt text-emerald-400 w-5"></i>
                  <span>{event.location}</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-400">Tickets Sold</span>
                  <span className="font-medium text-slate-100">{event.ticketsSold.toLocaleString()} / {event.totalTickets.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all"
                    style={{ width: `${(event.ticketsSold / event.totalTickets) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Revenue</span>
                  <span className="font-semibold text-slate-100">${event.revenue.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors font-medium text-sm">
                  <i className="fas fa-eye mr-2"></i>View
                </button>
                <button className="flex-1 px-4 py-2 bg-slate-700 text-slate-400 rounded-lg hover:bg-slate-600 transition-colors font-medium text-sm">
                  <i className="fas fa-edit mr-2"></i>Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <i className="fas fa-calendar-times text-6xl text-slate-600 mb-4"></i>
          <h3 className="text-xl font-semibold text-slate-400 mb-2">No events found</h3>
          <p className="text-slate-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}
