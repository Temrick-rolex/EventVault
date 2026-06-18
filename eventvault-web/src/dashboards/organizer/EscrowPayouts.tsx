import { useState } from 'react'

export default function EscrowPayouts() {
  const [filter, setFilter] = useState('all')

  const escrowAccounts = [
    { id: 1, event: 'Summer Music Festival', lockedAmount: 192000, status: 'Locked', scanRate: 95, disputes: 0, eligible: false },
    { id: 2, event: 'Tech Conference 2024', lockedAmount: 75000, status: 'Locked', scanRate: 88, disputes: 1, eligible: false },
    { id: 3, event: 'Charity Gala', lockedAmount: 40000, status: 'Released', scanRate: 98, disputes: 0, eligible: true },
    { id: 4, event: 'Jazz Night', lockedAmount: 12000, status: 'Locked', scanRate: 72, disputes: 0, eligible: false },
    { id: 5, event: 'Startup Pitch Day', lockedAmount: 22500, status: 'Refunded', scanRate: 45, disputes: 3, eligible: false },
  ]

  const filteredAccounts = filter === 'all' 
    ? escrowAccounts 
    : escrowAccounts.filter(account => account.status.toLowerCase() === filter.toLowerCase())

  const totalLocked = escrowAccounts
    .filter(a => a.status === 'Locked')
    .reduce((sum, a) => sum + a.lockedAmount, 0)
  const totalReleased = escrowAccounts
    .filter(a => a.status === 'Released')
    .reduce((sum, a) => sum + a.lockedAmount, 0)
  const totalRefunded = escrowAccounts
    .filter(a => a.status === 'Refunded')
    .reduce((sum, a) => sum + a.lockedAmount, 0)

  const handleReleaseFunds = (accountId: number) => {
    console.log('Releasing funds for account:', accountId)
    alert('Fund release request submitted successfully!')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Locked': return 'bg-emerald-500/20 text-emerald-400'
      case 'Released': return 'bg-emerald-500/20 text-emerald-400'
      case 'Refunded': return 'bg-red-500/20 text-red-400'
      default: return 'bg-slate-700 text-slate-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Locked Funds</span>
            <i className="fas fa-vault text-emerald-400"></i>
          </div>
          <div className="text-2xl font-bold text-slate-100">XAF {totalLocked.toLocaleString()}</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Released Funds</span>
            <i className="fas fa-check-circle text-emerald-400"></i>
          </div>
          <div className="text-2xl font-bold text-slate-100">XAF {totalReleased.toLocaleString()}</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Refunded Funds</span>
            <i className="fas fa-undo text-red-400"></i>
          </div>
          <div className="text-2xl font-bold text-slate-100">XAF {totalRefunded.toLocaleString()}</div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-emerald-500/10 rounded-xl border border-emerald-500/20 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
            <i className="fas fa-shield-alt text-xl"></i>
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 mb-2">Escrow Protection</h3>
            <p className="text-sm text-slate-400">
              Funds from ticket sales are held in escrow for 48 hours after your event ends. 
              This validation window allows customers to file disputes if needed. 
              Once the 48-hour period passes and there are no disputes, you can release funds to your account.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['All', 'Locked', 'Released', 'Refunded'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status.toLowerCase())}
            className={`cursor-pointer px-4 py-2 rounded-lg font-medium transition-all ${
              filter === status.toLowerCase()
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Escrow Accounts List */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 shadow-sm">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-100">Escrow Accounts ({filteredAccounts.length})</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {filteredAccounts.map((account) => (
              <div key={account.id} className="p-6 bg-slate-900/50 rounded-lg border border-slate-700">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-slate-100 text-lg">{account.event}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(account.status)}`}>
                      {account.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-100">XAF {account.lockedAmount.toLocaleString()}</div>
                    <div className="text-sm text-slate-400">Locked Amount</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-slate-400">Scan Rate</span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            account.scanRate >= 90 ? 'bg-green-500' :
                            account.scanRate >= 70 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${account.scanRate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-slate-100">{account.scanRate}%</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-slate-400">Disputes</span>
                    <div className="text-sm font-medium text-slate-100">{account.disputes}</div>
                  </div>
                  <div>
                    <span className="text-sm text-slate-400">Eligible for Release</span>
                    <div className="text-sm font-medium text-slate-100">
                      {account.eligible ? (
                        <span className="text-emerald-400"><i className="fas fa-check-circle mr-1"></i>Yes</span>
                      ) : (
                        <span className="text-slate-500"><i className="fas fa-clock mr-1"></i>No</span>
                      )}
                    </div>
                  </div>
                </div>
                {account.status === 'Locked' && account.eligible && (
                  <button
                    onClick={() => handleReleaseFunds(account.id)}
                    className="cursor-pointer w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all font-medium"
                  >
                    <i className="fas fa-unlock mr-2"></i>Release Funds
                  </button>
                )}
                {!account.eligible && account.status === 'Locked' && (
                  <div className="text-sm text-slate-500 text-center">
                    <i className="fas fa-info-circle mr-2"></i>
                    Funds will be eligible for release after 48-hour validation window
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredAccounts.length === 0 && (
            <div className="text-center py-12">
              <i className="fas fa-vault text-6xl text-slate-600 mb-4"></i>
              <h3 className="text-xl font-semibold text-slate-400 mb-2">No escrow accounts found</h3>
              <p className="text-slate-500">Try adjusting your filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
