/**
 * Jest test configuration and setup
 */

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.OPENAI_API_KEY = 'sk-test-mock-key-for-testing-purposes';
process.env.PORT = '3001';

// Global test utilities
global.testUtils = {
  /**
   * Creates a mock request object
   */
  mockRequest: (body = {}, params = {}, query = {}) => ({
    body,
    params,
    query,
    headers: {},
    get: function(header) {
      return this.headers[header];
    }
  }),

  /**
   * Creates a mock response object
   */
  mockResponse: () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.getHeader = jest.fn();
    res.setHeader = jest.fn();
    return res;
  },

  /**
   * Creates a mock next function
   */
  mockNext: () => jest.fn(),

  /**
   * Waits for a specified time (for async testing)
   */
  wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  /**
   * Mock chat message
   */
  mockChatMessage: {
    message: 'Hello, AI assistant!',
    conversationId: null
  },

  /**
   * Mock AI response
   */
  mockAIResponse: {
    choices: [{
      message: {
        content: 'Hello! How can I help you today?',
        role: 'assistant'
      }
    }],
    usage: {
      total_tokens: 25
    }
  }
};

// Console suppression for cleaner test output
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn()
};

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Cleanup after all tests
afterAll(() => {
  // Add any necessary cleanup
});

module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'middleware/**/*.js',
    'services/**/*.js',
    'utils/**/*.js',
    '!**/*.test.js',
    '!**/node_modules/**'
  ],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  verbose: true
};
