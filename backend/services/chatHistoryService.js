const { v4: uuidv4 } = require('uuid');

class ChatHistoryService {
  constructor() {
    // In-memory storage (consider Redis for production)
    this.conversations = new Map();
    this.maxMessagesPerConversation = 50;
    this.conversationTimeout = 30 * 60 * 1000; // 30 minutes
  }

  /**
   * Creates a new conversation
   */
  createConversation() {
    const conversationId = uuidv4();
    this.conversations.set(conversationId, {
      id: conversationId,
      messages: [],
      createdAt: new Date(),
      lastActivity: new Date()
    });
    return conversationId;
  }

  /**
   * Adds a message to conversation history
   */
  addMessage(conversationId, role, content) {
    const conversation = this.conversations.get(conversationId);
    
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const message = {
      role,
      content,
      timestamp: new Date()
    };

    conversation.messages.push(message);
    conversation.lastActivity = new Date();

    // Trim old messages if exceeding limit
    if (conversation.messages.length > this.maxMessagesPerConversation) {
      conversation.messages = conversation.messages.slice(-this.maxMessagesPerConversation);
    }

    return message;
  }

  /**
   * Gets conversation history formatted for OpenAI
   */
  getConversationHistory(conversationId, maxMessages = 10) {
    const conversation = this.conversations.get(conversationId);
    
    if (!conversation) {
      return [];
    }

    // Update last activity
    conversation.lastActivity = new Date();

    // Return recent messages
    return conversation.messages
      .slice(-maxMessages)
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }));
  }

  /**
   * Clears old conversations
   */
  cleanupOldConversations() {
    const now = Date.now();
    
    for (const [id, conversation] of this.conversations.entries()) {
      const inactiveTime = now - conversation.lastActivity.getTime();
      
      if (inactiveTime > this.conversationTimeout) {
        this.conversations.delete(id);
      }
    }
  }

  /**
   * Gets conversation metadata
   */
  getConversationInfo(conversationId) {
    const conversation = this.conversations.get(conversationId);
    
    if (!conversation) {
      return null;
    }

    return {
      id: conversation.id,
      messageCount: conversation.messages.length,
      createdAt: conversation.createdAt,
      lastActivity: conversation.lastActivity
    };
  }
}

// Singleton instance
const chatHistoryService = new ChatHistoryService();

// Cleanup old conversations every 10 minutes
setInterval(() => {
  chatHistoryService.cleanupOldConversations();
}, 10 * 60 * 1000);

module.exports = chatHistoryService;
