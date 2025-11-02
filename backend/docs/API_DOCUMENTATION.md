# AI Chat API Documentation

## Overview

Professional AI Chat API with OpenAI integration, rate limiting, conversation management, and comprehensive error handling.

**Base URL:** `http://localhost:3001/api` (or your deployed URL)

**Version:** 1.0.0

---

## Authentication

Currently, no authentication is required for basic usage. For production deployment, implement API key authentication or OAuth.

---

## Endpoints

### 1. Health Check

**Endpoint:** `GET /api/health`

**Description:** Checks if the API is running and operational.

**Rate Limit:** 100 requests per minute

**Response:**
{
"status": "ok",
"message": "AI Chat API is running",
"timestamp": "2025-11-02T14:04:00.000Z"
}


**Status Codes:**
- `200 OK` - API is operational

---

### 2. Send Chat Message

**Endpoint:** `POST /api/chat`

**Description:** Sends a message to the AI and receives a response.

**Rate Limit:** 20 requests per minute

**Request Body:**
{
"message": "Your message here",
"conversationId": "optional-uuid-v4",
"promptType": "default"
}


**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | string | Yes | User message (1-4000 characters) |
| `conversationId` | string | No | UUID v4 for conversation context |
| `promptType` | string | No | Prompt type: `default`, `technical`, `creative`, `casual` |

**Success Response:**
{
"success": true,
"message": "Message processed successfully",
"data": {
"response": "AI generated response",
"conversationId": "uuid-v4-here"
},
"meta": {
"timestamp": "2025-11-02T14:04:00.000Z",
"tokensUsed": 150,
"model": "gpt-3.5-turbo"
}
}


**Error Responses:**

**400 Bad Request** - Invalid input
{
"success": false,
"error": {
"code": "VALIDATION_ERROR",
"message": "Validation failed",
"details": ["Message is required"]
},
"meta": {
"timestamp": "2025-11-02T14:04:00.000Z"
}
}

**429 Too Many Requests** - Rate limit exceeded
{
"success": false,
"error": {
"code": "RATE_LIMIT_EXCEEDED",
"message": "Rate limit exceeded. Please try again later.",
"details": {
"retryAfter": "60"
}
},
"meta": {
"timestamp": "2025-11-02T14:04:00.000Z"
}
}

**500 Internal Server Error** - Server error
{
"success": false,
"error": {
"code": "AI_SERVICE_ERROR",
"message": "AI service error",
"details": {
"statusCode": 500,
"originalError": "Connection timeout"
}
},
"meta": {
"timestamp": "2025-11-02T14:04:00.000Z"
}
}


---

## Conversation Management

### Creating a New Conversation

The first message sent without a `conversationId` will automatically create a new conversation and return its ID.

### Continuing a Conversation

Include the `conversationId` from previous responses to maintain conversation context:
{
"message": "Follow-up question",
"conversationId": "previously-received-uuid"
}

### Conversation Timeout

Conversations expire after 30 minutes of inactivity.

---

## Rate Limiting

| Endpoint | Rate Limit |
|----------|------------|
| `/api/health` | 100 requests/minute |
| `/api/chat` | 20 requests/minute |

**Rate Limit Headers:**
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 15
X-RateLimit-Reset: 1699022640


---

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Input validation failed |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `AI_SERVICE_ERROR` | OpenAI API error |
| `AI_RATE_LIMIT` | OpenAI rate limit reached |
| `AI_AUTH_ERROR` | OpenAI authentication failed |
| `AI_SERVICE_UNAVAILABLE` | OpenAI service down |
| `UNKNOWN_ERROR` | Unexpected error |

---

## Input Validation

### Message Requirements

- **Minimum length:** 1 character
- **Maximum length:** 4000 characters
- **Type:** String
- **Sanitization:** HTML entities escaped, dangerous patterns removed

### Spam Detection

Messages are automatically checked for spam patterns:
- Excessive repeated characters
- Multiple URLs (>3)
- High concentration of spam keywords

---

## Best Practices

1. **Handle Rate Limits:** Implement exponential backoff when receiving 429 errors
2. **Store Conversation IDs:** Save conversation IDs for context continuity
3. **Error Handling:** Always handle all possible error codes
4. **Input Validation:** Validate input on client-side before sending
5. **Secure API Keys:** Never expose OpenAI API keys in client code

---

## Example Usage

### JavaScript/TypeScript
const sendMessage = async (message: string, conversationId?: string) => {
try {
const response = await fetch('/api/chat', {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify({
message,
conversationId,
promptType: 'default'
})
});
if (!response.ok) {
  const error = await response.json();
  throw new Error(error.error.message);
}

const data = await response.json();
return data.data;
} catch (error) {
console.error('Chat error:', error);
throw error;
}
};

### Python
import requests

def send_message(message, conversation_id=None):
url = "http://localhost:3001/api/chat"
payload = {
"message": message,
"conversationId": conversation_id
}
try:
    response = requests.post(url, json=payload)
    response.raise_for_status()
    return response.json()
except requests.exceptions.RequestException as e:
    print(f"Error: {e}")
    return None
    

---

## Support

For issues or questions, please open an issue on GitHub.

**Repository:** [professional-ai-app](https://github.com/arpancodez/professional-ai-app)











