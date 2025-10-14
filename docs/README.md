# Documentation

## Overview
This directory contains documentation for the Professional AI App project.

## Table of Contents
1. [Setup Guide](#setup-guide)
2. [API Documentation](#api-documentation)
3. [Deployment Guide](#deployment-guide)
4. [Architecture](#architecture)

## Setup Guide

### Backend Setup
1. Navigate to the `backend` directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Add your OpenAI API key to the `.env` file
5. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the `frontend` directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## API Documentation

### Endpoints

#### Health Check
- **URL:** `/api/health`
- **Method:** `GET`
- **Response:**
  ```json
  {
    "status": "ok",
    "message": "AI Chat API is running"
  }
  ```

#### Chat
- **URL:** `/api/chat`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "message": "Your message here"
  }
  ```
- **Response:**
  ```json
  {
    "response": "AI response",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
  ```

## Deployment Guide

### Cloud Tunnel Setup for Mobile HTTPS Access

#### Using Ngrok
1. Install ngrok: https://ngrok.com/download
2. Start your backend server
3. Run ngrok:
   ```bash
   ngrok http 3001
   ```
4. Use the provided HTTPS URL for mobile access

#### Using Cloudflare Tunnel
1. Install cloudflared
2. Authenticate: `cloudflared login`
3. Create tunnel:
   ```bash
   cloudflared tunnel --url http://localhost:3001
   ```

### Environment Variables
Make sure to set the following environment variables:
- `OPENAI_API_KEY`: Your OpenAI API key
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)

## Architecture

### Frontend Architecture
- **Framework:** React with TypeScript
- **State Management:** React Hooks (useState)
- **Styling:** CSS with mobile-responsive design
- **API Communication:** Fetch API

### Backend Architecture
- **Framework:** Express.js
- **AI Integration:** OpenAI API (GPT-3.5-turbo)
- **Middleware:** CORS, JSON body parser
- **Error Handling:** Comprehensive error handling with appropriate status codes

### Security Considerations
- Never commit `.env` files with actual API keys
- Use HTTPS for all production deployments
- Implement rate limiting for API endpoints
- Validate and sanitize user inputs

## Mobile Access
To access the app from mobile devices:
1. Set up a cloud tunnel (ngrok, cloudflare, etc.)
2. Obtain the HTTPS URL
3. Open the URL on your mobile device
4. The responsive design ensures optimal mobile experience

## Support
For issues, questions, or contributions, please refer to the main README.md in the repository root.
