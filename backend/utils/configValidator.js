/**
 * Validates environment configuration on startup
 */
class ConfigValidator {
  constructor() {
    this.requiredVars = ['OPENAI_API_KEY'];
    this.optionalVars = ['PORT', 'NODE_ENV'];
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Validates all required environment variables
   */
  validate() {
    this.errors = [];
    this.warnings = [];

    // Check required variables
    this.requiredVars.forEach(varName => {
      if (!process.env[varName]) {
        this.errors.push(`Missing required environment variable: ${varName}`);
      } else if (varName === 'OPENAI_API_KEY') {
        this.validateOpenAIKey(process.env[varName]);
      }
    });

    // Check optional variables
    this.optionalVars.forEach(varName => {
      if (!process.env[varName]) {
        this.warnings.push(`Optional environment variable not set: ${varName}`);
      }
    });

    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    };
  }

  /**
   * Validates OpenAI API key format
   */
  validateOpenAIKey(key) {
    if (!key.startsWith('sk-')) {
      this.warnings.push('OpenAI API key format may be incorrect (should start with "sk-")');
    }

    if (key.length < 40) {
      this.warnings.push('OpenAI API key appears to be too short');
    }
  }

  /**
   * Validates PORT configuration
   */
  validatePort() {
    const port = process.env.PORT;
    
    if (port) {
      const portNum = parseInt(port, 10);
      if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
        this.errors.push(`Invalid PORT value: ${port} (must be between 1 and 65535)`);
      }
    }
  }

  /**
   * Prints validation results
   */
  printResults() {
    const result = this.validate();

    if (result.errors.length > 0) {
      console.error('❌ Configuration Errors:');
      result.errors.forEach(err => console.error(`  - ${err}`));
    }

    if (result.warnings.length > 0) {
      console.warn('⚠️  Configuration Warnings:');
      result.warnings.forEach(warn => console.warn(`  - ${warn}`));
    }

    if (result.isValid && result.warnings.length === 0) {
      console.log('✅ Configuration validated successfully');
    }

    return result;
  }
}

module.exports = new ConfigValidator();
