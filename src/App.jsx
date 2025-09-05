import React, { useState, useEffect } from 'react'
import { AppShell } from './components/AppShell'
import { Dashboard } from './components/Dashboard'
import { RightsGuide } from './components/RightsGuide'
import { Scripts } from './components/Scripts'
import { Recording } from './components/Recording'
import { Contacts } from './components/Contacts'
import { Settings } from './components/Settings'
import { StateSelector } from './components/StateSelector'
import { SubscriptionManager } from './components/SubscriptionManager'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [user, setUser] = useState({
    userId: 'user_1',
    currentState: null,
    selectedContacts: [],
    subscriptionStatus: 'free',
    createdAt: new Date().toISOString()
  })
  const [isFirstTime, setIsFirstTime] = useState(true)
  const [showSubscriptionManager, setShowSubscriptionManager] = useState(false)

  useEffect(() => {
    // Check if user has selected a state before
    const savedState = localStorage.getItem('rightguard_state')
    const savedUser = localStorage.getItem('rightguard_user')
    
    if (savedState && savedUser) {
      setUser(JSON.parse(savedUser))
      setIsFirstTime(false)
    }
  }, [])

  const handleStateSelect = (state) => {
    const updatedUser = { ...user, currentState: state }
    setUser(updatedUser)
    localStorage.setItem('rightguard_state', state)
    localStorage.setItem('rightguard_user', JSON.stringify(updatedUser))
    setIsFirstTime(false)
  }

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('rightguard_user', JSON.stringify(updatedUser))
  }

  if (isFirstTime || !user.currentState) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">RightGuard</h1>
            <p className="text-dark-muted">Know Your Rights, Stay Safe, Document Everything.</p>
          </div>
          <StateSelector onSelect={handleStateSelect} />
        </div>
      </div>
    )
  }

  return (
    <AppShell currentView={currentView} onViewChange={setCurrentView}>
      {currentView === 'dashboard' && <Dashboard user={user} onViewChange={setCurrentView} onUpgrade={() => setShowSubscriptionManager(true)} />}
      {currentView === 'rights' && <RightsGuide state={user.currentState} />}
      {currentView === 'scripts' && <Scripts state={user.currentState} user={user} />}
      {currentView === 'recording' && <Recording user={user} updateUser={updateUser} />}
      {currentView === 'contacts' && <Contacts user={user} updateUser={updateUser} />}
      {currentView === 'settings' && <Settings user={user} updateUser={updateUser} onStateChange={handleStateSelect} />}
      
      {/* Subscription Manager Modal */}
      {showSubscriptionManager && (
        <SubscriptionManager 
          user={user} 
          updateUser={updateUser} 
          onClose={() => setShowSubscriptionManager(false)} 
        />
      )}
    </AppShell>
  )
}

export default App
