import OpenAI from 'openai'
import { API_CONFIG } from '../config/api.js'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: API_CONFIG.openai.apiKey,
  dangerouslyAllowBrowser: true // Note: In production, this should be handled server-side
})

export class OpenAIService {
  // Generate scenario scripts based on state and situation
  static async generateScripts(state, scenario, language = 'english') {
    try {
      const prompt = `Generate de-escalation scripts for police interactions in ${state}. 
      Scenario: ${scenario}
      Language: ${language}
      
      Please provide:
      1. What to say (clear, respectful language)
      2. What NOT to say (common mistakes to avoid)
      3. Body language tips
      4. State-specific considerations for ${state}
      
      Keep responses concise, practical, and focused on de-escalation and rights protection.
      Format as JSON with sections: "whatToSay", "whatNotToSay", "bodyLanguage", "stateSpecific"`

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a legal rights expert specializing in police interactions and de-escalation techniques. Provide accurate, helpful guidance while emphasizing safety and legal compliance."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })

      const response = completion.choices[0].message.content
      
      try {
        const parsedResponse = JSON.parse(response)
        return { success: true, data: parsedResponse }
      } catch (parseError) {
        // If JSON parsing fails, return raw text
        return { success: true, data: { rawText: response } }
      }
    } catch (error) {
      console.error('Error generating scripts:', error)
      return { success: false, error: error.message }
    }
  }

  // Generate state-specific rights information
  static async generateRightsGuide(state) {
    try {
      const prompt = `Create a comprehensive but concise rights guide for police interactions in ${state}.
      
      Include:
      1. Core constitutional rights that apply
      2. State-specific laws and protections
      3. Recording laws in ${state}
      4. Traffic stop procedures
      5. Search and seizure rules
      6. What to do if arrested
      
      Format as JSON with sections: "coreRights", "stateSpecific", "recordingLaws", "trafficStops", "searchSeizure", "arrest"`

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a legal expert with deep knowledge of state and federal laws regarding police interactions. Provide accurate, up-to-date legal information."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.3
      })

      const response = completion.choices[0].message.content
      
      try {
        const parsedResponse = JSON.parse(response)
        return { success: true, data: parsedResponse }
      } catch (parseError) {
        return { success: true, data: { rawText: response } }
      }
    } catch (error) {
      console.error('Error generating rights guide:', error)
      return { success: false, error: error.message }
    }
  }

  // Generate shareable content summary from recording metadata
  static async generateRecordingSummary(recordingData) {
    try {
      const { location, timestamp, duration } = recordingData
      
      const prompt = `Generate a concise, professional summary for a police interaction recording.
      
      Details:
      - Date/Time: ${new Date(timestamp).toLocaleString()}
      - Duration: ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}
      - Location: ${location ? `${location.latitude}, ${location.longitude}` : 'Not available'}
      
      Create a summary suitable for sharing with legal counsel or trusted contacts.
      Include: incident overview, key details, and next steps recommendation.
      Keep it factual and professional.`

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a legal documentation assistant. Create professional, factual summaries of police interactions for legal and safety purposes."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.5
      })

      const summary = completion.choices[0].message.content
      return { success: true, data: { summary } }
    } catch (error) {
      console.error('Error generating recording summary:', error)
      return { success: false, error: error.message }
    }
  }

  // Generate multilingual scripts
  static async translateScript(script, targetLanguage) {
    try {
      const prompt = `Translate the following police interaction script to ${targetLanguage}.
      Maintain the respectful, de-escalating tone and legal accuracy.
      
      Original script: "${script}"
      
      Provide a natural, culturally appropriate translation that preserves the legal and safety intent.`

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a professional translator specializing in legal and safety communications. Ensure translations are accurate and culturally appropriate."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.3
      })

      const translation = completion.choices[0].message.content
      return { success: true, data: { translation } }
    } catch (error) {
      console.error('Error translating script:', error)
      return { success: false, error: error.message }
    }
  }
}

export default OpenAIService
