/**
 * Model class that handles data operations and event management
 */
class Model {
    constructor(name, schema, options) {
      this.name = name;
      this.schema = schema;
      this.options = options;
      this.adapter = options.adapter;
      this.eventEmitter = new EventEmitter();
      this.hooks = new HookSystem();
      
      // Initialize hooks
      this.initializeHooks();
    }
  
    // Initialize default hooks
    initializeHooks() {
      this.hooks.register('beforeCreate');
      this.hooks.register('afterCreate');
      this.hooks.register('beforeUpdate');
      this.hooks.register('afterUpdate');
      this.hooks.register('beforeDelete');
      this.hooks.register('afterDelete');
      this.hooks.register('beforeValidate');
      this.hooks.register('afterValidate');
    }
  
    // Register an event listener
    on(event, callback) {
      this.eventEmitter.on(event, callback);
      return this;
    }
  
    // Add a hook
    addHook(hookName, handler) {
      this.hooks.add(hookName, handler);
      return this;
    }
  
    // Create a new record
    async create(data) {
      try {
        // Run before validate hook
        data = await this.hooks.execute('beforeValidate', data);
  
        // Validate data against schema
        this.validateAgainstSchema(data);
  
        // Run after validate hook
        data = await this.hooks.execute('afterValidate', data);
  
        // Run before create hook
        data = await this.hooks.execute('beforeCreate', data);
  
        // Emit beforeCreate event
        this.eventEmitter.emit('beforeCreate', data);
  
        // Store data using adapter
        const result = await this.adapter.create(this.name, data);
  
        // Run after create hook
        const processedResult = await this.hooks.execute('afterCreate', result);
  
        // Emit afterCreate event
        this.eventEmitter.emit('afterCreate', processedResult);
  
        return processedResult;
      } catch (error) {
        this.eventEmitter.emit('error', error);
        throw error;
      }
    }
  
    // Update a record
    async update(id, data) {
      try {
        data = await this.hooks.execute('beforeUpdate', data);
        this.eventEmitter.emit('beforeUpdate', { id, data });
  
        const result = await this.adapter.update(this.name, id, data);
        
        const processedResult = await this.hooks.execute('afterUpdate', result);
        this.eventEmitter.emit('afterUpdate', processedResult);
  
        return processedResult;
      } catch (error) {
        this.eventEmitter.emit('error', error);
        throw error;
      }
    }
  
    // Delete a record
    async delete(id) {
      try {
        await this.hooks.execute('beforeDelete', id);
        this.eventEmitter.emit('beforeDelete', id);
  
        const result = await this.adapter.delete(this.name, id);
  
        await this.hooks.execute('afterDelete', id);
        this.eventEmitter.emit('afterDelete', id);
  
        return result;
      } catch (error) {
        this.eventEmitter.emit('error', error);
        throw error;
      }
    }
  
    // Find records
    async find(query = {}) {
      return this.adapter.find(this.name, query);
    }
  
    // Find one record
    async findOne(query = {}) {
      return this.adapter.findOne(this.name, query);
    }
  
    // Validate data against schema
    validateAgainstSchema(data) {
      // Implementation of schema validation
      // This is a simplified version
      for (const [field, schema] of Object.entries(this.schema)) {
        if (schema.required && !data[field]) {
          throw new Error(`Field ${field} is required`);
        }
      }
    }
  }