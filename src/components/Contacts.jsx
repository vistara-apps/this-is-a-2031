import React, { useState } from 'react'
import { Users, Plus, Phone, Mail, Trash2, Check } from 'lucide-react'
import { RightsCard } from './RightsCard'

export function Contacts({ user, updateUser }) {
  const [isAdding, setIsAdding] = useState(false)
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    email: '',
    relationship: ''
  })

  const handleAddContact = (e) => {
    e.preventDefault()
    if (!newContact.name || !newContact.phone) return

    const contact = {
      id: Date.now().toString(),
      ...newContact,
      addedAt: new Date().toISOString()
    }

    const updatedContacts = [...user.selectedContacts, contact]
    updateUser({ selectedContacts: updatedContacts })
    
    setNewContact({ name: '', phone: '', email: '', relationship: '' })
    setIsAdding(false)
  }

  const handleRemoveContact = (contactId) => {
    const updatedContacts = user.selectedContacts.filter(c => c.id !== contactId)
    updateUser({ selectedContacts: updatedContacts })
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Emergency Contacts</h2>
        <p className="text-dark-muted">People who will be notified during emergencies</p>
      </div>

      {/* Add Contact Button */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full mb-6 py-4 border-2 border-dashed border-dark-border rounded-lg text-dark-muted hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Add Emergency Contact
        </button>
      )}

      {/* Add Contact Form */}
      {isAdding && (
        <RightsCard variant="stateSpecific" className="mb-6">
          <form onSubmit={handleAddContact} className="space-y-4">
            <h3 className="font-semibold text-white mb-4">Add New Contact</h3>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Name *
              </label>
              <input
                type="text"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-dark-muted focus:outline-none focus:border-primary"
                placeholder="Contact name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-dark-muted focus:outline-none focus:border-primary"
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email (Optional)
              </label>
              <input
                type="email"
                value={newContact.email}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-dark-muted focus:outline-none focus:border-primary"
                placeholder="contact@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Relationship
              </label>
              <select
                value={newContact.relationship}
                onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-primary"
              >
                <option value="">Select relationship</option>
                <option value="family">Family Member</option>
                <option value="friend">Friend</option>
                <option value="lawyer">Lawyer</option>
                <option value="colleague">Colleague</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 py-2 bg-primary text-white rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <Check size={16} />
                Add Contact
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="flex-1 py-2 bg-dark-border text-white rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </RightsCard>
      )}

      {/* Contact List */}
      <div className="space-y-4">
        {user.selectedContacts.length === 0 ? (
          <RightsCard variant="default">
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-dark-muted mx-auto mb-4" />
              <p className="text-dark-muted">No emergency contacts added</p>
              <p className="text-sm text-dark-muted mt-2">
                Add contacts who will be automatically notified during emergency recordings
              </p>
            </div>
          </RightsCard>
        ) : (
          user.selectedContacts.map((contact) => (
            <RightsCard key={contact.id} variant="default">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Users className="text-primary" size={20} />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium text-white">{contact.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone size={14} className="text-dark-muted" />
                    <span className="text-sm text-dark-muted">{contact.phone}</span>
                  </div>
                  {contact.email && (
                    <div className="flex items-center gap-2 mt-1">
                      <Mail size={14} className="text-dark-muted" />
                      <span className="text-sm text-dark-muted">{contact.email}</span>
                    </div>
                  )}
                  {contact.relationship && (
                    <span className="inline-block mt-2 px-2 py-1 bg-dark-bg text-dark-muted text-xs rounded">
                      {contact.relationship}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleRemoveContact(contact.id)}
                  className="p-2 text-dark-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </RightsCard>
          ))
        )}
      </div>

      {/* Info Section */}
      <RightsCard variant="stateSpecific" className="mt-6">
        <div className="space-y-3">
          <h3 className="font-semibold text-white">How Emergency Alerts Work</h3>
          <ul className="space-y-2 text-sm text-dark-muted">
            <li>• Contacts receive SMS and email notifications when you start recording</li>
            <li>• Alerts include your current location and timestamp</li>
            <li>• Messages are sent automatically - no additional action needed</li>
            <li>• Up to 5 contacts can be notified simultaneously</li>
            <li>• Consider adding a lawyer or legal aid contact</li>
          </ul>
        </div>
      </RightsCard>
    </div>
  )
}