import { useState } from 'react'

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('30d')

  const metrics = [
    { label: 'Total Revenue', value: '$892,000', change: '+12.5%', trend: 'up' },
    { label: 'Tickets Sold', value: '15,420', change: '+8.2%', trend: 'up' },
    { label: 'Events Hosted', value: '24', change: '+2', trend: 'up' },
    { label: 'Avg. Ticket Price', value: '$57.85', change: '-3.1%', trend: 'down' },
  ]

  const topEvents = [
    { id: 1, title: 'Summer Music Festival', revenue: 192000, tickets: 3200, growth: '+15%' },
    { id: 2, title: 'Tech Conference 2024', revenue: 75000, tickets: 1500, growth: '+8%' },
    { id: 3, title: 'Charity Gala', revenue: 40000, tickets: 800, growth: '+22%' },
    { id: 4, title: 'Startup Pitch Day', revenue: 22500, tickets: 450, growth: '+5%' },
  ]

  const recentActivity = [
    { id: 1, action: 'New ticket purchase', event: 'Summer Music Festival', time: '2 minutes ago', icon: 'fa-ticket' },
    { id: 2, action: 'Agent invited', event: 'Tech Conference 2024', time: '15 minutes ago', icon: 'fa-user-plus' },
    { id: 3, action: 'Funds released', event: 'Charity Gala', time: '1 hour ago', icon: 'fa-vault' },
    { id: 4, action: 'Artwork generated', event: 'Art Exhibition', time: '2 hours ago', icon: 'fa-palette' },
    { id: 5, action: 'Event published', event: 'Jazz Night', time: '3 hours ago', icon: 'fa-calendar-check' },
  ]

  const handleExport = (type: string) => {
    console.log('Exporting', type)
    alert(`${type} report exported successfully!`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Analytics & Reports</h1>
          <p className="text-slate-400">Track your event performance and growth</p>
        </div>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-100"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">{metric.label}</span>
              <div className={`flex items-center gap-1 text-sm ${
                metric.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
              }`}>
                <i className={`fas fa-arrow-${metric.trend}`}></i>
                <span>{metric.change}</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-100">{metric.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart Placeholder */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Revenue & Tickets Over Time</h2>
          <div className="h-64 bg-slate-900 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <i className="fas fa-chart-line text-6xl text-slate-600 mb-4"></i>
              <p className="text-slate-400">Revenue chart visualization</p>
              <p className="text-sm text-slate-500">Connect to analytics API for real data</p>
            </div>
          </div>
        </div>

        {/* Ticket Distribution */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Ticket Tier Distribution</h2>
          <div className="h-64 bg-slate-900 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <i className="fas fa-chart-pie text-6xl text-slate-600 mb-4"></i>
              <p className="text-slate-400">Ticket tier breakdown</p>
              <p className="text-sm text-slate-500">Connect to analytics API for real data</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Events */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 shadow-sm">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-slate-100">Top Performing Events</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topEvents.map((event, index) => (
                <div key={event.id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-100">{event.title}</h3>
                      <p className="text-sm text-slate-400">{event.tickets.toLocaleString()} tickets</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-slate-100">${event.revenue.toLocaleString()}</div>
                    <div className="text-sm text-emerald-400">{event.growth}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 shadow-sm">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-slate-100">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-lg">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400">
                    <i className={`fas ${activity.icon}`}></i>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-100">{activity.action}</p>
                    <p className="text-sm text-slate-400">{activity.event}</p>
                  </div>
                  <div className="text-sm text-slate-500">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Export Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => handleExport('Revenue')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
          >
            <i className="fas fa-file-pdf text-red-600"></i>
            <span>Revenue Report</span>
          </button>
          <button
            onClick={() => handleExport('Ticket Sales')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
          >
            <i className="fas fa-file-excel text-green-600"></i>
            <span>Ticket Sales</span>
          </button>
          <button
            onClick={() => handleExport('Event Performance')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
          >
            <i className="fas fa-file-csv text-blue-600"></i>
            <span>Event Performance</span>
          </button>
          <button
            onClick={() => handleExport('Custom')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
          >
            <i className="fas fa-cog text-slate-600"></i>
            <span>Custom Report</span>
          </button>
        </div>
      </div>
    </div>
  )
}
