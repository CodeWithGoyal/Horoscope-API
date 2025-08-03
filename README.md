# Personalized Horoscope API

A comprehensive Node.js backend service that generates and serves personalized daily horoscopes for users based on their zodiac sign.

## 🌟 Features

- **User Authentication**: JWT-based signup and login system
- **Auto Zodiac Detection**: Automatically calculates zodiac sign from birthdate
- **Daily Horoscopes**: Personalized horoscope content based on user's zodiac sign
- **History Tracking**: Stores and retrieves last 7 days of horoscope history
- **Rate Limiting**: Prevents API abuse (5 requests per minute)
- **API Documentation**: Complete Swagger/OpenAPI documentation
- **Security**: Helmet, CORS, password hashing, and input validation

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Security**: Helmet, bcryptjs, express-rate-limit
- **Documentation**: Swagger UI with swagger-jsdoc
- **Development**: Nodemon for hot reloading

## 📦 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/CodeWithGoyal/Horoscope-API
cd Horoscope-API
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/horoscope-api

# JWT Secret (change this in production accordingly)
JWT_SECRET=abcd1234!@#$

# Server
PORT=3000
NODE_ENV=development
```

### 4. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**Or use MongoDB Atlas:**
Update the `MONGODB_URI` in your `.env` file with your Atlas connection string.

### 5. Run the Application

**Development mode (with hot reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## 📚 API Documentation

Once the server is running, visit `http://localhost:3000/api-docs` for interactive API documentation.

## 🔗 API Endpoints

### Authentication

#### POST `/api/auth/signup`
Register a new user with automatic zodiac sign detection.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "birthdate": "1990-05-15"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "birthdate": "1990-05-15T00:00:00.000Z",
    "zodiacSign": "Taurus",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST `/api/auth/login`
Login existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Horoscope

#### GET `/api/horoscope/today`
Get today's horoscope for authenticated user.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "zodiacSign": "Taurus",
  "date": "2024-01-01",
  "horoscope": "Patience will be your greatest asset today. Take time to appreciate the simple pleasures in life."
}
```

#### GET `/api/horoscope/history`
Get last 7 days horoscope history for authenticated user.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "zodiacSign": "Taurus",
  "history": [
    {
      "date": "2024-01-01",
      "horoscope": "Today's horoscope..."
    },
    {
      "date": "2023-12-31",
      "horoscope": "Yesterday's horoscope..."
    }
  ]
}
```

### Health Check

#### GET `/api/health`
Check if the API is running.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## 🧪 Testing the API

### Using cURL

**1. Register a new user:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "birthdate": "1990-05-15"
  }'
```

**2. Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**3. Get today's horoscope:**
```bash
curl -X GET http://localhost:3000/api/horoscope/today \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman

1. Import the API collection from the Swagger documentation
2. Set up environment variables for `baseUrl` and `token`
3. Test all endpoints systematically

## 🏗️ Project Structure

```
personalized-horoscope-api/
├── models/
│   ├── User.js                 # User schema with zodiac sign
│   └── HoroscopeHistory.js     # Horoscope history schema
├── routes/
│   ├── auth.js                 # Authentication routes
│   └── horoscope.js            # Horoscope routes
├── middleware/
│   └── auth.js                 # JWT authentication middleware
├── utils/
│   ├── zodiacCalculator.js     # Zodiac sign calculation logic
│   └── horoscopeGenerator.js   # Mock horoscope content generator
├── validation/
│   └── schemas.js              # Joi validation schemas
├── server.js                   # Main server file
├── package.json               # Dependencies and scripts
├── .env                       # Environment variables
├── .gitignore                # Git ignore rules
└── README.md                 # This file
```

## 🔒 Security Features

- **Password Hashing**: Uses bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: 5 requests per minute to prevent abuse
- **Input Validation**: Joi schemas for request validation
- **Security Headers**: Helmet middleware for security headers
- **CORS**: Configurable Cross-Origin Resource Sharing
- **Password Exclusion**: Passwords are never returned in API responses

## 🎯 Design Decisions

### 1. **Database Schema Design**
- **User Model**: Stores essential user info with auto-calculated zodiac sign
- **Horoscope History**: Separate collection for scalability and history tracking
- **Indexes**: Compound index on userId + date to prevent duplicate horoscopes

### 2. **Authentication Strategy**
- **JWT Tokens**: Stateless authentication for scalability
- **7-day Expiry**: Balance between security and user experience
- **Password Security**: bcryptjs with salt for secure password storage

### 3. **Horoscope Generation**
- **Template-based**: Multiple templates per zodiac sign for variety
- **Daily Uniqueness**: Same horoscope for same user on same day
- **History Storage**: All served horoscopes are stored for history feature

### 4. **Rate Limiting**
- **5 requests/minute**: Reasonable limit to prevent abuse
- **Applied to horoscope routes**: Only rate-limit the main functionality
- **IP-based**: Simple but effective rate limiting strategy

### 5. **Error Handling**
- **Structured Responses**: Consistent error response format
- **Input Validation**: Comprehensive validation with user-friendly messages
- **Logging**: Console logging for debugging and monitoring

## 🚀 Improvements for Production

### 1. **Scalability Enhancements**
- **Caching**: Redis for horoscope caching and session management
- **Database Optimization**: Connection pooling and query optimization
- **Microservices**: Split into auth, horoscope, and user services
- **Load Balancing**: Multiple server instances behind a load balancer

### 2. **Personalization Features**
For truly personalized horoscopes (beyond zodiac-specific):

```javascript
// Enhanced User Model
const personalizedUserSchema = {
  // ... existing fields
  preferences: {
    interests: [String],        // career, love, health, finance
    personality: String,        // introvert, extrovert, ambivert
    lifeStage: String,         // student, professional, retired
    goals: [String]            // short-term and long-term goals
  },
  behaviorData: {
    loginFrequency: Number,
    favoriteHoroscopeTypes: [String],
    interactionHistory: [{
      date: Date,
      horoscopeId: ObjectId,
      feedback: String         // liked, disliked, neutral
    }]
  }
};

// Personalized Horoscope Generator
function generatePersonalizedHoroscope(user, contextData) {
  const baseHoroscope = generateHoroscope(user.zodiacSign);
  
  // Layer 1: Interest-based customization
  const interestModifier = getInterestModifier(user.preferences.interests);
  
  // Layer 2: Personality-based tone adjustment
  const personalityTone = getPersonalityTone(user.preferences.personality);
  
  // Layer 3: Life stage context
  const lifeStageContext = getLifeStageContext(user.preferences.lifeStage);
  
  // Layer 4: ML-based personalization (future enhancement)
  const mlPersonalization = await getMLPersonalization(user.behaviorData);
  
  return combinePersonalizationLayers(
    baseHoroscope, 
    interestModifier, 
    personalityTone, 
    lifeStageContext,
    mlPersonalization
  );
}
```

### 3. **Performance Optimizations**
- **Database Sharding**: Horizontal scaling for large user bases
- **CDN Integration**: Static content delivery
- **Background Jobs**: Queue system for heavy computations
- **Monitoring**: Application performance monitoring (APM)

### 4. **Enhanced Security**
- **OAuth Integration**: Google, Facebook login options
- **2FA**: Two-factor authentication for enhanced security
- **API Versioning**: Backward compatibility for mobile apps
- **Rate Limiting per User**: More sophisticated rate limiting
- **Input Sanitization**: XSS and injection attack prevention

### Current Architecture Limitations
- **Single Instance**: No horizontal scaling capability
- **In-Memory Rate Limiting**: Won't work across multiple instances
- **Synchronous Processing**: All operations are blocking

## 🤖 AI Tool Usage

**Disclosure**: This project was developed with assistance from Claude AI for:
- Code structure and best practices recommendations
- Comprehensive error handling patterns
- Security middleware implementation suggestions
- API documentation generation
- Testing strategy development

The core business logic, zodiac calculations, and horoscope content generation were developed independently, with AI assistance primarily for boilerplate code, documentation, and architectural guidance.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
