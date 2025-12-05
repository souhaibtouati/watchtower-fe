# Watchtower Frontend

A modern web application for managing [Watchtower](https://containrrr.dev/watchtower/) Docker container updates.

## Features

- **Container Dashboard**: View all Docker containers with their current status
- **Update Detection**: See which containers have available updates at a glance
- **One-Click Updates**: Trigger updates for individual containers or all at once
- **Watchtower Status**: Monitor Watchtower's running status and schedule
- **Update History**: View recent update logs with success/failure status
- **Real-time Feedback**: Visual indicators for container states and update progress

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **Lucide React** for icons
- **Axios** for API communication
- **date-fns** for date formatting

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A running Watchtower instance with HTTP API enabled

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=/api          # Backend API URL
VITE_USE_MOCK_DATA=true    # Use mock data for demo (set to false for production)
```

## Backend API Requirements

This frontend expects a backend API with the following endpoints:

### Containers
- `GET /api/containers` - List all containers
- `GET /api/containers/:id` - Get container details
- `GET /api/containers/updates` - Check for container updates

### Updates
- `POST /api/update/:containerId` - Trigger update for a specific container
- `POST /api/update/all` - Trigger updates for all containers

### Watchtower
- `GET /api/watchtower/status` - Get Watchtower status
- `GET /api/watchtower/config` - Get Watchtower configuration
- `PUT /api/watchtower/config` - Update Watchtower configuration
- `POST /api/watchtower/run` - Force a Watchtower check

### Logs
- `GET /api/logs` - Get update history logs

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components (Card, Button, Badge)
│   ├── Header.tsx      # App header
│   ├── StatusDashboard.tsx  # Watchtower status cards
│   ├── ContainerList.tsx    # Container list with update actions
│   └── UpdateLogs.tsx       # Recent update history
├── hooks/              # Custom React hooks
│   └── useWatchtower.ts    # Data fetching hooks
├── services/           # API services
│   ├── api.ts          # API client
│   └── mockData.ts     # Mock data for development
├── types/              # TypeScript types
│   └── index.ts        # Type definitions
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## Development

The application includes mock data by default for easy development without a backend. Set `VITE_USE_MOCK_DATA=false` in your `.env` file to connect to a real backend.

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## License

MIT
  },
])
```
