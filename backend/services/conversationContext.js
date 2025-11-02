/**
 * Manages conversation context and system prompts
 */
class ConversationContextManager {
  constructor() {
    this.systemPrompts = {
      default: 'You are a helpful, professional AI assistant. Provide clear, concise, and accurate responses.',
      technical: 'You are an expert technical assistant specializing in programming, software development, and technology. Provide detailed, accurate technical guidance.',
      creative: 'You are a creative assistant helping with writing, brainstorming, and creative projects. Be imaginative and supportive.',
      casual: 'You are a friendly, conversational AI assistant. Keep responses natural and engaging while being helpful.'
    };
  }

  /**
   * Gets system prompt based on conversation type
   */
  getSystemPrompt(promptType = 'default') {
    return this.systemPrompts[promptType] || this.systemPrompts.default;
  }

  /**
   * Builds message array for OpenAI with conversation history
   */
  buildMessageArray(userMessage, conversationHistory = [], promptType = 'default') {
    const messages = [
      {
        role: 'system',
        content: this.getSystemPrompt(promptType)
      }
    ];

    // Add conversation history
    if (conversationHistory.length > 0) {
      messages.push(...conversationHistory);
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: userMessage
    });

    return messages;
  }

  /**
   * Extracts conversation metadata from messages
   */
  analyzeConversation(messages) {
    const userMessages = messages.filter(m => m.role === 'user').length;
    const aiMessages = messages.filter(m => m.role === 'assistant').length;
    const totalTokensEstimate = messages.reduce(
      (sum, msg) => sum + this.estimateTokens(msg.content),
      0
    );

    return {
      userMessages,
      aiMessages,
      totalMessages: messages.length,
      estimatedTokens: totalTokensEstimate
    };
  }

  /**
   * Simple token estimation (rough approximation)
   */
  estimateTokens(text) {
    // Rough estimate: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  /**
   * Summarizes conversation for context window management
   */
  summarizeConversation(messages, maxLength = 500) {
    if (messages.length === 0) return '';

    const recentMessages = messages.slice(-5); // Last 5 messages
    const summary = recentMessages
      .map(msg => `${msg.role}: ${msg.content.substring(0, 100)}`)
      .join('\n');

    return summary.substring(0, maxLength);
  }
}

module.exports = new ConversationContextManager();
