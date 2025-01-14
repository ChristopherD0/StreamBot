const TwitchAPI = require('./lib/twitch');

console.log('StreamBot starting...');

const twitch = new TwitchAPI();

async function testTwitchAPI() {
  try {
    const streamInfo = await twitch.getStreamInfo('shroud');
    if (streamInfo) {
      console.log(`${streamInfo.user_name} is live with ${streamInfo.viewer_count} viewers`);
    } else {
      console.log('Stream is offline or not found');
    }
  } catch (error) {
    console.error('Twitch API test failed:', error.message);
  }
}

// testTwitchAPI();