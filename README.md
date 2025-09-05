# RightGuard 🛡️

**Know Your Rights, Stay Safe, Document Everything.**

RightGuard is a mobile-first web application that provides immediate access to state-specific legal rights, de-escalation scripts, and discreet recording capabilities for interactions with law enforcement.

## 🌟 Features

### Core Features
- **State-Specific Rights Guides**: Concise, mobile-optimized guides detailing user rights and 'dos and don'ts' when interacting with law enforcement
- **AI-Generated Scripts**: Personalized de-escalation scripts in English and Spanish for common police interactions
- **One-Tap Recording**: Discreet button to instantly record audio/video with automatic location tracking
- **Contact Alerts**: Instantly alert trusted contacts with location and recording information
- **IPFS Storage**: Decentralized storage for recordings ensuring immutable evidence

### Premium Features
- **Unlimited Recordings**: No limits on recording storage
- **AI-Powered Scripts**: Dynamic, context-aware de-escalation scripts
- **Advanced Contact Alerts**: Enhanced notification system
- **IPFS Integration**: Permanent, decentralized storage
- **Priority Support**: Direct access to legal resources

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- API keys for services (see Setup section)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/this-is-a-2031.git
   cd this-is-a-2031
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys (see Setup section)
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

## ⚙️ Setup & Configuration

### Required API Services

#### 1. Supabase (Database & Auth)
- Create account at [supabase.com](https://supabase.com)
- Create new project
- Get URL and anon key from Settings > API
- Set up database tables (see Database Schema section)

#### 2. OpenAI (AI Scripts)
- Create account at [openai.com](https://openai.com)
- Generate API key from API Keys section
- Ensure you have credits for GPT-3.5-turbo usage

#### 3. Stripe (Payments)
- Create account at [stripe.com](https://stripe.com)
- Get publishable key from Developers > API Keys
- Set up products and pricing (see Stripe Setup section)

#### 4. Pinata (IPFS Storage)
- Create account at [pinata.cloud](https://pinata.cloud)
- Generate API key and secret from API Keys section
- Configure gateway settings

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# OpenAI
VITE_OPENAI_API_KEY=your-openai-api-key

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key

# Pinata
VITE_PINATA_API_KEY=your-pinata-api-key
VITE_PINATA_SECRET_KEY=your-pinata-secret-key
```

## 🗄️ Database Schema

### Supabase Tables

Create these tables in your Supabase project:

#### Users Table
```sql
CREATE TABLE users (
  userId TEXT PRIMARY KEY,
  currentState TEXT,
  selectedContacts JSONB DEFAULT '[]',
  subscriptionStatus TEXT DEFAULT 'free',
  subscriptionId TEXT,
  subscriptionUpdatedAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT NOW()
);
```

#### Recordings Table
```sql
CREATE TABLE recordings (
  recordingId TEXT PRIMARY KEY,
  userId TEXT REFERENCES users(userId),
  timestamp TIMESTAMP,
  filePath TEXT,
  ipfsHash TEXT,
  ipfsUrl TEXT,
  location JSONB,
  sharedWith JSONB DEFAULT '[]',
  duration INTEGER,
  createdAt TIMESTAMP DEFAULT NOW()
);
```

#### State Rights Guides Table
```sql
CREATE TABLE state_rights_guides (
  state TEXT PRIMARY KEY,
  rightsText JSONB,
  dontsText JSONB,
  scriptsEnglish JSONB,
  scriptsSpanish JSONB,
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

## 💳 Stripe Setup

### Products & Pricing

Create these products in your Stripe dashboard:

1. **Premium Monthly** - $4.99/month
2. **Lifetime Access** - $49.99 one-time

### Webhooks

Set up webhook endpoint for subscription events:
- Endpoint: `https://your-domain.com/api/stripe/webhook`
- Events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`

## 🏗️ Architecture

### Frontend (React + Vite)
- **React 18** with hooks and context
- **Tailwind CSS** for styling with custom design system
- **Lucide React** for icons
- **Vite** for fast development and building

### Services Layer
- **DataService**: Main business logic coordinator
- **SupabaseService**: Database operations and auth
- **OpenAIService**: AI script generation
- **StripeService**: Payment processing
- **PinataService**: IPFS storage operations

### Key Components
- **AppShell**: Main navigation and layout
- **Dashboard**: Overview and quick actions
- **Recording**: Video/audio recording with IPFS upload
- **Scripts**: AI-generated and static de-escalation scripts
- **RightsGuide**: State-specific legal information
- **SubscriptionManager**: Payment and plan management

## 🔒 Security & Privacy

### Data Protection
- All recordings stored locally first, IPFS upload optional
- Location data encrypted and user-controlled
- No sensitive data stored in localStorage
- API keys properly secured with environment variables

### Recording Laws
- App includes state-specific recording law information
- Users informed of legal considerations before recording
- Compliance with two-party consent states

### IPFS Benefits
- Immutable evidence storage
- Decentralized, censorship-resistant
- Cryptographic proof of authenticity
- User controls their own data

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options

#### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

#### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

#### Docker
```bash
docker build -t rightguard .
docker run -p 3000:3000 rightguard
```

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test Coverage
```bash
npm run test:coverage
```

### E2E Testing
```bash
npm run test:e2e
```

## 📱 Mobile Optimization

### PWA Features
- Offline functionality for core features
- App-like experience on mobile devices
- Push notifications for contact alerts
- Background recording capabilities

### Responsive Design
- Mobile-first approach
- Touch-optimized interface
- Optimized for one-handed use
- Fast loading on mobile networks

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards
- ESLint configuration included
- Prettier for code formatting
- Conventional commits preferred
- Component documentation required

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [API Documentation](docs/api.md)
- [Component Guide](docs/components.md)
- [Deployment Guide](docs/deployment.md)

### Community
- [Discord Server](https://discord.gg/rightguard)
- [GitHub Discussions](https://github.com/vistara-apps/this-is-a-2031/discussions)
- [Issue Tracker](https://github.com/vistara-apps/this-is-a-2031/issues)

### Legal Resources
- [Know Your Rights Guide](https://rightguard.app/rights)
- [Recording Laws by State](https://rightguard.app/recording-laws)
- [Legal Disclaimer](https://rightguard.app/legal)

---

**⚠️ Legal Disclaimer**: RightGuard provides general information about legal rights and is not a substitute for professional legal advice. Users should consult with qualified attorneys for specific legal situations. Recording laws vary by jurisdiction - users are responsible for compliance with local laws.

**🛡️ Safety First**: This app is designed to help users exercise their rights safely. Always prioritize personal safety over documentation. If you feel unsafe, comply with officer instructions and address legal issues later with an attorney.
