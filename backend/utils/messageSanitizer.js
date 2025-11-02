const validator = require('validator');

/**
 * Sanitizes user input to prevent XSS and injection attacks
 */
class MessageSanitizer {
  /**
   * Sanitizes user message
   */
  static sanitize(message) {
    if (typeof message !== 'string') {
      throw new TypeError('Message must be a string');
    }

    // Remove leading/trailing whitespace
    let sanitized = message.trim();

    // Escape HTML entities to prevent XSS
    sanitized = validator.escape(sanitized);

    // Remove potentially dangerous patterns
    sanitized = this.removeDangerousPatterns(sanitized);

    // Normalize whitespace
    sanitized = this.normalizeWhitespace(sanitized);

    return sanitized;
  }

  /**
   * Removes dangerous patterns from message
   */
  static removeDangerousPatterns(message) {
    // Remove script tags (should already be escaped, but extra safety)
    let cleaned = message.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Remove null bytes
    cleaned = cleaned.replace(/\0/g, '');

    // Remove excessive special characters that might indicate injection attempts
    cleaned = cleaned.replace(/[<>{}]/g, '');

    return cleaned;
  }

  /**
   * Normalizes whitespace in message
   */
  static normalizeWhitespace(message) {
    // Replace multiple spaces with single space
    let normalized = message.replace(/\s+/g, ' ');

    // Replace multiple newlines with maximum of 2
    normalized = normalized.replace(/\n{3,}/g, '\n\n');

    return normalized.trim();
  }

  /**
   * Validates message content
   */
  static validate(message, options = {}) {
    const {
      minLength = 1,
      maxLength = 4000,
      allowEmpty = false
    } = options;

    const errors = [];

    if (!allowEmpty && message.length === 0) {
      errors.push('Message cannot be empty');
    }

    if (message.length < minLength) {
      errors.push(`Message must be at least ${minLength} characters`);
    }

    if (message.length > maxLength) {
      errors.push(`Message cannot exceed ${maxLength} characters`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Checks for spam patterns
   */
  static isSpam(message) {
    const spamPatterns = [
      /(.)\1{10,}/i, // Repeated characters
      /https?:\/\//gi, // Multiple URLs
      /\b(buy|sell|click here|subscribe|winner)\b/gi // Spam keywords
    ];

    // Check for repeated characters
    const repeatedChars = (message.match(/(.)\1{10,}/g) || []).length;
    if (repeatedChars > 0) return true;

    // Check for multiple URLs
    const urlCount = (message.match(/https?:\/\//gi) || []).length;
    if (urlCount > 3) return true;

    // Check for spam keywords
    const spamKeywordMatches = spamPatterns
      .slice(2)
      .reduce((count, pattern) => count + (message.match(pattern) || []).length, 0);
    
    if (spamKeywordMatches > 5) return true;

    return false;
  }
}

module.exports = MessageSanitizer;
