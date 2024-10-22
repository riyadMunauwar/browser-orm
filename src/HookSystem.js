/**
 * Hook System for handling pre/post operations
 */
class HookSystem {
    constructor() {
      this.hooks = new Map();
    }
  
    register(hookName) {
      if (!this.hooks.has(hookName)) {
        this.hooks.set(hookName, []);
      }
    }
  
    add(hookName, handler) {
      if (!this.hooks.has(hookName)) {
        throw new Error(`Hook ${hookName} is not registered`);
      }
      this.hooks.get(hookName).push(handler);
    }
  
    async execute(hookName, data) {
      if (!this.hooks.has(hookName)) {
        return data;
      }
  
      let result = data;
      for (const handler of this.hooks.get(hookName)) {
        result = await handler(result);
      }
      return result;
    }
  }