import { SupabaseService } from './supabase.js'
import { OpenAIService } from './openai.js'
import { StripeService } from './stripe.js'
import { PinataService } from './pinata.js'

export class DataService {
  // User Management with full integration
  static async createUser(userData) {
    try {
      // Create user in Supabase
      const result = await SupabaseService.createUser(userData)
      
      if (result.success) {
        // Initialize user with default state rights guide
        if (userData.currentState) {
          await this.initializeUserRights(userData.userId, userData.currentState)
        }
      }
      
      return result
    } catch (error) {
      console.error('Error in createUser:', error)
      return { success: false, error: error.message }
    }
  }

  static async updateUser(userId, updates) {
    try {
      const result = await SupabaseService.updateUser(userId, updates)
      
      // If state changed, update rights guide
      if (updates.currentState && result.success) {
        await this.initializeUserRights(userId, updates.currentState)
      }
      
      return result
    } catch (error) {
      console.error('Error in updateUser:', error)
      return { success: false, error: error.message }
    }
  }

  // Initialize user with state-specific rights
  static async initializeUserRights(userId, state) {
    try {
      // Check if rights guide exists for this state
      let rightsGuide = await SupabaseService.getStateRightsGuide(state)
      
      if (!rightsGuide.success) {
        // Generate new rights guide using AI
        const aiResult = await OpenAIService.generateRightsGuide(state)
        
        if (aiResult.success) {
          // Save generated guide to database
          const guideData = {
            state,
            rightsText: JSON.stringify(aiResult.data.coreRights || []),
            dontsText: JSON.stringify(aiResult.data.stateSpecific || []),
            scriptsEnglish: JSON.stringify(aiResult.data.trafficStops || []),
            scriptsSpanish: JSON.stringify([]) // Will be translated later
          }
          
          // Note: In a real app, you'd have an admin endpoint to save this
          console.log('Generated rights guide for', state, guideData)
        }
      }
      
      return { success: true }
    } catch (error) {
      console.error('Error initializing user rights:', error)
      return { success: false, error: error.message }
    }
  }

  // Enhanced Recording Management
  static async saveRecording(recordingData, uploadToIPFS = false) {
    try {
      let ipfsData = null
      
      if (uploadToIPFS && recordingData.blob) {
        // Upload to IPFS for permanent storage
        const ipfsResult = await PinataService.uploadFile(recordingData.blob, {
          userId: recordingData.userId,
          type: 'recording',
          timestamp: recordingData.timestamp
        })
        
        if (ipfsResult.success) {
          ipfsData = ipfsResult.data
          recordingData.ipfsHash = ipfsData.ipfsHash
          recordingData.ipfsUrl = ipfsData.url
        }
      }
      
      // Save recording metadata to Supabase
      const result = await SupabaseService.saveRecording(recordingData)
      
      if (result.success && ipfsData) {
        result.data.ipfs = ipfsData
      }
      
      return result
    } catch (error) {
      console.error('Error saving recording:', error)
      return { success: false, error: error.message }
    }
  }

  static async generateRecordingSummary(recordingData) {
    try {
      const summaryResult = await OpenAIService.generateRecordingSummary(recordingData)
      
      if (summaryResult.success) {
        // Create shareable package on IPFS
        const packageResult = await PinataService.createRecordingPackage(
          recordingData,
          summaryResult.data.summary
        )
        
        return {
          success: true,
          data: {
            summary: summaryResult.data.summary,
            shareableUrl: packageResult.success ? packageResult.data.url : null
          }
        }
      }
      
      return summaryResult
    } catch (error) {
      console.error('Error generating recording summary:', error)
      return { success: false, error: error.message }
    }
  }

  // AI-Enhanced Scripts Generation
  static async generateScripts(state, scenario, language = 'english') {
    try {
      const result = await OpenAIService.generateScripts(state, scenario, language)
      
      if (result.success && language === 'english') {
        // Also generate Spanish version
        const spanishResult = await OpenAIService.generateScripts(state, scenario, 'spanish')
        
        if (spanishResult.success) {
          result.data.spanish = spanishResult.data
        }
      }
      
      return result
    } catch (error) {
      console.error('Error generating scripts:', error)
      return { success: false, error: error.message }
    }
  }

  // Subscription Management
  static async upgradeSubscription(userId, planId) {
    try {
      const plans = StripeService.getPricingPlans()
      const selectedPlan = plans[planId]
      
      if (!selectedPlan) {
        throw new Error('Invalid plan selected')
      }
      
      // For demo purposes, use mock payment
      const paymentResult = await StripeService.mockPayment(
        selectedPlan.price,
        selectedPlan.interval === 'one-time' ? 'one-time' : 'subscription'
      )
      
      if (paymentResult.success) {
        // Update user subscription status
        const updateResult = await SupabaseService.updateUser(userId, {
          subscriptionStatus: planId,
          subscriptionId: paymentResult.data.paymentId,
          subscriptionUpdatedAt: new Date().toISOString()
        })
        
        return {
          success: true,
          data: {
            payment: paymentResult.data,
            subscription: updateResult.data
          }
        }
      }
      
      return paymentResult
    } catch (error) {
      console.error('Error upgrading subscription:', error)
      return { success: false, error: error.message }
    }
  }

  static checkFeatureAccess(user, feature) {
    const plans = StripeService.getPricingPlans()
    const userPlan = plans[user.subscriptionStatus] || plans.free
    
    const featureAccess = {
      unlimited_recordings: userPlan.limitations.recordings === 'unlimited',
      ai_scripts: user.subscriptionStatus !== 'free',
      ipfs_storage: user.subscriptionStatus !== 'free',
      unlimited_contacts: userPlan.limitations.contacts === 'unlimited',
      priority_support: user.subscriptionStatus !== 'free'
    }
    
    return featureAccess[feature] || false
  }

  // Contact Alert System
  static async sendContactAlerts(user, location, recordingId) {
    try {
      if (!user.selectedContacts || user.selectedContacts.length === 0) {
        return { success: false, error: 'No emergency contacts configured' }
      }
      
      const alertData = {
        userId: user.userId,
        timestamp: new Date().toISOString(),
        location,
        recordingId,
        message: `EMERGENCY ALERT: ${user.userId} has activated RightGuard recording at ${location ? `${location.latitude}, ${location.longitude}` : 'unknown location'}`
      }
      
      // In a real app, this would send SMS/email/push notifications
      console.log('Sending alerts to contacts:', user.selectedContacts, alertData)
      
      // Simulate sending alerts
      const results = user.selectedContacts.map(contact => ({
        contact,
        status: 'sent',
        timestamp: new Date().toISOString()
      }))
      
      return {
        success: true,
        data: {
          alertsSent: results.length,
          results
        }
      }
    } catch (error) {
      console.error('Error sending contact alerts:', error)
      return { success: false, error: error.message }
    }
  }

  // State Rights Data Management
  static async getStateRights(state) {
    try {
      // Try to get from database first
      let result = await SupabaseService.getStateRightsGuide(state)
      
      if (!result.success) {
        // Generate using AI if not found
        const aiResult = await OpenAIService.generateRightsGuide(state)
        
        if (aiResult.success) {
          // Return AI-generated data (in production, you'd save this)
          return {
            success: true,
            data: {
              state,
              rightsText: aiResult.data.coreRights || [],
              stateSpecific: aiResult.data.stateSpecific || [],
              recordingLaws: aiResult.data.recordingLaws || [],
              trafficStops: aiResult.data.trafficStops || [],
              searchSeizure: aiResult.data.searchSeizure || [],
              arrest: aiResult.data.arrest || []
            }
          }
        }
      }
      
      return result
    } catch (error) {
      console.error('Error getting state rights:', error)
      return { success: false, error: error.message }
    }
  }

  // Analytics and Usage Tracking
  static async trackUsage(userId, action, metadata = {}) {
    try {
      const usageData = {
        userId,
        action,
        timestamp: new Date().toISOString(),
        metadata: JSON.stringify(metadata)
      }
      
      // In a real app, you'd save this to an analytics table
      console.log('Usage tracked:', usageData)
      
      return { success: true }
    } catch (error) {
      console.error('Error tracking usage:', error)
      return { success: false, error: error.message }
    }
  }

  // Comprehensive data export for user
  static async exportUserData(userId) {
    try {
      const [userResult, recordingsResult] = await Promise.all([
        SupabaseService.getUser(userId),
        SupabaseService.getUserRecordings(userId)
      ])
      
      const exportData = {
        user: userResult.success ? userResult.data : null,
        recordings: recordingsResult.success ? recordingsResult.data : [],
        exportedAt: new Date().toISOString(),
        version: '1.0'
      }
      
      return {
        success: true,
        data: exportData
      }
    } catch (error) {
      console.error('Error exporting user data:', error)
      return { success: false, error: error.message }
    }
  }
}

export default DataService
