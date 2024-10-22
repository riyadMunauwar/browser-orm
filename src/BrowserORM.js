/**
 * Main ORM class that handles model definition and management
 */
class BrowserORM {
    constructor(config = {}) {
      this.config = config;
      this.models = new Map();
      this.adapters = new Map();
      this.defaultAdapter = null;
    }
  
    // Register a storage adapter
    registerAdapter(name, adapter) {
      this.adapters.set(name, adapter);
      if (!this.defaultAdapter) {
        this.defaultAdapter = name;
      }
    }
  
    // Define a new model
    define(modelName, schema, options = {}) {
      const model = new Model(modelName, schema, {
        ...options,
        orm: this,
        adapter: this.adapters.get(options.adapter || this.defaultAdapter)
      });
      this.models.set(modelName, model);
      return model;
    }
  
    // Get a registered model
    model(modelName) {
      return this.models.get(modelName);
    }
  }
  