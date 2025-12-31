# System Spark Backend API

Flask REST API backend for the System Design Learning Platform.

## Features

- User authentication with JWT tokens
- Topic management (daily topics, library)
- Quiz submission and progress tracking
- Streak tracking (daily and practice)
- User statistics and profile

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment Variables (Optional)

Create a `.env` file or set environment variables:

```bash
export SECRET_KEY="your-secret-key"
export JWT_SECRET_KEY="your-jwt-secret-key"
export DATABASE_URL="sqlite:///system_spark.db"  # or PostgreSQL URL
```

### 3. Initialize Database

The database will be created automatically when you run the app. To seed initial data:

**Important:** Run from the project root directory (`C:\FinalProject\system-spark`):

```bash
# From project root
python backend/seed_data.py
```

### 4. Run the Server

**Important:** You must run from the project root directory, NOT from inside the backend folder:

```bash
# Navigate to project root first
cd C:\FinalProject\system-spark

#if wnated to run the full backend as a pack the command is
cd c:/FinalProject\system-spark/python -m backend.app

# Then run the app
python backend/app.py

# OR use the run script
python backend/run.py
```

The API will be available at `http://localhost:5000`

**Note:** If you get `ModuleNotFoundError: No module named 'backend'`, make sure you're running from the project root, not from inside the `backend` directory.

## API Endpoints

### Authentication (`/api/auth`)

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires JWT)
- `POST /api/auth/logout` - Logout (client-side token removal)

### Topics (`/api/topics`)

- `GET /api/topics/` - Get all topics (requires JWT)
- `GET /api/topics/<topic_id>` - Get topic by ID (requires JWT)
- `GET /api/topics/daily` - Get today's daily topic (requires JWT)
- `GET /api/topics/<topic_id>/completed` - Check if topic completed (requires JWT)

### Quizzes (`/api/quizzes`)

- `POST /api/quizzes/daily/submit` - Submit daily quiz (requires JWT)
- `POST /api/quizzes/practice/submit` - Submit practice quiz (requires JWT)

### Users (`/api/users`)

- `GET /api/users/profile` - Get user profile with stats (requires JWT)
- `GET /api/users/progress` - Get user progress history (requires JWT)

## Request/Response Examples

### Signup

```json
POST /api/auth/signup
{
  "email": "user@example.com",
  "password": "password123",
  "username": "TestUser"
}

Response:
{
  "user": {
    "id": "user-abc123",
    "email": "user@example.com",
    "username": "TestUser",
    "role": "user",
    "dailyStreak": 0,
    ...
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Login

```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

Response: Same as signup
```

### Get Daily Topic

```json
GET /api/topics/daily
Headers: Authorization: Bearer <token>

Response:
{
  "topic": {
    "id": "1",
    "title": "Load Balancing Fundamentals",
    "description": "...",
    "content": "...",
    "questions": [...],
    "hasCompleted": false
  }
}
```

### Submit Daily Quiz

```json
POST /api/quizzes/daily/submit
Headers: Authorization: Bearer <token>
{
  "correctCount": 4,
  "totalQuestions": 5
}

Response:
{
  "newStreak": 1,
  "streakIncreased": true,
  "user": {...}
}
```

## Database Schema

- **users**: User accounts with streaks and statistics
- **topics**: Learning topics with content
- **questions**: Quiz questions for each topic
- **user_progress**: Tracks user completions and quiz results

## Development

The app uses SQLite by default for development. For production, use PostgreSQL or another production database.

JWT tokens expire after 7 days. Adjust in `app.py` if needed.

CORS is enabled for all origins in development. Restrict in production.

