const StreamMonitor = require('./lib/monitor');

console.log('StreamBot starting...');

const monitor = new StreamMonitor();

// Add some popular streamers to monitor
monitor.addStream('twitch', 'shroud');
monitor.addStream('twitch', 'ninja');
monitor.addStream('twitch', 'pokimane');

// Start monitoring every 2 minutes
monitor.start(120000);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down StreamBot...');
  monitor.stop();
  process.exit(0);
});