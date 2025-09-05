import React, { useState } from 'react'
import { 
  Settings as SettingsIcon, 
  MapPin, 
  Crown, 
  Bell, 
  Shield, 
  Smartphone,
  ChevronRight,
  Check
} from 'lucide-react'
import { RightsCard } from './RightsCard'

export function Settings({ user, updateUser, onStateChange }) {
  const [notifications, setNotifications] = useState(true)
  const [autoRecord, setAutoRecord] = useState(false)

  const handleNotificationToggle = () => {
    setNotifications(!notifications)
  }

  const handleAutoRecordToggle = () => {
    setAutoRecord(!autoRecord)
  }

  const settingSections = [
    {
      title: 'Account & Location',
      items: [
        {
          icon: MapPin,
          title: 'Current State',
          subtitle: user.currentState,
          action: () => {
            const newState = prompt('Enter new state:', user.currentState)
            if (newState && newState !== user.currentState) {
              onStateChange(newState)
            }
          }
        },
        {
          icon: Crown,
          title: 'Subscription',
          subtitle: user.subscriptionStatus === 'free' ? 'Free Plan' : 'Premium Plan',
          action: () => alert('Subscription management coming soon!')
        }
      ]
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          icon: Bell,
          title: 'Push Notifications',
          subtitle: notifications ? 'Enabled' : 'Disabled',
          toggle: true,
          value: notifications,
          onChange: handleNotificationToggle
        },
        {
          icon: Smartphone,
          title: 'Auto-Record on Launch',
          subtitle: autoRecord ? 'Enabled' : 'Disabled',
          toggle: true,
          value: autoRecord,
          onChange: handleAutoRecordToggle
        }
      ]
    },
    {
      title: 'Legal & Support',
      items: [
        {
          icon: Shield,
          title: 'Privacy Policy',
          subtitle: 'How we protect your data',
          action: () => alert('Privacy policy would open here')
        },
        {
          icon: SettingsIcon,
          title: 'Terms of Service',
          subtitle: 'Usage terms and conditions',
          action: () => alert('Terms of service would open here')
        }
      ]
    }
  ]

  const ToggleSwitch = ({ enabled, onChange }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-primary' : 'bg-dark-border'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
        <p className="text-dark-muted">Manage your account and app preferences</p>
      </div>

      {/* Account Summary */}
      <RightsCard variant="stateSpecific" className="mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
            <Shield className="text-primary" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white">Account Status</h3>
            <p className="text-dark-muted text-sm">
              {user.subscriptionStatus === 'free' ? 'Free Account' : 'Premium Account'}
            </p>
            <p className="text-dark-muted text-sm">
              Active in {user.currentState}
            </p>
          </div>
          {user.subscriptionStatus === 'free' && (
            <button className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white rounded-lg font-medium">
              Upgrade
            </button>
          )}
        </div>
      </RightsCard>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h3 className="text-lg font-semibold text-white mb-4">{section.title}</h3>
            <div className="space-y-2">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon
                return (
                  <RightsCard key={itemIndex} variant="default">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-dark-bg rounded-lg flex items-center justify-center">
                        <Icon className="text-primary" size={20} />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{item.title}</h4>
                        <p className="text-sm text-dark-muted">{item.subtitle}</p>
                      </div>

                      {item.toggle ? (
                        <ToggleSwitch 
                          enabled={item.value} 
                          onChange={item.onChange} 
                        />
                      ) : (
                        <button 
                          onClick={item.action}
                          className="text-dark-muted hover:text-white"
                        >
                          <ChevronRight size={20} />
                        </button>
                      )}
                    </div>
                  </RightsCard>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* App Info */}
      <RightsCard variant="default" className="mt-6">
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-white">RightGuard</h3>
          <p className="text-sm text-dark-muted">Version 1.0.0</p>
          <p className="text-xs text-dark-muted">
            Built to protect and empower citizens during police interactions
          </p>
        </div>
      </RightsCard>
    </div>
  )
}