import { loadStripe } from '@stripe/stripe-js'
import { API_CONFIG } from '../config/api.js'

// Initialize Stripe
const stripePromise = loadStripe(API_CONFIG.stripe.publishableKey)

export class StripeService {
  // Initialize payment for subscription
  static async createSubscription(priceId, customerId = null) {
    try {
      const stripe = await stripePromise
      
      // In a real app, this would call your backend API
      const response = await fetch('/api/stripe/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          customerId
        })
      })

      const { clientSecret, subscriptionId } = await response.json()

      if (!clientSecret) {
        throw new Error('Failed to create subscription')
      }

      return {
        success: true,
        data: {
          clientSecret,
          subscriptionId,
          stripe
        }
      }
    } catch (error) {
      console.error('Error creating subscription:', error)
      return { success: false, error: error.message }
    }
  }

  // Create one-time payment intent
  static async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
    try {
      const stripe = await stripePromise
      
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          currency,
          metadata
        })
      })

      const { clientSecret } = await response.json()

      if (!clientSecret) {
        throw new Error('Failed to create payment intent')
      }

      return {
        success: true,
        data: {
          clientSecret,
          stripe
        }
      }
    } catch (error) {
      console.error('Error creating payment intent:', error)
      return { success: false, error: error.message }
    }
  }

  // Confirm payment
  static async confirmPayment(stripe, clientSecret, paymentMethod) {
    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod
      })

      if (error) {
        throw error
      }

      return {
        success: true,
        data: paymentIntent
      }
    } catch (error) {
      console.error('Error confirming payment:', error)
      return { success: false, error: error.message }
    }
  }

  // Get subscription status
  static async getSubscriptionStatus(customerId) {
    try {
      const response = await fetch(`/api/stripe/subscription-status/${customerId}`)
      const data = await response.json()

      return {
        success: true,
        data
      }
    } catch (error) {
      console.error('Error getting subscription status:', error)
      return { success: false, error: error.message }
    }
  }

  // Cancel subscription
  static async cancelSubscription(subscriptionId) {
    try {
      const response = await fetch(`/api/stripe/cancel-subscription/${subscriptionId}`, {
        method: 'POST'
      })
      
      const data = await response.json()

      return {
        success: true,
        data
      }
    } catch (error) {
      console.error('Error canceling subscription:', error)
      return { success: false, error: error.message }
    }
  }

  // Mock payment for demo purposes
  static async mockPayment(amount, type = 'subscription') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            paymentId: `mock_${Date.now()}`,
            amount,
            type,
            status: 'succeeded',
            created: new Date().toISOString()
          }
        })
      }, 2000) // Simulate network delay
    })
  }

  // Pricing plans
  static getPricingPlans() {
    return {
      free: {
        id: 'free',
        name: 'Free',
        price: 0,
        interval: null,
        features: [
          'Basic rights guides',
          'Limited recordings (3 per month)',
          'Basic scripts',
          'Community support'
        ],
        limitations: {
          recordings: 3,
          storage: '100MB',
          contacts: 2
        }
      },
      premium: {
        id: 'premium',
        name: 'Premium',
        price: 4.99,
        interval: 'month',
        stripePriceId: 'price_premium_monthly',
        features: [
          'All state-specific guides',
          'Unlimited recordings',
          'AI-generated scripts',
          'Advanced contact alerts',
          'IPFS storage',
          'Priority support',
          'Legal resource links'
        ],
        limitations: {
          recordings: 'unlimited',
          storage: '10GB',
          contacts: 'unlimited'
        }
      },
      lifetime: {
        id: 'lifetime',
        name: 'Lifetime Access',
        price: 49.99,
        interval: 'one-time',
        stripePriceId: 'price_lifetime',
        features: [
          'All Premium features',
          'Lifetime updates',
          'No recurring fees',
          'Early access to new features'
        ],
        limitations: {
          recordings: 'unlimited',
          storage: 'unlimited',
          contacts: 'unlimited'
        }
      }
    }
  }
}

export default StripeService
