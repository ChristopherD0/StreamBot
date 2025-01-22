const fs = require('fs');
const path = require('path');

class Logger {
  constructor(logDir = 'logs') {
    this.logDir = logDir;
    this.ensureLogDir();
  }

  ensureLogDir() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  formatTimestamp() {
    return new Date().toISOString();
  }

  writeToFile(filename, message) {
    const timestamp = this.formatTimestamp();
    const logMessage = `[${timestamp}] ${message}\n`;
    const filePath = path.join(this.logDir, filename);
    
    fs.appendFileSync(filePath, logMessage);
  }

  info(message) {
    console.log(message);
    this.writeToFile('app.log', `INFO: ${message}`);
  }

  error(message) {
    console.error(message);
    this.writeToFile('error.log', `ERROR: ${message}`);
  }

  streamEvent(platform, username, event, data = {}) {
    const eventMessage = `${platform}/${username}: ${event} ${JSON.stringify(data)}`;
    console.log(`📊 ${eventMessage}`);
    this.writeToFile('streams.log', `STREAM_EVENT: ${eventMessage}`);
  }
}

module.exports = Logger;