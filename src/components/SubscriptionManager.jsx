import React, { useState } from 'react'
import { Crown, Check, Loader, CreditCard, Shield, Zap } from 'lucide-react'
import { RightsCard } from './RightsCard'
import { StripeService } from '../services/stripe.js'
import { DataService } from '../services/dataService.js'

export function SubscriptionManager({ user, updateUser, onClose }) {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const plans = StripeService.getPricingPlans()

  const handleUpgrade = async (planId) => {
    if (planId === 'free' || planId === user.subscriptionStatus) return

    setIsProcessing(true)
    setError(null)
    setSelectedPlan(planId)

    try {
      const result = await DataService.upgradeSubscription(user.userId, planId)
      
      if (result.success) {
        // Update user in parent component
        updateUser({
          subscriptionStatus: planId,
          subscriptionId: result.data.payment.paymentId,
          subscriptionUpdatedAt: new Date().toISOString()
        })
        
        setSuccess(true)
        
        // Track usage
        await DataService.trackUsage(user.userId, 'subscription_upgrade', {
          plan: planId,
          amount: plans[planId].price
        })
        
        setTimeout(() => {
          onClose && onClose()
        }, 2000)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const PlanCard = ({ plan, planId, isCurrentPlan, isPopular }) => (
    <RightsCard 
      variant="default" 
      className={`relative ${isCurrentPlan ? 'ring-2 ring-primary' : ''} ${isPopular ? 'ring-2 ring-yellow-500' : ''}`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
            MOST POPULAR
          </div>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${
              planId === 'free' ? 'bg-gray-500/20 text-gray-400' :
              planId === 'premium' ? 'bg-blue-500/20 text-blue-400' :
              'bg-yellow-500/20 text-yellow-400'
            }`}>
              {planId === 'free' ? <Shield size={20} /> :
               planId === 'premium' ? <Crown size={20} /> :
               <Zap size={20} />}
            </div>
            <h3 className="text-xl font-bold text-white">{plan.name}</h3>
          </div>
          
          {isCurrentPlan && (
            <div className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-medium">
              CURRENT
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-white">${plan.price}</span>
            {plan.interval && (
              <span className="text-dark-muted">/{plan.interval}</span>
            )}
          </div>
          {plan.interval === 'one-time' && (
            <p className="text-sm text-green-400">One-time payment</p>
          )}
        </div>

        <div className="space-y-3 mb-6">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <Check size={16} className="text-green-400 flex-shrink-0" />
              <span className="text-sm text-dark-muted">{feature}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2 mb-6 p-3 bg-dark-bg rounded-lg">
          <h4 className="text-sm font-medium text-white">Limits:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-dark-muted">
            <div>Recordings: {plan.limitations.recordings}</div>
            <div>Storage: {plan.limitations.storage}</div>
            <div>Contacts: {plan.limitations.contacts}</div>
          </div>
        </div>

        <button
          onClick={() => handleUpgrade(planId)}
          disabled={isCurrentPlan || isProcessing || planId === 'free'}
          className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
            isCurrentPlan 
              ? 'bg-dark-border text-dark-muted cursor-not-allowed'
              : planId === 'free'
              ? 'bg-dark-border text-dark-muted cursor-not-allowed'
              : isProcessing && selectedPlan === planId
              ? 'bg-primary/50 text-white cursor-not-allowed'
              : 'bg-primary hover:bg-primary/80 text-white'
          }`}
        >
          {isProcessing && selectedPlan === planId ? (
            <>
              <Loader size={16} className="animate-spin" />
              Processing...
            </>
          ) : isCurrentPlan ? (
            'Current Plan'
          ) : planId === 'free' ? (
            'Free Plan'
          ) : (
            <>
              <CreditCard size={16} />
              Upgrade to {plan.name}
            </>
          )}
        </button>
      </div>
    </RightsCard>
  )

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <RightsCard variant="default" className="max-w-md w-full">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Upgrade Successful!</h3>
            <p className="text-dark-muted mb-4">
              Welcome to {plans[selectedPlan]?.name}! You now have access to all premium features.
            </p>
            <button
              onClick={onClose}
              className="w-full py-2 bg-primary text-white rounded-lg"
            >
              Continue
            </button>
          </div>
        </RightsCard>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="max-w-4xl w-full my-8">
        <div className="bg-dark-surface rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Choose Your Plan</h2>
              <p className="text-dark-muted">Upgrade to unlock premium features and unlimited access</p>
            </div>
            <button
              onClick={onClose}
              className="text-dark-muted hover:text-white"
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6">
            <PlanCard 
              plan={plans.free} 
              planId="free" 
              isCurrentPlan={user.subscriptionStatus === 'free'} 
            />
            <PlanCard 
              plan={plans.premium} 
              planId="premium" 
              isCurrentPlan={user.subscriptionStatus === 'premium'}
              isPopular={true}
            />
            <PlanCard 
              plan={plans.lifetime} 
              planId="lifetime" 
              isCurrentPlan={user.subscriptionStatus === 'lifetime'} 
            />
          </div>

          <div className="mt-8 p-4 bg-dark-bg rounded-lg">
            <h3 className="font-medium text-white mb-2">Why Upgrade?</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-dark-muted">
              <div className="flex items-start gap-2">
                <Shield size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Enhanced Protection:</strong> Unlimited recordings and IPFS storage ensure your evidence is always preserved.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Zap size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">AI-Powered Scripts:</strong> Get personalized de-escalation scripts generated for your specific situation.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-dark-muted">
              All payments are processed securely. Cancel anytime. 30-day money-back guarantee.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionManager
