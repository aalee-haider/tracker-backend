# ChatGPT Bot Detection API

This is a simple Express.js server that detects whether incoming requests are from ChatGPT's web browsing feature.

## Features

- Detects ChatGPT user agent: `ChatGPT-User/1.0; +https://openai.com/bot`
- Provides JSON responses with detection results
- Includes health check endpoint
- CORS enabled for cross-origin requests

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## Endpoints

### GET /check-chatgpt
Main endpoint that checks for ChatGPT user agent.

**Response when ChatGPT is detected:**
```json
{
  "success": true,
  "message": "ChatGPT bot detected successfully!",
  "userAgent": "ChatGPT-User/1.0; +https://openai.com/bot",
  "timestamp": "2025-07-08T12:00:00.000Z"
}
```

**Response when ChatGPT is NOT detected:**
```json
{
  "success": false,
  "message": "Not a ChatGPT bot request",
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "timestamp": "2025-07-08T12:00:00.000Z"
}
```

### GET /health
Health check endpoint.

### GET /
Root endpoint with API information.

## Using with ngrok

1. Start the server:
```bash
npm start
```

2. In another terminal, expose the server using ngrok:
```bash
ngrok http 3000
```

3. Use the ngrok URL (e.g., `https://abc123.ngrok.io/check-chatgpt`) with ChatGPT.

## Testing

You can test the endpoint by visiting it in a browser or using curl:

```bash
curl https://your-ngrok-url.ngrok.io/check-chatgpt
```

When ChatGPT accesses this URL, it will be detected and you'll get a success response.
