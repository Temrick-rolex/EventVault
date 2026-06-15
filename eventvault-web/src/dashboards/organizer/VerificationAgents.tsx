import { useState } from 'react'

export default function VerificationAgents() {
  const [selectedEvent, setSelectedEvent] = useState('all')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')

  const events = [
    { id: 'all', title: 'All Events' },
    { id: '1', title: 'Summer Music Festival' },
    { id: '2', title: 'Tech Conference 2024' },
    { id: '3', title: 'Art Exhibition' },
  ]

  const agents = [
    { id: 1, name: 'John Smith', email: 'john.smith@email.com', event: 'Summer Music Festival', status: 'Active', scans: 245 },
    { id: 2, name: 'Sarah Johnson', email: 'sarah.j@email.com', event: 'Tech Conference 2024', status: 'Active', scans: 189 },
    { id: 3, name: 'Mike Davis', email: 'mike.d@email.com', event: 'Art Exhibition', status: 'Pending', scans: 0 },
    { id: 4, name: 'Emily Brown', email: 'emily.b@email.com', event: 'Summer Music Festival', status: 'Active', scans: 312 },
    { id: 5, name: 'David Wilson', email: 'david.w@email.com', event: 'Tech Conference 2024', status: 'Inactive', scans: 156 },
  ]

  const filteredAgents = selectedEvent === 'all' 
    ? agents 
    : agents.filter(agent => agent.event === events.find(e => e.id === selectedEvent)?.title)

  const handleInvite = () => {
    if (!inviteEmail.trim()) return
    console.log('Inviting agent:', inviteEmail, 'to event:', selectedEvent)
    setShowInviteModal(false)
    setInviteEmail('')
    alert('Invitation sent successfully!')
  }

  const handleResendInvite = (agentId: number) => {
    console.log('Resending invitation to agent:', agentId)
    alert('Invitation resent successfully!')
  }

  const handleRevokeInvite = (agentId: number) => {
    console.log('Revoking invitation for agent:', agentId)
    alert('Invitation revoked successfully!')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-500/20 text-emerald-400'
      case 'Pending': return 'bg-yellow-500/20 text-yellow-400'
      case 'Inactive': return 'bg-slate-700 text-slate-400'
      default: return 'bg-slate-700 text-slate-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
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
        <button
          onClick={() => setShowInviteModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-sm"
        >
          <i className="fas fa-user-plus mr-2"></i>Invite Agent
        </button>
      </div>

      {/* Info Section */}
      <div className="bg-emerald-500/10 rounded-xl border border-emerald-500/20 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
            <i className="fas fa-info-circle text-xl"></i>
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 mb-2">About Verification Agents</h3>
            <p className="text-sm text-slate-400">
              Verification agents are trusted individuals who help scan and validate tickets at your events. 
              They can access the mobile app to verify tickets offline, ensuring smooth entry even without internet connectivity. 
              Invite agents to your events to streamline the check-in process.
            </p>
          </div>
        </div>
      </div>

      {/* Agents List */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 shadow-sm">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-100">Agents ({filteredAgents.length})</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {filteredAgents.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg hover:bg-slate-800 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {agent.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-100">{agent.name}</h3>
                    <p className="text-sm text-slate-400">{agent.email}</p>
                    <p className="text-xs text-slate-500 mt-1">{agent.event}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-slate-400">Scans</p>
                    <p className="font-semibold text-slate-100">{agent.scans}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                    {agent.status}
                  </span>
                  <div className="flex gap-2">
                    {agent.status === 'Pending' && (
                      <button
                        onClick={() => handleResendInvite(agent.id)}
                        className="p-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                        title="Resend invitation"
                      >
                        <i className="fas fa-redo"></i>
                      </button>
                    )}
                    <button
                      onClick={() => handleRevokeInvite(agent.id)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                      title="Revoke invitation"
                    >
                      <i className="fas fa-ban"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAgents.length === 0 && (
            <div className="text-center py-12">
              <i className="fas fa-user-slash text-6xl text-slate-600 mb-4"></i>
              <h3 className="text-xl font-semibold text-slate-400 mb-2">No agents found</h3>
              <p className="text-slate-500">Invite agents to help with ticket verification</p>
            </div>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-100">Invite Verification Agent</h2>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-slate-300 transition-colors"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Agent Email</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-100 placeholder-slate-500"
                  placeholder="Enter agent's email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Event</label>
                <select
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-100"
                >
                  {events.filter(e => e.id !== 'all').map(event => (
                    <option key={event.id} value={event.id}>{event.title}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvite}
                  disabled={!inviteEmail.trim()}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                    !inviteEmail.trim()
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700'
                  }`}
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
