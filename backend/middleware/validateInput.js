const validator = require('validator');

/**
 * Validates chat message input
 */
const validateChatInput = (req, res, next) => {
  const { message } = req.body;

  // Check if message exists
  if (!message) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Message field is required'
    });
  }

  // Check message type
  if (typeof message !== 'string') {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Message must be a string'
    });
  }

  // Check message length
  const trimmedMessage = message.trim();
  if (trimmedMessage.length === 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Message cannot be empty'
    });
  }

  if (trimmedMessage.length > 4000) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Message exceeds maximum length of 4000 characters'
    });
  }

  // Sanitize and store cleaned message
  req.body.message = validator.escape(trimmedMessage);
  req.body.originalMessage = trimmedMessage;

  next();
};

/**
 * Validates conversation ID for context-aware chats
 */
const validateConversationId = (req, res, next) => {
  const { conversationId } = req.body;

  if (conversationId && !validator.isUUID(conversationId)) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid conversation ID format'
    });
  }

  next();
};

module.exports = {
  validateChatInput,
  validateConversationId
};
