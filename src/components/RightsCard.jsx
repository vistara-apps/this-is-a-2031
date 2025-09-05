import React from 'react'

export function RightsCard({ children, variant = 'default', onClick, className = '' }) {
  const baseClasses = 'bg-dark-surface border border-dark-border rounded-lg transition-all duration-200'
  
  const variantClasses = {
    default: 'p-4',
    stateSpecific: 'p-6',
    script: 'p-4',
    quickAction: 'p-4 hover:bg-dark-border/30 cursor-pointer'
  }

  const handleClick = () => {
    if (onClick) onClick()
  }

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={handleClick}
    >
      {children}
    </div>
  )
}