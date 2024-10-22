/**
 * Local Storage Adapter implementation
 */
class LocalStorageAdapter {
    constructor(options = {}) {
      this.prefix = options.prefix || 'orm:';
    }
  
    async create(modelName, data) {
      const storage = this._getStorage(modelName);
      const id = this._generateId();
      const record = { id, ...data };
      storage.push(record);
      this._saveStorage(modelName, storage);
      return record;
    }
  
    async update(modelName, id, data) {
      const storage = this._getStorage(modelName);
      const index = storage.findIndex(item => item.id === id);
      if (index === -1) throw new Error('Record not found');
      
      const record = { ...storage[index], ...data };
      storage[index] = record;
      this._saveStorage(modelName, storage);
      return record;
    }
  
    async delete(modelName, id) {
      const storage = this._getStorage(modelName);
      const filtered = storage.filter(item => item.id !== id);
      this._saveStorage(modelName, filtered);
      return true;
    }
  
    async find(modelName, query) {
      const storage = this._getStorage(modelName);
      return this._filterStorage(storage, query);
    }
  
    async findOne(modelName, query) {
      const results = await this.find(modelName, query);
      return results[0] || null;
    }
  
    _getStorage(modelName) {
      const key = this.prefix + modelName;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    }
  
    _saveStorage(modelName, data) {
      const key = this.prefix + modelName;
      localStorage.setItem(key, JSON.stringify(data));
    }
  
    _generateId() {
      return Math.random().toString(36).substr(2, 9);
    }
  
    _filterStorage(storage, query) {
      return storage.filter(item => {
        return Object.entries(query).every(([key, value]) => item[key] === value);
      });
    }
  }