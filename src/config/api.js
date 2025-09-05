// API Configuration
export const API_CONFIG = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'
  },
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'your-openai-key'
  },
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your-key'
  },
  pinata: {
    apiKey: import.meta.env.VITE_PINATA_API_KEY || 'your-pinata-key',
    secretKey: import.meta.env.VITE_PINATA_SECRET_KEY || 'your-pinata-secret'
  }
}

// API Endpoints
export const API_ENDPOINTS = {
  supabase: {
    users: 'users',
    recordings: 'recordings',
    stateRightsGuides: 'state_rights_guides'
  },
  openai: {
    chatCompletions: 'https://api.openai.com/v1/chat/completions'
  },
  stripe: {
    createPaymentIntent: '/api/stripe/create-payment-intent',
    createSubscription: '/api/stripe/create-subscription'
  },
  pinata: {
    pinFile: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
    pinJson: 'https://api.pinata.cloud/pinning/pinJSONToIPFS'
  }
}
