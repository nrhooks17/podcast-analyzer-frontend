# Podcast Analyzer Frontend

React frontend for analyzing podcast transcripts with AI-powered summarization and fact-checking.

## Architecture

The React frontend provides a clean interface for:

```
src/
├── components/          # React components
│   ├── common/          # Reusable UI components  
│   ├── results/         # Analysis results display
│   └── upload/          # File upload interface
├── hooks/               # Custom React hooks
├── pages/               # Page-level components
├── services/            # API service layer
└── utils/               # Utility functions
```

## Key Features

- **Framework**: React 18 + Vite
- **Router**: React Router v6
- **HTTP Client**: Axios for backend communication
- **Testing**: Vitest with Testing Library
- **UI**: File upload, progress tracking, results display

## Running the Application

### With Docker Compose (Recommended)

The frontend runs as part of the full stack. Clone the backend repository and run:

```bash
git clone <backend-repo-url>
cd podcast-analyzer
docker-compose up
```

The frontend will be available at http://localhost:3000

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## API Integration

Connects to Go backend on port 8001:
- Upload transcripts
- Start AI analysis jobs
- Poll job status every 3 seconds
- Display analysis results

## Testing

```bash
# Run tests
npm test

# Build for production
npm run build
```

## Environment

- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:8001)