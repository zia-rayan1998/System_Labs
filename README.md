# SystemDesign Learning Platform

A full-stack web application for learning system design concepts through daily topics, interactive quizzes, and streak tracking. Built with React (TypeScript) frontend and Flask (Python) backend.

![SystemDesign Platform](https://img.shields.io/badge/React-18.3-blue) ![Flask](https://img.shields.io/badge/Flask-2.3-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 Features

- **Daily Topics**: New system design topic every day with curated content
- **Interactive Quizzes**: Test your knowledge with 5-question quizzes
- **Streak Tracking**: Maintain daily and practice streaks with GitHub-style contribution graphs
- **Progress Tracking**: Monitor your learning journey with detailed statistics
- **Modern UI**: Beautiful light theme with navy blue and green color scheme
- **JWT Authentication**: Secure user authentication and session management
- **RESTful API**: Clean, well-structured backend API

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Frontend-Backend Integration](#frontend-backend-integration)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Deployment](#deployment)

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router** for navigation
- **TanStack Query** for data fetching
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Framer Motion** for animations

### Backend
- **Flask** (Python 3.8+)
- **SQLAlchemy** for ORM
- **Flask-JWT-Extended** for authentication
- **Flask-CORS** for cross-origin requests
- **SQLite** database (easily switchable to PostgreSQL/MySQL)

## 🏗 Architecture

This is a full-stack application with clear separation between frontend and backend:

```
┌─────────────────┐         ┌─────────────────┐
│   React App     │  HTTP   │   Flask API     │
│   (Frontend)    │◄───────►│   (Backend)     │
│   Port: 8080    │         │   Port: 5000    │
└─────────────────┘         └─────────────────┘
                                      │
                                      ▼
                              ┌───────────────┐
                              │   SQLite DB   │
                              └───────────────┘
```

### Frontend-Backend Integration

The frontend and backend communicate through a RESTful API. Here's how the integration works:

#### 1. **API Service Layer** (`src/lib/api.ts`)

A centralized API service handles all backend communication:

- **Authentication**: JWT tokens stored in localStorage
- **Automatic Token Management**: Tokens are automatically included in requests
- **Error Handling**: Centralized error handling with automatic redirect on 401
- **Type Safety**: Full TypeScript support for all API responses

```typescript
// Example API call
const topic = await topicsAPI.getDailyTopic();
```

#### 2. **Authentication Flow**

1. User logs in/signs up → Backend returns JWT token
2. Token stored in localStorage
3. Token included in Authorization header for all requests
4. On 401 (unauthorized), token is cleared and user redirected to login

#### 3. **State Management**

- **AuthContext**: Manages user authentication state
- **React Query**: Handles data fetching, caching, and refetching
- **Real-time Updates**: User stats refresh after quiz completion

#### 4. **API Endpoints Used**

```
POST   /api/auth/login          - User login
POST   /api/auth/signup         - User registration
GET    /api/auth/me             - Get current user
GET    /api/topics/daily        - Get today's daily topic
GET    /api/topics              - Get all topics
GET    /api/topics/:id          - Get topic by ID
POST   /api/quizzes/daily/submit - Submit daily quiz
POST   /api/quizzes/practice/submit - Submit practice quiz
```

#### 5. **Development Proxy**

During development, Vite proxies `/api` requests to the Flask backend:

```typescript
// vite.config.ts
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
  },
}
```

This allows the frontend to make requests to `/api/*` which are automatically forwarded to `http://localhost:5000/api/*`.

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.8+
- **pip** (Python package manager)

### Installation

#### 1. Clone the repository

```bash
git clone <repository-url>
cd system-spark
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database (creates system_spark.db)
python app.py
```

The backend will start on `http://localhost:5000`

#### 3. Frontend Setup

```bash
# Navigate to root directory
cd ..

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:8080`

### Seed Data (Optional)

To populate the database with sample topics and questions:

```bash
cd backend
python seed_data.py
```

## 📁 Project Structure

```
system-spark/
├── backend/
│   ├── __init__.py
│   ├── app.py                 # Flask application entry point
│   ├── models.py              # SQLAlchemy models
│   ├── requirements.txt       # Python dependencies
│   ├── seed_data.py          # Database seeding script
│   └── routes/
│       ├── __init__.py
│       ├── auth.py            # Authentication routes
│       ├── topics.py          # Topic-related routes
│       ├── quizzes.py         # Quiz submission routes
│       └── users.py           # User profile routes
│
├── src/
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── QuizSection.tsx
│   │   ├── StreakGraph.tsx   # GitHub-style contribution graph
│   │   └── ...
│   ├── contexts/
│   │   └── AuthContext.tsx   # Authentication context
│   ├── lib/
│   │   ├── api.ts            # API service layer
│   │   └── utils.ts
│   ├── pages/
│   │   ├── AuthPage.tsx
│   │   ├── DailyTopicPage.tsx
│   │   ├── LibraryPage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── TopicDetailPage.tsx
│   ├── App.tsx
│   └── main.tsx
│
├── public/                    # Static assets
├── package.json              # Frontend dependencies
├── vite.config.ts            # Vite configuration
├── tailwind.config.ts        # Tailwind CSS configuration
└── README.md
```

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/signup`
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "Username"
}
```

**Response:**
```json
{
  "user": { ... },
  "token": "jwt_token_here"
}
```

#### POST `/api/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": { ... },
  "token": "jwt_token_here"
}
```

#### GET `/api/auth/me`
Get current user information (requires JWT token).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

### Topics Endpoints

#### GET `/api/topics/daily`
Get today's daily topic (requires JWT token).

#### GET `/api/topics`
Get all available topics (requires JWT token).

#### GET `/api/topics/:id`
Get a specific topic by ID (requires JWT token).

### Quiz Endpoints

#### POST `/api/quizzes/daily/submit`
Submit daily quiz answers.

**Request Body:**
```json
{
  "correctCount": 4,
  "totalQuestions": 5
}
```

#### POST `/api/quizzes/practice/submit`
Submit practice quiz answers.

**Request Body:**
```json
{
  "topicId": "topic-1",
  "correctCount": 5,
  "totalQuestions": 5
}
```

## 🔐 Environment Variables

Create a `.env` file in the backend directory:

```env
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
DATABASE_URL=sqlite:///system_spark.db
```

For production, use stronger secrets and a production database (PostgreSQL recommended).

## 💻 Development

### Running Both Servers

You need both servers running simultaneously:

**Terminal 1 - Backend:**
```bash
cd backend
python app.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Building for Production

**Frontend:**
```bash
npm run build
```

The built files will be in the `dist/` directory.

**Backend:**
For production, use a WSGI server like Gunicorn:

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 "app:create_app()"
```

## 🎨 UI/UX Features

### Color Theme

The application uses a light theme with:
- **Primary Color**: Light Navy Blue (`hsl(210 60% 45%)`)
- **Secondary/Accent**: Green (`hsl(150 50-60% 40-50%)`)
- **Background**: Light (`hsl(210 40% 98%)`)

### GitHub-Style Streak Graph

The profile page features a contribution graph similar to GitHub's:
- 371 days of activity visualization
- Color intensity based on activity level
- Interactive tooltips showing contribution count and date
- Responsive design for all screen sizes

### Responsive Design

The application is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px - 1920px)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

## 🚢 Deployment

### Frontend Deployment

The frontend can be deployed to:
- **Vercel** (recommended for React apps)
- **Netlify**
- **GitHub Pages**
- Any static hosting service

### Backend Deployment

The backend can be deployed to:
- **Heroku**
- **Railway**
- **Render**
- **AWS/GCP/Azure**
- Any Python hosting service

**Important:** Update the `API_BASE_URL` in production to point to your deployed backend.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - *Initial work*

## 🙏 Acknowledgments

- shadcn/ui for the excellent component library
- Flask team for the amazing framework
- React team for the powerful UI library

---

**Happy Learning!** 🔥
