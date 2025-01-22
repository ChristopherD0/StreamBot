const TwitchAPI = require('./twitch');
const Logger = require('./logger');
const DataStorage = require('./storage');

class StreamMonitor {
  constructor() {
    this.twitch = new TwitchAPI();
    this.logger = new Logger();
    this.storage = new DataStorage();
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
    this.logger.info(`Added ${platform}/${username} to monitoring list`);
  }

  async checkStreams() {
    this.logger.info(`Checking ${this.monitoredStreams.length} streams...`);
    
    for (const stream of this.monitoredStreams) {
      try {
        if (stream.platform === 'twitch') {
          const streamInfo = await this.twitch.getStreamInfo(stream.username);
          
          if (streamInfo) {
            const viewerCount = streamInfo.viewer_count;
            const wasOffline = !stream.isOnline;
            
            stream.isOnline = true;
            
            // Save stream data
            this.storage.saveStreamData(stream.platform, stream.username, {
              isOnline: true,
              viewerCount,
              game: streamInfo.game_name,
              title: streamInfo.title
            });
            
            if (wasOffline) {
              this.logger.streamEvent(stream.platform, stream.username, 'WENT_LIVE', { 
                viewers: viewerCount,
                game: streamInfo.game_name 
              });
            }
            
            if (Math.abs(viewerCount - stream.lastViewerCount) > 100) {
              this.logger.streamEvent(stream.platform, stream.username, 'VIEWER_CHANGE', {
                from: stream.lastViewerCount,
                to: viewerCount,
                diff: viewerCount - stream.lastViewerCount
              });
            }
            
            stream.lastViewerCount = viewerCount;
          } else {
            if (stream.isOnline) {
              this.logger.streamEvent(stream.platform, stream.username, 'WENT_OFFLINE');
              this.storage.saveStreamData(stream.platform, stream.username, {
                isOnline: false,
                viewerCount: 0
              });
            }
            stream.isOnline = false;
          }
        }
      } catch (error) {
        this.logger.error(`Error checking ${stream.platform}/${stream.username}: ${error.message}`);
      }
    }
  }

  start(intervalMs = 60000) {
    this.logger.info(`Starting stream monitor (checking every ${intervalMs/1000}s)`);
    
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
      this.logger.info('Stream monitor stopped');
    }
  }
}

module.exports = StreamMonitor;