import React from 'react'
import { Video, Square } from 'lucide-react'

export function RecordButton({ 
  variant = 'primary', 
  isRecording = false, 
  onStart, 
  onStop, 
  className = '' 
}) {
  const handleClick = () => {
    if (isRecording) {
      onStop()
    } else {
      onStart()
    }
  }

  const variants = {
    primary: 'w-24 h-24 bg-red-600 hover:bg-red-700 text-white',
    discreet: 'w-16 h-16 bg-gray-600 hover:bg-gray-700 text-white',
    active: 'w-24 h-24 bg-red-500 text-white animate-pulse-red'
  }

  return (
    <button
      onClick={handleClick}
      className={`${variants[variant]} rounded-full transition-all duration-200 flex items-center justify-center ${className}`}
    >
      {isRecording ? (
        <Square size={variant === 'discreet' ? 20 : 32} fill="currentColor" />
      ) : (
        <Video size={variant === 'discreet' ? 20 : 32} />
      )}
    </button>
  )
}