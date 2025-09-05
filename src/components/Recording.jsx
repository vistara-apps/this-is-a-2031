import React, { useState, useRef, useEffect } from 'react'
import { Video, Square, Users, MapPin, Clock, AlertTriangle, Upload, Share } from 'lucide-react'
import { RightsCard } from './RightsCard'
import { RecordButton } from './RecordButton'
import { DataService } from '../services/dataService.js'
import { PinataService } from '../services/pinata.js'

export function Recording({ user, updateUser }) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [recordings, setRecordings] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
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

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        
        const newRecording = {
          recordingId: Date.now().toString(),
          userId: user.userId,
          timestamp: new Date().toISOString(),
          filePath: url,
          blob: blob,
          location: currentLocation,
          sharedWith: [],
          duration: recordingTime,
          createdAt: new Date().toISOString()
        }
        
        setRecordings(prev => [newRecording, ...prev])
        
        // Save recording with enhanced features
        try {
          const hasIPFSAccess = DataService.checkFeatureAccess(user, 'ipfs_storage')
          const result = await DataService.saveRecording(newRecording, hasIPFSAccess)
          
          if (result.success) {
            console.log('Recording saved successfully:', result.data)
            
            // Track usage
            await DataService.trackUsage(user.userId, 'recording_created', {
              duration: recordingTime,
              hasLocation: !!currentLocation,
              ipfsEnabled: hasIPFSAccess
            })
          }
        } catch (error) {
          console.error('Error saving recording:', error)
        }
        
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

  const alertContacts = async () => {
    if (user.selectedContacts.length === 0) {
      alert('No emergency contacts set up. Please add contacts in Settings.')
      return
    }

    try {
      const result = await DataService.sendContactAlerts(
        user, 
        currentLocation, 
        isRecording ? 'active_recording' : null
      )
      
      if (result.success) {
        alert(`Alert sent to ${result.data.alertsSent} contact(s)`)
        
        // Track usage
        await DataService.trackUsage(user.userId, 'contact_alert_sent', {
          contactCount: result.data.alertsSent,
          hasLocation: !!currentLocation
        })
      } else {
        alert(`Error sending alerts: ${result.error}`)
      }
    } catch (error) {
      console.error('Error sending contact alerts:', error)
      alert('Failed to send alerts. Please try again.')
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const uploadToIPFS = async (recording) => {
    if (!DataService.checkFeatureAccess(user, 'ipfs_storage')) {
      alert('IPFS storage is a premium feature. Please upgrade your plan.')
      return
    }

    setIsUploading(true)
    setUploadProgress(prev => ({ ...prev, [recording.recordingId]: 0 }))

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => ({
          ...prev,
          [recording.recordingId]: Math.min((prev[recording.recordingId] || 0) + 10, 90)
        }))
      }, 200)

      const result = await PinataService.uploadFile(recording.blob, {
        name: `recording_${recording.recordingId}`,
        userId: user.userId,
        timestamp: recording.timestamp
      })

      clearInterval(progressInterval)

      if (result.success) {
        setUploadProgress(prev => ({ ...prev, [recording.recordingId]: 100 }))
        
        // Update recording with IPFS data
        const updatedRecordings = recordings.map(r => 
          r.recordingId === recording.recordingId 
            ? { ...r, ipfsHash: result.data.ipfsHash, ipfsUrl: result.data.url }
            : r
        )
        setRecordings(updatedRecordings)

        alert('Recording uploaded to IPFS successfully!')
        
        // Track usage
        await DataService.trackUsage(user.userId, 'ipfs_upload', {
          recordingId: recording.recordingId,
          fileSize: recording.blob.size
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Error uploading to IPFS:', error)
      alert('Failed to upload to IPFS. Please try again.')
    } finally {
      setIsUploading(false)
      setTimeout(() => {
        setUploadProgress(prev => {
          const newProgress = { ...prev }
          delete newProgress[recording.recordingId]
          return newProgress
        })
      }, 2000)
    }
  }

  const generateSummary = async (recording) => {
    if (!DataService.checkFeatureAccess(user, 'ai_scripts')) {
      alert('AI-generated summaries are a premium feature. Please upgrade your plan.')
      return
    }

    try {
      const result = await DataService.generateRecordingSummary(recording)
      
      if (result.success) {
        // Show summary in a modal or alert
        const summaryText = result.data.summary
        const shareableUrl = result.data.shareableUrl
        
        const message = `Recording Summary:\n\n${summaryText}\n\n${shareableUrl ? `Shareable link: ${shareableUrl}` : ''}`
        
        // In a real app, you'd show this in a proper modal
        alert(message)
        
        // Track usage
        await DataService.trackUsage(user.userId, 'summary_generated', {
          recordingId: recording.recordingId
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Error generating summary:', error)
      alert('Failed to generate summary. Please try again.')
    }
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
                <div className="space-y-4">
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
                        {recording.ipfsHash && (
                          <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                            IPFS
                          </div>
                        )}
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
                  </div>

                  {/* Upload Progress */}
                  {uploadProgress[recording.recordingId] !== undefined && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-dark-muted">Uploading to IPFS...</span>
                        <span className="text-primary">{uploadProgress[recording.recordingId]}%</span>
                      </div>
                      <div className="w-full bg-dark-border rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress[recording.recordingId]}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => generateSummary(recording)}
                      className="flex-1 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Share size={16} />
                      Generate Summary
                    </button>
                    
                    {!recording.ipfsHash && (
                      <button 
                        onClick={() => uploadToIPFS(recording)}
                        disabled={isUploading}
                        className="flex-1 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Upload size={16} />
                        Upload to IPFS
                      </button>
                    )}
                    
                    {recording.ipfsUrl && (
                      <button 
                        onClick={() => window.open(recording.ipfsUrl, '_blank')}
                        className="flex-1 py-2 bg-primary/20 text-primary rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <Share size={16} />
                        View on IPFS
                      </button>
                    )}
                  </div>
                </div>
              </RightsCard>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
