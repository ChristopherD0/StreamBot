# StreamBot

Multi-platform streaming data monitor and analytics tool for tracking live streams and viewer metrics.

## Features

- **Real-time monitoring** of Twitch streams
- **Automated logging** of stream events (go live, viewer count changes, etc.)  
- **Data persistence** with JSON file storage
- **Web dashboard** for viewing stream status and metrics
- **Configurable monitoring intervals** and thresholds
- **Multiple streamer support** - track your favorite streamers

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment:
   ```bash
   cp .env.example .env
   # Edit .env with your API credentials
   ```

4. Start monitoring:
   ```bash
   npm start
   ```

5. View the dashboard:
   ```bash
   npm run server
   # Open http://localhost:3000 in your browser
   ```

## Configuration

Create a `.env` file with your API credentials:

```
TWITCH_CLIENT_ID=your_client_id_here
TWITCH_CLIENT_SECRET=your_client_secret_here
PORT=3000
```

## Current Status

- ✅ Twitch API integration
- ✅ Real-time stream monitoring  
- ✅ Data logging and storage
- ✅ Web dashboard
- 🔄 YouTube API integration (planned)
- 🔄 Discord webhooks (planned)