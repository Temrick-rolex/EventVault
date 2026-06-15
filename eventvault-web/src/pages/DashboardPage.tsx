import { useState } from 'react'
import DashboardLayout from '../dashboards/organizer/DashboardLayout'
import DashboardHome from '../dashboards/organizer/DashboardHome'
import EventsManagement from '../dashboards/organizer/EventsManagement'
import CreateEvent from '../dashboards/organizer/CreateEvent'
import TicketTiers from '../dashboards/organizer/TicketTiers'
import AIArtworkGenerator from '../dashboards/organizer/AIArtworkGenerator'
import VerificationAgents from '../dashboards/organizer/VerificationAgents'
import EscrowPayouts from '../dashboards/organizer/EscrowPayouts'
import Analytics from '../dashboards/organizer/Analytics'
import Settings from '../dashboards/organizer/Settings'

function DashboardPage() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardHome />
      case 'events':
        return <EventsManagement />
      case 'create-event':
        return <CreateEvent />
      case 'ticket-tiers':
        return <TicketTiers />
      case 'ai-artwork':
        return <AIArtworkGenerator />
      case 'agents':
        return <VerificationAgents />
      case 'escrow':
        return <EscrowPayouts />
      case 'analytics':
        return <Analytics />
      case 'settings':
        return <Settings />
      default:
        return <DashboardHome />
    }
  }

  return (
    <DashboardLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </DashboardLayout>
  )
}

export default DashboardPage
