const fs = require('fs');
const path = require('path');

class DataStorage {
  constructor(dataDir = 'data') {
    this.dataDir = dataDir;
    this.ensureDataDir();
  }

  ensureDataDir() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  saveStreamData(platform, username, data) {
    const filename = `${platform}_${username}.json`;
    const filepath = path.join(this.dataDir, filename);
    
    let history = [];
    if (fs.existsSync(filepath)) {
      try {
        history = JSON.parse(fs.readFileSync(filepath, 'utf8'));
      } catch (e) {
        history = [];
      }
    }
    
    const entry = {
      timestamp: new Date().toISOString(),
      ...data
    };
    
    history.push(entry);
    
    // Keep only last 1000 entries
    if (history.length > 1000) {
      history = history.slice(-1000);
    }
    
    fs.writeFileSync(filepath, JSON.stringify(history, null, 2));
  }

  getStreamData(platform, username, limit = 100) {
    const filename = `${platform}_${username}.json`;
    const filepath = path.join(this.dataDir, filename);
    
    if (!fs.existsSync(filepath)) {
      return [];
    }
    
    try {
      const history = JSON.parse(fs.readFileSync(filepath, 'utf8'));
      return history.slice(-limit);
    } catch (e) {
      return [];
    }
  }
}

module.exports = DataStorage;