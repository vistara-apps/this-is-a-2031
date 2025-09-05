import React from 'react'
import { Shield, MessageSquare, Video, Users, Crown, ChevronRight } from 'lucide-react'
import { RightsCard } from './RightsCard'

export function Dashboard({ user, onViewChange, onUpgrade }) {
  const quickActions = [
    {
      id: 'rights',
      title: 'Your Rights',
      subtitle: `${user.currentState} Legal Guide`,
      description: 'Quick access to your state-specific rights and protections.',
      icon: Shield,
      color: 'bg-blue-500/20 text-blue-400',
      action: () => onViewChange('rights')
    },
    {
      id: 'scripts',
      title: "Do's and Don'ts",
      subtitle: 'De-Escalation Scripts',
      description: 'Pre-written scripts in English and Spanish for common interactions.',
      icon: MessageSquare,
      color: 'bg-green-500/20 text-green-400',
      action: () => onViewChange('scripts')
    },
    {
      id: 'recording',
      title: 'Quick Record',
      subtitle: 'One-Tap Documentation',
      description: 'Discreet recording with automatic contact alerts.',
      icon: Video,
      color: 'bg-red-500/20 text-red-400',
      action: () => onViewChange('recording')
    }
  ]

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Dashboard</h2>
            <p className="text-dark-muted">Current location: {user.currentState}</p>
          </div>
          {user.subscriptionStatus === 'free' && (
            <button 
              onClick={onUpgrade}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white rounded-lg font-medium hover:from-yellow-700 hover:to-yellow-600 transition-colors"
            >
              <Crown size={16} />
              Upgrade
            </button>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 mb-6">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <RightsCard
              key={action.id}
              variant="quickAction"
              onClick={action.action}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${action.color}`}>
                  <Icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{action.title}</h3>
                  <p className="text-sm text-primary">{action.subtitle}</p>
                  <p className="text-xs text-dark-muted mt-1">{action.description}</p>
                </div>
                <ChevronRight className="text-dark-muted" size={20} />
              </div>
            </RightsCard>
          )
        })}
      </div>

      {/* State-Specific Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">State-Specific Information</h3>
        <RightsCard variant="stateSpecific">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-white mb-2">Key Rights in {user.currentState}</h4>
              <ul className="space-y-2 text-sm text-dark-muted">
                <li>• Right to remain silent</li>
                <li>• Right to refuse consent to search</li>
                <li>• Right to ask if you're free to leave</li>
                <li>• Right to record police interactions (public spaces)</li>
              </ul>
            </div>
            <button 
              onClick={() => onViewChange('rights')}
              className="w-full py-2 bg-primary/20 text-primary rounded-lg text-sm font-medium"
            >
              View Complete Guide
            </button>
          </div>
        </RightsCard>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
          <div className="text-center py-8">
            <Video className="w-12 h-12 text-dark-muted mx-auto mb-4" />
            <p className="text-dark-muted">No recent recordings</p>
            <button 
              onClick={() => onViewChange('recording')}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm"
            >
              Start First Recording
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
