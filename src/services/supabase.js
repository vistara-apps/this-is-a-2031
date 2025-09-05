import { createClient } from '@supabase/supabase-js'
import { API_CONFIG, API_ENDPOINTS } from '../config/api.js'

// Initialize Supabase client
const supabase = createClient(API_CONFIG.supabase.url, API_CONFIG.supabase.anonKey)

export class SupabaseService {
  // User Management
  static async createUser(userData) {
    try {
      const { data, error } = await supabase
        .from(API_ENDPOINTS.supabase.users)
        .insert([userData])
        .select()
      
      if (error) throw error
      return { success: true, data: data[0] }
    } catch (error) {
      console.error('Error creating user:', error)
      return { success: false, error: error.message }
    }
  }

  static async updateUser(userId, updates) {
    try {
      const { data, error } = await supabase
        .from(API_ENDPOINTS.supabase.users)
        .update(updates)
        .eq('userId', userId)
        .select()
      
      if (error) throw error
      return { success: true, data: data[0] }
    } catch (error) {
      console.error('Error updating user:', error)
      return { success: false, error: error.message }
    }
  }

  static async getUser(userId) {
    try {
      const { data, error } = await supabase
        .from(API_ENDPOINTS.supabase.users)
        .select('*')
        .eq('userId', userId)
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching user:', error)
      return { success: false, error: error.message }
    }
  }

  // Recording Management
  static async saveRecording(recordingData) {
    try {
      const { data, error } = await supabase
        .from(API_ENDPOINTS.supabase.recordings)
        .insert([recordingData])
        .select()
      
      if (error) throw error
      return { success: true, data: data[0] }
    } catch (error) {
      console.error('Error saving recording:', error)
      return { success: false, error: error.message }
    }
  }

  static async getUserRecordings(userId) {
    try {
      const { data, error } = await supabase
        .from(API_ENDPOINTS.supabase.recordings)
        .select('*')
        .eq('userId', userId)
        .order('createdAt', { ascending: false })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching recordings:', error)
      return { success: false, error: error.message }
    }
  }

  static async deleteRecording(recordingId) {
    try {
      const { error } = await supabase
        .from(API_ENDPOINTS.supabase.recordings)
        .delete()
        .eq('recordingId', recordingId)
      
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error deleting recording:', error)
      return { success: false, error: error.message }
    }
  }

  // State Rights Guides
  static async getStateRightsGuide(state) {
    try {
      const { data, error } = await supabase
        .from(API_ENDPOINTS.supabase.stateRightsGuides)
        .select('*')
        .eq('state', state)
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching state rights guide:', error)
      return { success: false, error: error.message }
    }
  }

  static async getAllStates() {
    try {
      const { data, error } = await supabase
        .from(API_ENDPOINTS.supabase.stateRightsGuides)
        .select('state')
        .order('state')
      
      if (error) throw error
      return { success: true, data: data.map(item => item.state) }
    } catch (error) {
      console.error('Error fetching states:', error)
      return { success: false, error: error.message }
    }
  }

  // Authentication
  static async signUp(email, password) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error signing up:', error)
      return { success: false, error: error.message }
    }
  }

  static async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error signing in:', error)
      return { success: false, error: error.message }
    }
  }

  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error signing out:', error)
      return { success: false, error: error.message }
    }
  }

  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return { success: true, data: user }
    } catch (error) {
      console.error('Error getting current user:', error)
      return { success: false, error: error.message }
    }
  }
}

export { supabase }
