# 🌌 Eternal Chase - Cosmic Romance Trilogy Portal

A immersive Young Adult sci-fi romance thriller web application featuring the complete "Eternal Chase" trilogy with authentication, subscriptions, and premium audiobook access.

## ✨ Features

### 🔐 Authentication & Access Control
- **Replit OAuth Integration** - Seamless sign-in experience
- **User Profiles** - Personalized cosmic experience
- **Landing Page** - Beautiful introduction for new visitors
- **Premium Access Control** - Subscription-based content protection

### 💳 Subscription System
- **$9.99/Month Premium** - Affordable access to complete universe
- **Stripe Integration** - Secure payment processing
- **Subscription Management** - Easy upgrade, cancel, and status tracking
- **Premium Badges** - Visual status indicators

### 📚 Content Management
- **Complete Trilogy Showcase** - All three books beautifully displayed
- **Premium Audiobooks** - Professional narration with preview capabilities
- **Character Gallery** - Interactive 3D flip cards with character details
- **Cosmic Lore** - Deep universe exploration and world-building content

### 🎨 User Experience
- **Cosmic Theme** - Starfield backgrounds with particle effects
- **Responsive Design** - Beautiful across all devices
- **Bilingual Support** - English/Spanish language switching
- **Smooth Animations** - 3D transforms and gradient effects

### 🛠 Technical Stack
- **Frontend**: React 18 + TypeScript + TailwindCSS
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **Authentication**: OpenID Connect (Replit)
- **Payments**: Stripe API
- **Build**: Vite + esbuild

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Stripe account
- Replit account (for authentication)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd eternal-chase

# Install dependencies
npm install

# Set up environment variables (see DEPLOYMENT.md)
cp .env.example .env

# Push database schema
npm run db:push

# Start development server
npm run dev
```

### Environment Setup
Create `.env` file with:
```bash
DATABASE_URL=your-postgres-connection-string
SESSION_SECRET=your-random-secret
STRIPE_SECRET_KEY=your-stripe-secret
VITE_STRIPE_PUBLIC_KEY=your-stripe-public-key
REPL_ID=your-replit-app-id
REPLIT_DOMAINS=your-domain.com
```

## 📖 User Journey

### For Visitors
1. **Landing Page** - Stunning introduction to the Eternal Chase universe
2. **Feature Preview** - See what premium membership offers
3. **Sign In Prompt** - Easy authentication via Replit
4. **Subscription Modal** - Clear pricing and feature breakdown

### For Authenticated Users
1. **Cosmic Portal** - Full trilogy showcase and interactive content
2. **User Profile** - Personalized experience with subscription status
3. **Premium Upgrade** - Seamless subscription flow when needed
4. **Content Access** - Unlock audiobooks and exclusive materials

### For Premium Subscribers
1. **Full Access** - Complete trilogy with audiobooks
2. **Premium Badge** - Visual status recognition
3. **Exclusive Content** - Character deep-dives and cosmic lore
4. **Ad-Free Experience** - Uninterrupted reading and listening

## 🎯 Key Features

### Authentication Flow
```
Visitor → Landing Page → Sign In → Cosmic Portal → Subscription → Premium Content
```

### Subscription Management
- **Monthly Billing**: $9.99 recurring subscription
- **Instant Access**: Immediate unlock upon successful payment
- **Easy Cancellation**: Cancel anytime, access until period end
- **Status Tracking**: Real-time subscription status updates

### Content Protection
- **Public**: Landing page, basic trilogy information
- **Authenticated**: Full cosmic portal, character gallery
- **Premium**: Audiobooks, exclusive lore, premium features

## 🛡 Security & Privacy

- **Secure Authentication** - OAuth 2.0 with Replit
- **Payment Security** - PCI compliant Stripe integration
- **Session Management** - PostgreSQL-backed secure sessions
- **Data Protection** - Encrypted user data and payment information

## 📱 Responsive Design

- **Mobile First** - Optimized for all screen sizes
- **Touch Friendly** - Smooth interactions on mobile devices
- **Fast Loading** - Optimized assets and lazy loading
- **Progressive Enhancement** - Works across all modern browsers

## 🌟 Premium Features

### Complete Trilogy Access
- **Book 1**: "Eternal Chase: The Pursuit for Love"
- **Book 2**: "Eternal Chase: The Spiral War"
- **Book 3**: "Eternal Chase: Ascension's Edge"

### Enhanced Experience
- **Professional Audiobooks** - Immersive narration
- **Character Deep-Dives** - Exclusive background content
- **Cosmic Lore** - Universe building and world details
- **Premium Support** - Priority customer assistance

## 🚢 Deployment

See `DEPLOYMENT.md` for comprehensive deployment instructions including:
- Platform-specific guides (Vercel, Railway, Render, etc.)
- Environment variable setup
- Database configuration
- Production optimization

## 📞 Support

For technical support or deployment assistance:
- Check `DEPLOYMENT.md` for common issues
- Review environment variable configuration
- Verify database connection and migrations
- Confirm Stripe webhook setup for production

---

**Created**: January 27, 2025  
**Version**: 1.0.0  
**License**: Proprietary  
**Author**: Shawn Rulz