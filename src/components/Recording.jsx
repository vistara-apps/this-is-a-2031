import React, { useState, useRef, useEffect } from 'react'
import { Video, Square, Users, MapPin, Clock, AlertTriangle } from 'lucide-react'
import { RightsCard } from './RightsCard'
import { RecordButton } from './RecordButton'

export function Recording({ user, updateUser }) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [recordings, setRecordings] = useState([])
  const intervalRef = useRef(null)

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date().toISOString()
          })
        },
        (error) => {
          console.log('Location access denied:', error)
        }
      )
    }
  }, [])

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }

    return () => clearInterval(intervalRef.current)
  }, [isRecording])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      })
      
      const recorder = new MediaRecorder(stream)
      const chunks = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        
        const newRecording = {
          recordingId: Date.now().toString(),
          userId: user.userId,
          timestamp: new Date().toISOString(),
          filePath: url,
          location: currentLocation,
          sharedWith: [],
          duration: recordingTime,
          createdAt: new Date().toISOString()
        }
        
        setRecordings(prev => [newRecording, ...prev])
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
      setRecordingTime(0)
      
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Unable to access camera/microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop()
      setIsRecording(false)
      setMediaRecorder(null)
    }
  }

  const alertContacts = () => {
    if (user.selectedContacts.length === 0) {
      alert('No emergency contacts set up. Please add contacts in Settings.')
      return
    }

    // Simulate sending alerts to contacts
    const alertMessage = `ALERT: ${user.userId} has activated RightGuard emergency recording at ${currentLocation ? `${currentLocation.latitude}, ${currentLocation.longitude}` : 'unknown location'} at ${new Date().toLocaleString()}`
    
    console.log('Sending alert to contacts:', alertMessage)
    alert(`Alert sent to ${user.selectedContacts.length} contact(s)`)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Emergency Recording</h2>
        <p className="text-dark-muted">One-tap documentation and contact alerts</p>
      </div>

      {/* Recording Controls */}
      <RightsCard variant="stateSpecific" className="mb-6">
        <div className="text-center space-y-6">
          {isRecording && (
            <div className="flex items-center justify-center gap-2 text-red-400">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse-red"></div>
              <span className="text-lg font-mono">{formatTime(recordingTime)}</span>
            </div>
          )}

          <RecordButton
            variant={isRecording ? 'active' : 'primary'}
            isRecording={isRecording}
            onStart={startRecording}
            onStop={stopRecording}
          />

          {isRecording && (
            <div className="space-y-3">
              <button
                onClick={alertContacts}
                className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Users size={20} />
                Alert Emergency Contacts ({user.selectedContacts.length})
              </button>
              
              {currentLocation && (
                <div className="flex items-center justify-center gap-2 text-dark-muted text-sm">
                  <MapPin size={16} />
                  <span>Location tracked</span>
                </div>
              )}
            </div>
          )}

          {!isRecording && (
            <div className="space-y-4">
              <div className="bg-dark-bg p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-yellow-500 flex-shrink-0 mt-1" size={20} />
                  <div className="text-left">
                    <h4 className="font-medium text-white mb-1">Important Notes</h4>
                    <ul className="text-sm text-dark-muted space-y-1">
                      <li>• Recording laws vary by state</li>
                      <li>• This may alert officers to your recording</li>
                      <li>• Keep your device visible and avoid sudden movements</li>
                      <li>• Recording will continue in background</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {user.selectedContacts.length === 0 && (
                <div className="bg-yellow-500/20 border border-yellow-500/30 p-3 rounded-lg">
                  <p className="text-yellow-400 text-sm">
                    Add emergency contacts in Settings to enable automatic alerts
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </RightsCard>

      {/* Recent Recordings */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Recent Recordings</h3>
        {recordings.length === 0 ? (
          <RightsCard variant="default">
            <div className="text-center py-8">
              <Video className="w-12 h-12 text-dark-muted mx-auto mb-4" />
              <p className="text-dark-muted">No recordings yet</p>
            </div>
          </RightsCard>
        ) : (
          <div className="space-y-4">
            {recordings.map((recording) => (
              <RightsCard key={recording.recordingId} variant="default">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-dark-bg rounded-lg flex items-center justify-center">
                    <Video className="text-primary" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock size={16} className="text-dark-muted" />
                      <span className="text-white font-medium">
                        {formatTime(recording.duration)}
                      </span>
                    </div>
                    <p className="text-sm text-dark-muted">
                      {new Date(recording.timestamp).toLocaleString()}
                    </p>
                    {recording.location && (
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin size={12} className="text-dark-muted" />
                        <span className="text-xs text-dark-muted">Location saved</span>
                      </div>
                    )}
                  </div>
                  <button className="px-4 py-2 bg-primary/20 text-primary rounded-lg text-sm">
                    Share
                  </button>
                </div>
              </RightsCard>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}