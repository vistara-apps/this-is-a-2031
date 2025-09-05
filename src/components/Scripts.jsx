import React, { useState, useEffect } from 'react'
import { MessageSquare, Copy, Volume2, Sparkles, Loader, RefreshCw } from 'lucide-react'
import { RightsCard } from './RightsCard'
import { DataService } from '../services/dataService.js'

export function Scripts({ state, user }) {
  const [activeLanguage, setActiveLanguage] = useState('english')
  const [aiScripts, setAiScripts] = useState({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState('traffic_stop')

  const generateAIScripts = async (scenario) => {
    if (!user || !DataService.checkFeatureAccess(user, 'ai_scripts')) {
      alert('AI-generated scripts are a premium feature. Please upgrade your plan.')
      return
    }

    setIsGenerating(true)
    try {
      const result = await DataService.generateScripts(state, scenario, activeLanguage)
      
      if (result.success) {
        setAiScripts(prev => ({
          ...prev,
          [scenario]: {
            [activeLanguage]: result.data,
            ...(result.data.spanish && { spanish: result.data.spanish })
          }
        }))
        
        // Track usage
        await DataService.trackUsage(user.userId, 'ai_script_generated', {
          state,
          scenario,
          language: activeLanguage
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Error generating AI scripts:', error)
      alert('Failed to generate AI scripts. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const scripts = {
    english: {
      traffic_stop: {
        title: 'Traffic Stop',
        phrases: [
          'I am invoking my right to remain silent.',
          'I do not consent to any searches.',
          'Am I free to leave?',
          'I want to speak to a lawyer.',
          'I am recording this interaction for my safety.'
        ]
      },
      pedestrian_stop: {
        title: 'Pedestrian Stop',
        phrases: [
          'I am exercising my right to remain silent.',
          'I do not consent to a search.',
          'Am I being detained or am I free to go?',
          'I would like to speak to an attorney.',
          'I am not answering any questions without a lawyer present.'
        ]
      },
      home_visit: {
        title: 'Home Visit',
        phrases: [
          'I do not consent to entry without a warrant.',
          'I am exercising my right to remain silent.',
          'I want to see the warrant.',
          'I do not consent to any searches.',
          'I want to speak to my lawyer.'
        ]
      }
    },
    spanish: {
      traffic_stop: {
        title: 'Parada de Tráfico',
        phrases: [
          'Estoy invocando mi derecho a permanecer en silencio.',
          'No consiento a ningún registro.',
          '¿Soy libre de irme?',
          'Quiero hablar con un abogado.',
          'Estoy grabando esta interacción por mi seguridad.'
        ]
      },
      pedestrian_stop: {
        title: 'Parada Peatonal',
        phrases: [
          'Estoy ejerciendo mi derecho a permanecer en silencio.',
          'No consiento a un registro.',
          '¿Estoy siendo detenido o soy libre de irme?',
          'Me gustaría hablar con un abogado.',
          'No responderé preguntas sin un abogado presente.'
        ]
      },
      home_visit: {
        title: 'Visita Domiciliaria',
        phrases: [
          'No consiento la entrada sin una orden judicial.',
          'Estoy ejerciendo mi derecho a permanecer en silencio.',
          'Quiero ver la orden judicial.',
          'No consiento a ningún registro.',
          'Quiero hablar con mi abogado.'
        ]
      }
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    // Could add a toast notification here
  }

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = activeLanguage === 'spanish' ? 'es-ES' : 'en-US'
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">De-escalation Scripts</h2>
        <p className="text-dark-muted">Pre-written phrases for common police interactions</p>
      </div>

      {/* Language Toggle */}
      <div className="flex space-x-1 mb-6 bg-dark-surface p-1 rounded-lg">
        <button
          onClick={() => setActiveLanguage('english')}
          className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
            activeLanguage === 'english'
              ? 'bg-primary text-white'
              : 'text-dark-muted hover:text-white'
          }`}
        >
          English
        </button>
        <button
          onClick={() => setActiveLanguage('spanish')}
          className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
            activeLanguage === 'spanish'
              ? 'bg-primary text-white'
              : 'text-dark-muted hover:text-white'
          }`}
        >
          Español
        </button>
      </div>

      {/* AI-Generated Scripts */}
      {user && DataService.checkFeatureAccess(user, 'ai_scripts') && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Sparkles className="text-yellow-400" size={20} />
              AI-Generated Scripts for {state}
            </h3>
            <div className="flex gap-2">
              <select
                value={selectedScenario}
                onChange={(e) => setSelectedScenario(e.target.value)}
                className="bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="traffic_stop">Traffic Stop</option>
                <option value="pedestrian_stop">Pedestrian Stop</option>
                <option value="home_visit">Home Visit</option>
                <option value="arrest_situation">Arrest Situation</option>
              </select>
              <button
                onClick={() => generateAIScripts(selectedScenario)}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm font-medium hover:bg-yellow-500/30 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw size={16} />
                    Generate AI Scripts
                  </>
                )}
              </button>
            </div>
          </div>

          {aiScripts[selectedScenario] && aiScripts[selectedScenario][activeLanguage] && (
            <RightsCard variant="script">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-yellow-400" size={16} />
                  <span className="text-yellow-400 text-sm font-medium">AI-Generated for {selectedScenario.replace('_', ' ')}</span>
                </div>
                
                {aiScripts[selectedScenario][activeLanguage].whatToSay && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-green-400">✓ What to Say:</h4>
                    {aiScripts[selectedScenario][activeLanguage].whatToSay.map((phrase, index) => (
                      <div key={index} className="bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <p className="text-white text-sm leading-relaxed">{phrase}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => copyToClipboard(phrase)}
                              className="p-2 text-dark-muted hover:text-white hover:bg-dark-border rounded-md transition-colors"
                              title="Copy"
                            >
                              <Copy size={16} />
                            </button>
                            <button
                              onClick={() => speakText(phrase)}
                              className="p-2 text-dark-muted hover:text-white hover:bg-dark-border rounded-md transition-colors"
                              title="Listen"
                            >
                              <Volume2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {aiScripts[selectedScenario][activeLanguage].whatNotToSay && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-red-400">✗ What NOT to Say:</h4>
                    {aiScripts[selectedScenario][activeLanguage].whatNotToSay.map((phrase, index) => (
                      <div key={index} className="bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                        <p className="text-red-300 text-sm leading-relaxed">{phrase}</p>
                      </div>
                    ))}
                  </div>
                )}

                {aiScripts[selectedScenario][activeLanguage].bodyLanguage && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-blue-400">👤 Body Language Tips:</h4>
                    {aiScripts[selectedScenario][activeLanguage].bodyLanguage.map((tip, index) => (
                      <div key={index} className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                        <p className="text-blue-300 text-sm leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                )}

                {aiScripts[selectedScenario][activeLanguage].stateSpecific && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-purple-400">📍 {state}-Specific Notes:</h4>
                    {aiScripts[selectedScenario][activeLanguage].stateSpecific.map((note, index) => (
                      <div key={index} className="bg-purple-500/10 p-3 rounded-lg border border-purple-500/20">
                        <p className="text-purple-300 text-sm leading-relaxed">{note}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </RightsCard>
          )}
        </div>
      )}

      {/* Standard Scripts */}
      <div className="space-y-6">
        {Object.entries(scripts[activeLanguage]).map(([key, scenario]) => (
          <RightsCard key={key} variant="script">
            <div className="space-y-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <MessageSquare className="text-primary" size={20} />
                {scenario.title}
              </h3>
              
              <div className="space-y-3">
                {scenario.phrases.map((phrase, index) => (
                  <div 
                    key={index}
                    className="bg-dark-bg p-3 rounded-lg border border-dark-border"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className="text-white text-sm leading-relaxed">{phrase}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(phrase)}
                          className="p-2 text-dark-muted hover:text-white hover:bg-dark-border rounded-md transition-colors"
                          title="Copy"
                        >
                          <Copy size={16} />
                        </button>
                        <button
                          onClick={() => speakText(phrase)}
                          className="p-2 text-dark-muted hover:text-white hover:bg-dark-border rounded-md transition-colors"
                          title="Listen"
                        >
                          <Volume2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </RightsCard>
        ))}
      </div>

      {/* Usage Tips */}
      <RightsCard variant="stateSpecific" className="mt-6">
        <div className="space-y-3">
          <h3 className="font-semibold text-white">Usage Tips</h3>
          <ul className="space-y-2 text-sm text-dark-muted">
            <li>• Speak clearly and calmly</li>
            <li>• Repeat phrases as necessary</li>
            <li>• Stay respectful but firm</li>
            <li>• Practice these phrases beforehand</li>
            <li>• Use the audio feature to learn proper pronunciation</li>
          </ul>
        </div>
      </RightsCard>
    </div>
  )
}
