import { useState } from 'react'

interface DashboardLayoutProps {
  currentPage: string
  onPageChange: (page: string) => void
  children: React.ReactNode
}

export default function DashboardLayout({ currentPage, onPageChange, children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-home' },
    { id: 'events', label: 'Events', icon: 'fa-calendar-days' },
    { id: 'create-event', label: 'Create Event', icon: 'fa-plus-circle' },
    { id: 'ticket-tiers', label: 'Ticket Tiers', icon: 'fa-ticket' },
    { id: 'ai-artwork', label: 'AI Artwork', icon: 'fa-palette' },
    { id: 'agents', label: 'Verification Agents', icon: 'fa-user-shield' },
    { id: 'escrow', label: 'Escrow & Payouts', icon: 'fa-vault' },
    { id: 'analytics', label: 'Analytics', icon: 'fa-chart-line' },
    { id: 'settings', label: 'Settings', icon: 'fa-cog' },
  ]

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-slate-900 border-r border-slate-800 z-50 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              <i className="fas fa-ticket"></i>
            </div>
            {sidebarOpen && (
              <span className="text-xl font-bold text-slate-100">EventVault</span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
                  className={`cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    currentPage === item.id
                      ? 'bg-emerald-500/20 text-emerald-400 font-medium'
                      : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <i className={`fas ${item.icon} text-lg`}></i>
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Toggle Button */}
        <div className="absolute bottom-20 left-4 right-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all duration-200 text-slate-400"
          >
            <i className={`fas ${sidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
            {sidebarOpen && <span>Collapse</span>}
          </button>
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-slate-400 hover:bg-red-500/10 hover:text-red-400"
          >
            <i className="fas fa-sign-out-alt text-lg"></i>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Bar */}
        <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-100">
                {menuItems.find((item) => item.id === currentPage)?.label}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer">
                <i className="fas fa-bell text-xl"></i>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                  JD
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-slate-100">John Doe</p>
                  <p className="text-xs text-slate-400">Organizer</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
