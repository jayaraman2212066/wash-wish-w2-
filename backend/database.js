const fs = require('fs');
const path = require('path');

class Database {
  constructor() {
    this.dataDir = path.join(__dirname, 'data');
    this.ensureDataDir();
  }

  ensureDataDir() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  getFilePath(collection) {
    return path.join(this.dataDir, `${collection}.json`);
  }

  read(collection) {
    try {
      const filePath = this.getFilePath(collection);
      if (!fs.existsSync(filePath)) {
        return [];
      }
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${collection}:`, error);
      return [];
    }
  }

  write(collection, data) {
    try {
      const filePath = this.getFilePath(collection);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Error writing ${collection}:`, error);
      return false;
    }
  }

  insert(collection, document) {
    const data = this.read(collection);
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newDocument = { _id: id, ...document, createdAt: new Date().toISOString() };
    data.push(newDocument);
    this.write(collection, data);
    return newDocument;
  }

  findById(collection, id) {
    const data = this.read(collection);
    return data.find(item => item._id === id);
  }

  find(collection, query = {}) {
    const data = this.read(collection);
    if (Object.keys(query).length === 0) return data;
    
    return data.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  }

  updateById(collection, id, updates) {
    const data = this.read(collection);
    const index = data.findIndex(item => item._id === id);
    if (index === -1) return null;
    
    data[index] = { ...data[index], ...updates, updatedAt: new Date().toISOString() };
    this.write(collection, data);
    return data[index];
  }

  deleteById(collection, id) {
    const data = this.read(collection);
    const index = data.findIndex(item => item._id === id);
    if (index === -1) return false;
    
    data.splice(index, 1);
    this.write(collection, data);
    return true;
  }
}

module.exports = new Database();