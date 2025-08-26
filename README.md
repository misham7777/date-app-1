# Relationship Intel - AI-Powered Relationship Intelligence Platform

A modern Next.js application that helps users discover hidden dating profiles across 50+ platforms using AI facial recognition technology.

## 🚀 Features

- **AI Facial Recognition**: Advanced facial recognition to find hidden profiles
- **Multi-Platform Scanning**: Searches across 50+ dating platforms
- **Real-Time Activity Monitoring**: Tracks location and activity patterns
- **Complete Intelligence Reports**: Detailed reports with timestamps and data
- **Secure & Private**: 100% confidential searches

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/ui
- **Animations**: Framer Motion
- **Database**: Supabase
- **Maps**: Mapbox API
- **Payments**: Stripe (planned)

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/misham7777/date-app-1.git
cd date-app-1

# Install dependencies
npm install

# Run development server
npm run dev
```

## 🚀 Deployment

### GitHub Pages (Automatic)

The site is automatically deployed to GitHub Pages using GitHub Actions. The workflow:

1. Builds the Next.js application
2. Exports static files to the `out` directory
3. Deploys to GitHub Pages

### Manual Deployment

```bash
# Build the project
npm run build

# The static files will be in the `out` directory
# These can be deployed to any static hosting service
```

## 📁 Project Structure

```
my-app/
├── app/                    # Next.js App Router pages
│   ├── quiz/              # Quiz funnel pages
│   ├── loading/           # Loading screen
│   ├── checkout/          # Payment page
│   └── results/           # Results page
├── components/            # React components
│   ├── ui/               # Shadcn/ui components
│   └── ...               # Custom components
├── lib/                  # Utility functions
├── public/               # Static assets
└── supabase-migrations/  # Database migrations
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
```

### Supabase Setup

1. Run the migration files in your Supabase project
2. Configure Row Level Security (RLS) policies
3. Set up the tracking tables for analytics

## 📊 Analytics

The platform includes comprehensive analytics tracking:

- **Search Analytics**: Track user searches and completion rates
- **Funnel Analysis**: Monitor drop-off points in the quiz
- **User Behavior**: Analyze user interactions and patterns

## 🔒 Security

- All user data is encrypted and secure
- No personal information is stored without consent
- Searches are completely anonymous
- Supabase RLS policies ensure data protection

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🎨 Design System

Built with a modern design system featuring:
- Clean, professional interface
- Smooth animations and transitions
- Accessible color schemes
- Consistent typography

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Support

For support or questions, please contact the development team.
