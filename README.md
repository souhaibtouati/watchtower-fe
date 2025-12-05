# Watchtower Frontend

A modern web application for managing [Watchtower](https://containrrr.dev/watchtower/) Docker container updates.

[![Docker Hub](https://img.shields.io/docker/v/souhaibtouati/watchtower-fe?label=Docker%20Hub)](https://hub.docker.com/r/souhaibtouati/watchtower-fe)

## Features

- **Container Dashboard**: View all Docker containers with their current status
- **Update Detection**: See which containers have available updates at a glance
- **One-Click Updates**: Trigger updates for individual containers or all at once
- **Watchtower Status**: Monitor Watchtower's running status and schedule
- **Update History**: View recent update logs with success/failure status
- **Real-time Feedback**: Visual indicators for container states and update progress

## Quick Start with Docker

```bash
docker run -d \
  --name watchtower-fe \
  -p 3000:80 \
  -e API_URL=http://your-api-host:8080 \
  -e API_TOKEN=your-watchtower-api-token \
  souhaibtouati/watchtower-fe:latest
```

Then open http://localhost:3000

See [DEPLOYMENT.md](DEPLOYMENT.md) for full deployment options.

## Docker Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `API_URL` | `http://watchtower-api:8080` | Backend Watchtower API URL |
| `API_TOKEN` | *(none)* | Watchtower HTTP API token (must match `WATCHTOWER_HTTP_API_TOKEN`) |
| `API_TIMEOUT` | `60s` | API request timeout |

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **Lucide React** for icons
- **Axios** for API communication
- **date-fns** for date formatting

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables (Development)

Create a `.env` file in the root directory:

```env
VITE_API_URL=/api          # Backend API URL
VITE_API_TOKEN=your-token  # Watchtower HTTP API token
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

The application includes mock data by default for easy development without a backend. Set `VITE_USE_MOCK_DATA=false` in your `.env` file to connect to a real backend.

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## License

MIT
