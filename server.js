const express = require('express');
const path = require('path');
const DataStorage = require('./lib/storage');
const config = require('./config');

const app = express();
const storage = new DataStorage();
const port = config.server.port;

app.use(express.static('public'));
app.use(express.json());

// API endpoints
app.get('/api/streams', (req, res) => {
  // Return list of monitored streams with recent data
  const streams = [
    { platform: 'twitch', username: 'shroud' },
    { platform: 'twitch', username: 'ninja' },
    { platform: 'twitch', username: 'pokimane' }
  ];
  
  const streamData = streams.map(stream => {
    const data = storage.getStreamData(stream.platform, stream.username, 50);
    const latest = data[data.length - 1] || {};
    
    return {
      ...stream,
      isOnline: latest.isOnline || false,
      viewerCount: latest.viewerCount || 0,
      game: latest.game || 'Unknown',
      lastUpdate: latest.timestamp || null,
      historyCount: data.length
    };
  });
  
  res.json(streamData);
});

app.get('/api/streams/:platform/:username/history', (req, res) => {
  const { platform, username } = req.params;
  const limit = parseInt(req.query.limit) || 100;
  
  const data = storage.getStreamData(platform, username, limit);
  res.json(data);
});

app.listen(port, () => {
  console.log(`Dashboard server running at http://localhost:${port}`);
});