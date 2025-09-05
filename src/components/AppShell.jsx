import React from 'react'
import { 
  Home, 
  Shield, 
  MessageSquare, 
  Video, 
  Users, 
  Settings 
} from 'lucide-react'

export function AppShell({ children, currentView, onViewChange }) {
  const navigationItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'rights', icon: Shield, label: 'Rights' },
    { id: 'scripts', icon: MessageSquare, label: 'Scripts' },
    { id: 'recording', icon: Video, label: 'Record' },
    { id: 'contacts', icon: Users, label: 'Contacts' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ]

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      {/* Header */}
      <header className="bg-dark-surface border-b border-dark-border p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-bold text-white">RightGuard</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-dark-surface border-t border-dark-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around py-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = currentView === item.id
              
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'text-primary bg-primary/10' 
                      : 'text-dark-muted hover:text-white hover:bg-dark-border/50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-xs mt-1">{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}