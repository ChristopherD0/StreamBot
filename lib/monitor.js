const TwitchAPI = require('./twitch');

class StreamMonitor {
  constructor() {
    this.twitch = new TwitchAPI();
    this.monitoredStreams = [];
    this.intervalId = null;
  }

  addStream(platform, username) {
    const stream = {
      platform,
      username,
      lastViewerCount: 0,
      isOnline: false
    };
    
    this.monitoredStreams.push(stream);
    console.log(`Added ${platform}/${username} to monitoring list`);
  }

  async checkStreams() {
    console.log(`Checking ${this.monitoredStreams.length} streams...`);
    
    for (const stream of this.monitoredStreams) {
      try {
        if (stream.platform === 'twitch') {
          const streamInfo = await this.twitch.getStreamInfo(stream.username);
          
          if (streamInfo) {
            const viewerCount = streamInfo.viewer_count;
            const wasOffline = !stream.isOnline;
            
            stream.isOnline = true;
            
            if (wasOffline) {
              console.log(`🔴 ${stream.username} went LIVE on Twitch`);
            }
            
            if (Math.abs(viewerCount - stream.lastViewerCount) > 100) {
              console.log(`👥 ${stream.username}: ${stream.lastViewerCount} -> ${viewerCount} viewers`);
            }
            
            stream.lastViewerCount = viewerCount;
          } else {
            if (stream.isOnline) {
              console.log(`⚫ ${stream.username} went OFFLINE on Twitch`);
            }
            stream.isOnline = false;
          }
        }
      } catch (error) {
        console.error(`Error checking ${stream.platform}/${stream.username}:`, error.message);
      }
    }
  }

  start(intervalMs = 60000) {
    console.log(`Starting stream monitor (checking every ${intervalMs/1000}s)`);
    
    this.intervalId = setInterval(() => {
      this.checkStreams();
    }, intervalMs);
    
    // Check immediately
    this.checkStreams();
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Stream monitor stopped');
    }
  }
}

module.exports = StreamMonitor;