import { useState } from 'react'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile')

  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    organization: 'EventVault Inc.',
  })

  const [security, setSecurity] = useState({
    twoFactorEnabled: true,
    loginAlerts: true,
    sessionTimeout: '30',
  })

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    ticketSales: true,
    eventReminders: true,
    agentUpdates: true,
    escrowAlerts: true,
  })

  const handleProfileSave = () => {
    console.log('Saving profile:', profile)
    alert('Profile updated successfully!')
  }

  const handlePasswordChange = () => {
    console.log('Password change requested')
    alert('Password change link sent to your email!')
  }

  const handleToggle = (section: string, key: string) => {
    if (section === 'security') {
      setSecurity({ ...security, [key]: !security[key as keyof typeof security] })
    } else if (section === 'notifications') {
      setNotifications({ ...notifications, [key]: !notifications[key as keyof typeof notifications] })
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'fa-user' },
    { id: 'security', label: 'Security', icon: 'fa-shield-alt' },
    { id: 'notifications', label: 'Notifications', icon: 'fa-bell' },
    { id: 'billing', label: 'Billing', icon: 'fa-credit-card' },
  ]

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`cursor-pointer flex items-center gap-2 px-6 py-3 font-medium transition-all ${
              activeTab === tab.id
                ? 'text-emerald-400 border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <i className={`fas ${tab.icon}`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-6">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">First Name</label>
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-100 placeholder-slate-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-100 placeholder-slate-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-100 placeholder-slate-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-100 placeholder-slate-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Organization</label>
              <input
                type="text"
                value={profile.organization}
                onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-100 placeholder-slate-500"
              />
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={handleProfileSave}
              className="cursor-pointer px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all font-medium"
            >
              <i className="fas fa-save mr-2"></i>Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-100 mb-6">Security Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                <div>
                  <h3 className="font-medium text-slate-100">Two-Factor Authentication</h3>
                  <p className="text-sm text-slate-400">Add an extra layer of security to your account</p>
                </div>
                <button
                  onClick={() => handleToggle('security', 'twoFactorEnabled')}
                  className={`cursor-pointer relative w-12 h-6 rounded-full transition-colors ${
                    security.twoFactorEnabled ? 'bg-emerald-500' : 'bg-slate-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      security.twoFactorEnabled ? 'left-7' : 'left-1'
                    }`}
                  ></div>
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                <div>
                  <h3 className="font-medium text-slate-100">Login Alerts</h3>
                  <p className="text-sm text-slate-400">Get notified when someone logs into your account</p>
                </div>
                <button
                  onClick={() => handleToggle('security', 'loginAlerts')}
                  className={`cursor-pointer relative w-12 h-6 rounded-full transition-colors ${
                    security.loginAlerts ? 'bg-emerald-500' : 'bg-slate-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      security.loginAlerts ? 'left-7' : 'left-1'
                    }`}
                  ></div>
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Session Timeout (minutes)</label>
                <select
                  value={security.sessionTimeout}
                  onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
                  className="w-full md:w-48 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-100"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl border border-slate-700 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-100 mb-6">Change Password</h2>
            <button
              onClick={handlePasswordChange}
              className="cursor-pointer px-6 py-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors font-medium"
            >
              <i className="fas fa-key mr-2"></i>Change Password
            </button>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-6">Notification Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
              <div>
                <h3 className="font-medium text-slate-100">Email Notifications</h3>
                <p className="text-sm text-slate-400">Receive updates via email</p>
              </div>
              <button
                onClick={() => handleToggle('notifications', 'email')}
                className={`cursor-pointer relative w-12 h-6 rounded-full transition-colors ${
                  notifications.email ? 'bg-emerald-500' : 'bg-slate-600'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    notifications.email ? 'left-7' : 'left-1'
                  }`}
                ></div>
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
              <div>
                <h3 className="font-medium text-slate-100">Push Notifications</h3>
                <p className="text-sm text-slate-400">Receive push notifications on your device</p>
              </div>
              <button
                onClick={() => handleToggle('notifications', 'push')}
                className={`cursor-pointer relative w-12 h-6 rounded-full transition-colors ${
                  notifications.push ? 'bg-emerald-500' : 'bg-slate-600'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    notifications.push ? 'left-7' : 'left-1'
                  }`}
                ></div>
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
              <div>
                <h3 className="font-medium text-slate-100">Ticket Sales</h3>
                <p className="text-sm text-slate-400">Get notified when tickets are sold</p>
              </div>
              <button
                onClick={() => handleToggle('notifications', 'ticketSales')}
                className={`cursor-pointer relative w-12 h-6 rounded-full transition-colors ${
                  notifications.ticketSales ? 'bg-emerald-500' : 'bg-slate-600'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    notifications.ticketSales ? 'left-7' : 'left-1'
                  }`}
                ></div>
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
              <div>
                <h3 className="font-medium text-slate-100">Event Reminders</h3>
                <p className="text-sm text-slate-400">Reminders before your events</p>
              </div>
              <button
                onClick={() => handleToggle('notifications', 'eventReminders')}
                className={`cursor-pointer relative w-12 h-6 rounded-full transition-colors ${
                  notifications.eventReminders ? 'bg-emerald-500' : 'bg-slate-600'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    notifications.eventReminders ? 'left-7' : 'left-1'
                  }`}
                ></div>
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
              <div>
                <h3 className="font-medium text-slate-100">Agent Updates</h3>
                <p className="text-sm text-slate-400">Updates from verification agents</p>
              </div>
              <button
                onClick={() => handleToggle('notifications', 'agentUpdates')}
                className={`cursor-pointer relative w-12 h-6 rounded-full transition-colors ${
                  notifications.agentUpdates ? 'bg-emerald-500' : 'bg-slate-600'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    notifications.agentUpdates ? 'left-7' : 'left-1'
                  }`}
                ></div>
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
              <div>
                <h3 className="font-medium text-slate-100">Escrow Alerts</h3>
                <p className="text-sm text-slate-400">Alerts about fund releases and disputes</p>
              </div>
              <button
                onClick={() => handleToggle('notifications', 'escrowAlerts')}
                className={`cursor-pointer relative w-12 h-6 rounded-full transition-colors ${
                  notifications.escrowAlerts ? 'bg-emerald-500' : 'bg-slate-600'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    notifications.escrowAlerts ? 'left-7' : 'left-1'
                  }`}
                ></div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-100 mb-6">Current Plan</h2>
            <div className="p-6 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">Professional Plan</h3>
                  <p className="text-emerald-100">XAF 49/month</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-emerald-100">Next billing date</p>
                  <p className="font-semibold">July 15, 2024</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button className="cursor-pointer px-6 py-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors font-medium">
                <i className="fas fa-arrow-up mr-2"></i>Upgrade Plan
              </button>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl border border-slate-700 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-100 mb-6">Payment Method</h2>
            <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-lg">
              <div className="w-12 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded flex items-center justify-center text-white">
                <i className="fab fa-cc-visa text-2xl"></i>
              </div>
              <div>
                <p className="font-medium text-slate-100">Visa ending in 4242</p>
                <p className="text-sm text-slate-400">Expires 12/2025</p>
              </div>
            </div>
            <div className="mt-4">
              <button className="cursor-pointer px-6 py-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors font-medium">
                <i className="fas fa-plus mr-2"></i>Add Payment Method
              </button>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl border border-slate-700 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-100 mb-6">Billing History</h2>
            <div className="space-y-3">
              {[
                { date: 'June 15, 2024', amount: 'XAF 49.00', status: 'Paid' },
                { date: 'May 15, 2024', amount: 'XAF 49.00', status: 'Paid' },
                { date: 'April 15, 2024', amount: 'XAF 49.00', status: 'Paid' },
              ].map((invoice, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-100">{invoice.date}</p>
                    <p className="text-sm text-slate-400">{invoice.amount}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium">
                      {invoice.status}
                    </span>
                    <button className="text-emerald-400 hover:text-emerald-300">
                      <i className="fas fa-download"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
