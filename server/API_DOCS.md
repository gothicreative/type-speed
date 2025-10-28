# SpeedType Trainer API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

### Register a new user
```
POST /register
```

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "userId": "string"
}
```

### Login user
```
POST /login
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "userId": "string",
  "username": "string",
  "subscription": "string"
}
```

## User Management

### Get user stats
```
GET /users/:userId/stats
```

**Response:**
```json
{
  "user": {
    "username": "string",
    "subscription": "string",
    "wpm": "number",
    "accuracy": "number",
    "testsTaken": "number"
  },
  "recentResults": [
    {
      "userId": "string",
      "wpm": "number",
      "accuracy": "number",
      "timeTaken": "number",
      "textLength": "number",
      "createdAt": "date"
    }
  ]
}
```

### Update user subscription
```
PATCH /users/:userId/subscription
```

**Request Body:**
```json
{
  "subscription": "string" // 'free', 'pro', or 'trainer'
}
```

**Response:**
```json
{
  "message": "Subscription updated successfully",
  "subscription": "string"
}
```

## Typing Test Results

### Save test result
```
POST /results
```

**Request Body:**
```json
{
  "userId": "string",
  "wpm": "number",
  "accuracy": "number",
  "timeTaken": "number",
  "textLength": "number"
}
```

**Response:**
```json
{
  "message": "Result saved successfully",
  "resultId": "string"
}
```

## Error Responses

All error responses follow this format:
```json
{
  "message": "Error description",
  "error": "Detailed error information (optional)"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error