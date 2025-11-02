/**
 * Standardized API response formatter
 */
class ResponseFormatter {
  /**
   * Success response with data
   */
  static success(data, message = 'Success', meta = {}) {
    return {
      success: true,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta
      }
    };
  }

  /**
   * Error response
   */
  static error(message, errorCode = 'UNKNOWN_ERROR', details = null) {
    return {
      success: false,
      error: {
        code: errorCode,
        message,
        details
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Chat response formatter
   */
  static chatResponse(aiMessage, conversationId = null, tokensUsed = null) {
    return this.success(
      {
        response: aiMessage,
        conversationId
      },
      'Message processed successfully',
      {
        tokensUsed,
        model: 'gpt-3.5-turbo'
      }
    );
  }

  /**
   * Validation error response
   */
  static validationError(errors) {
    return this.error(
      'Validation failed',
      'VALIDATION_ERROR',
      errors
    );
  }

  /**
   * Rate limit error response
   */
  static rateLimitError(retryAfter = null) {
    return this.error(
      'Rate limit exceeded. Please try again later.',
      'RATE_LIMIT_EXCEEDED',
      { retryAfter }
    );
  }

  /**
   * OpenAI API error response
   */
  static openAIError(error) {
    const statusCode = error.response?.status;
    let message = 'AI service error';
    let errorCode = 'AI_SERVICE_ERROR';

    if (statusCode === 429) {
      message = 'AI service rate limit reached';
      errorCode = 'AI_RATE_LIMIT';
    } else if (statusCode === 401) {
      message = 'AI service authentication failed';
      errorCode = 'AI_AUTH_ERROR';
    } else if (statusCode >= 500) {
      message = 'AI service temporarily unavailable';
      errorCode = 'AI_SERVICE_UNAVAILABLE';
    }

    return this.error(message, errorCode, {
      statusCode,
      originalError: error.message
    });
  }
}

module.exports = ResponseFormatter;
