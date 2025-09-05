import React, { useState } from 'react'
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { RightsCard } from './RightsCard'

export function RightsGuide({ state }) {
  const [activeTab, setActiveTab] = useState('rights')

  const tabs = [
    { id: 'rights', label: 'Your Rights', icon: Shield },
    { id: 'dos', label: "Do's", icon: CheckCircle },
    { id: 'donts', label: "Don'ts", icon: XCircle }
  ]

  const rightsContent = {
    rights: [
      {
        title: 'Right to Remain Silent',
        description: 'You have the constitutional right to remain silent. You are not required to answer questions beyond providing basic identification when legally required.',
        important: true
      },
      {
        title: 'Right to Refuse Searches',
        description: 'You can refuse consent to search your person, belongings, car, or home unless they have a warrant or probable cause.',
        important: true
      },
      {
        title: 'Right to Record',
        description: `In ${state}, you generally have the right to record police interactions in public spaces where you have a legal right to be present.`,
        important: false
      },
      {
        title: 'Right to Ask if Free to Leave',
        description: 'You have the right to ask if you are free to leave. If yes, you may calmly walk away.',
        important: false
      }
    ],
    dos: [
      'Keep your hands visible at all times',
      'Remain calm and speak respectfully',
      'Ask "Am I free to leave?" if unclear about detention',
      'Say "I invoke my right to remain silent"',
      'Ask for a lawyer if arrested',
      'Record the interaction if legally permitted',
      'Comply with lawful orders while maintaining your rights'
    ],
    donts: [
      'Never resist, even if you believe the stop is unfair',
      "Don't argue, fight, or flee",
      "Don't consent to searches",
      "Don't answer questions beyond basic identification",
      "Don't touch or threaten officers",
      "Don't make sudden movements",
      "Don't volunteer information"
    ]
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Legal Rights Guide</h2>
        <p className="text-dark-muted">State-specific information for {state}</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-dark-surface p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'text-dark-muted hover:text-white'
              }`}
            >
              <Icon size={16} />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'rights' && (
          <>
            {rightsContent.rights.map((right, index) => (
              <RightsCard key={index} variant="stateSpecific">
                <div className="flex items-start gap-3">
                  {right.important && (
                    <AlertTriangle className="text-yellow-500 mt-1 flex-shrink-0" size={20} />
                  )}
                  <div>
                    <h3 className="font-semibold text-white mb-2">{right.title}</h3>
                    <p className="text-dark-muted text-sm leading-relaxed">{right.description}</p>
                  </div>
                </div>
              </RightsCard>
            ))}
          </>
        )}

        {activeTab === 'dos' && (
          <RightsCard variant="stateSpecific">
            <div className="space-y-3">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <CheckCircle className="text-green-500" size={20} />
                What You Should Do
              </h3>
              <ul className="space-y-3">
                {rightsContent.dos.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-dark-muted text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </RightsCard>
        )}

        {activeTab === 'donts' && (
          <RightsCard variant="stateSpecific">
            <div className="space-y-3">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <XCircle className="text-red-500" size={20} />
                What You Should Avoid
              </h3>
              <ul className="space-y-3">
                {rightsContent.donts.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-dark-muted text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </RightsCard>
        )}
      </div>

      {/* Emergency Note */}
      <RightsCard variant="stateSpecific" className="mt-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-yellow-500 flex-shrink-0" size={20} />
          <div>
            <h3 className="font-semibold text-white mb-2">Important Legal Disclaimer</h3>
            <p className="text-dark-muted text-sm">
              This information is for educational purposes only and should not be considered legal advice. 
              Laws may vary by jurisdiction within {state}. Always consult with a qualified attorney for 
              specific legal guidance.
            </p>
          </div>
        </div>
      </RightsCard>
    </div>
  )
}