const fs = require('fs');
const path = require('path');

class ErrorLogger {
  constructor() {
    this.logDir = path.join(__dirname, '../logs');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  formatError(error, context = {}) {
    return {
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      context,
      environment: process.env.NODE_ENV || 'development'
    };
  }

  log(error, context = {}) {
    const formattedError = this.formatError(error, context);
    
    // Console output for development
    if (process.env.NODE_ENV !== 'production') {
      console.error('🚨 Error logged:', JSON.stringify(formattedError, null, 2));
    }

    // File logging
    const logFile = path.join(
      this.logDir,
      `error-${new Date().toISOString().split('T')[0]}.log`
    );

    const logEntry = JSON.stringify(formattedError) + '\n';
    
    fs.appendFile(logFile, logEntry, (err) => {
      if (err) {
        console.error('Failed to write to error log:', err);
      }
    });

    return formattedError;
  }

  // Log OpenAI specific errors with API details
  logOpenAIError(error, userMessage) {
    const context = {
      service: 'OpenAI',
      userMessage: userMessage.substring(0, 100), // First 100 chars
      statusCode: error.response?.status,
      apiError: error.response?.data
    };

    return this.log(error, context);
  }
}

module.exports = new ErrorLogger();
