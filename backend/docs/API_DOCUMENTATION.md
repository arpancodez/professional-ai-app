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

