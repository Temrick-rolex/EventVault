import { useState, useEffect } from 'react'

export default function DashboardHome() {
  const [counters, setCounters] = useState({
    totalEvents: 0,
    activeEvents: 0,
    ticketsSold: 0,
    revenue: 0,
    pendingEscrow: 0,
    upcomingEvents: 0
  })

  useEffect(() => {
    const targetValues = {
      totalEvents: 24,
      activeEvents: 8,
      ticketsSold: 15420,
      revenue: 892000,
      pendingEscrow: 45000,
      upcomingEvents: 5
    }

    const duration = 2000
    const steps = 60
    const interval = duration / steps

    const incrementCounter = () => {
      setCounters(prev => {
        const newCounters = { ...prev }
        Object.keys(targetValues).forEach(key => {
          const increment = targetValues[key as keyof typeof targetValues] / steps
          newCounters[key as keyof typeof newCounters] = Math.min(
            Math.floor(newCounters[key as keyof typeof newCounters] + increment),
            targetValues[key as keyof typeof targetValues]
          )
        })
        return newCounters
      })
    }

    const timer = setInterval(incrementCounter, interval)
    return () => clearInterval(timer)
  }, [])

  const recentEvents = [
    { id: 1, title: 'Summer Music Festival', date: '2024-07-15', status: 'Published', tickets: 3200, revenue: 192000 },
    { id: 2, title: 'Tech Conference 2024', date: '2024-08-20', status: 'Published', tickets: 1500, revenue: 75000 },
    { id: 3, title: 'Art Exhibition', date: '2024-09-10', status: 'Draft', tickets: 0, revenue: 0 },
    { id: 4, title: 'Charity Gala', date: '2024-10-05', status: 'Published', tickets: 800, revenue: 40000 },
  ]

  const upcomingTasks = [
    { id: 1, task: 'Review ticket sales for Summer Festival', priority: 'High', due: 'Today' },
    { id: 2, task: 'Complete artwork for Tech Conference', priority: 'Medium', due: 'Tomorrow' },
    { id: 3, task: 'Invite verification agents for Charity Gala', priority: 'Low', due: 'In 3 days' },
    { id: 4, task: 'Release escrow funds for completed event', priority: 'High', due: 'In 5 days' },
  ]

  const recentNotifications = [
    { id: 1, message: 'New ticket purchase for Summer Festival', time: '5 minutes ago', type: 'success' },
    { id: 2, message: 'Escrow funds released for Tech Conference', time: '1 hour ago', type: 'info' },
    { id: 3, message: 'Verification agent accepted invitation', time: '2 hours ago', type: 'success' },
    { id: 4, message: 'Event deadline approaching for Art Exhibition', time: '3 hours ago', type: 'warning' },
  ]

  const quickActions = [
    { id: 1, title: 'Create New Event', icon: 'fa-plus-circle', color: 'bg-emerald-600' },
    { id: 2, title: 'Manage Events', icon: 'fa-calendar-days', color: 'bg-emerald-500' },
    { id: 3, title: 'View Analytics', icon: 'fa-chart-line', color: 'bg-emerald-700' },
    { id: 4, title: 'Settings', icon: 'fa-cog', color: 'bg-slate-700' },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: 'Total Events', value: counters.totalEvents, icon: 'fa-calendar-days', color: 'text-emerald-400' },
          { label: 'Active Events', value: counters.activeEvents, icon: 'fa-check-circle', color: 'text-emerald-400' },
          { label: 'Tickets Sold', value: counters.ticketsSold.toLocaleString(), icon: 'fa-ticket', color: 'text-emerald-400' },
          { label: 'Revenue', value: `XAF ${counters.revenue.toLocaleString()}`, icon: 'fa-dollar-sign', color: 'text-emerald-400' },
          { label: 'Pending Escrow', value: `XAF ${counters.pendingEscrow.toLocaleString()}`, icon: 'fa-vault', color: 'text-emerald-400' },
          { label: 'Upcoming', value: counters.upcomingEvents, icon: 'fa-clock', color: 'text-emerald-400' },
        ].map((stat, index) => (
          <div key={index} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">{stat.label}</span>
              <i className={`fas ${stat.icon} ${stat.color} text-lg`}></i>
            </div>
            <div className="text-2xl font-bold text-slate-100">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Events */}
        <div className="lg:col-span-2 bg-slate-800/50 rounded-xl border border-slate-700 shadow-sm">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-slate-100">Recent Events</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center text-white">
                      <i className="fas fa-calendar-days"></i>
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-100">{event.title}</h3>
                      <p className="text-sm text-slate-400">{event.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      event.status === 'Published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
                    }`}>
                      {event.status}
                    </span>
                    <p className="text-sm text-slate-400 mt-1">{event.tickets.toLocaleString()} tickets</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 shadow-sm">
          <div className="p-6 border-b border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-100">Upcoming Tasks</h2>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors">
              <i className="fas fa-plus"></i>
              Add Task
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="p-4 bg-slate-900/50 rounded-lg hover:bg-slate-800 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-slate-100 text-sm">{task.task}</p>
                      <p className="text-xs text-slate-400 mt-1">Due: {task.due}</p>
                    </div>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      task.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                      task.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-slate-700 text-slate-400'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 shadow-sm">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-100">Recent Notifications</h2>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {recentNotifications.map((notification) => (
              <div key={notification.id} className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-lg hover:bg-slate-800 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  notification.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                  notification.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {notification.type === 'success' && <i className="fas fa-check-circle"></i>}
                  {notification.type === 'warning' && <i className="fas fa-exclamation-triangle"></i>}
                  {notification.type === 'info' && <i className="fas fa-info-circle"></i>}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-100 text-sm">{notification.message}</p>
                  <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 shadow-sm">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-100">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.id}
                className={`cursor-pointer flex items-center gap-4 p-4 rounded-lg ${action.color} text-white hover:opacity-90 transition-opacity`}
              >
                <i className={`fas ${action.icon} text-2xl`}></i>
                <span className="font-medium">{action.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
