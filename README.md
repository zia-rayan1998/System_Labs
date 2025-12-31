# System-Mentor  SystemDesign Learning Platform

A full-stack web application for learning system design concepts through daily topics, interactive quizzes, and streak tracking.The platform encourages consistency by offering one daily topic and quiz per day while also allowing users to practice topics freely from a library. Built with React (TypeScript) frontend and Flask (Python) backend.

[watch the video on final project](https://youtu.be/81bSXCDsKkU)

# why i build this 
I built this project to help beginners learn system design in a structured and consistent way. While preparing for technical interviews and consulting with seniors, I realized that system design is crucial for strong placements and understanding real-world application scaling, yet learning resources are scattered and lack a clear path or daily accountability.

To address this, I designed the platform around one focused topic per day, combined with short quizzes and streak tracking similar to LeetCode. This approach encourages consistency, reinforces learning through practice, and makes system design easier to grasp by breaking it into manageable steps.

Technically, this project helped me strengthen my full-stack skills by building RESTful APIs, implementing JWT authentication, handling secure frontend–backend communication, and managing application state using modern React patterns. I also gained valuable experience in structuring scalable codebases and connecting frontend and backend using CORS.

# project motivation

-**System Design is often difficult for beginners because**:
- Resources are scattered
- Learning lacks structure
- There is no daily accountability

- **This project solves that by**:
- Providing one focused topic per day which create user interest in system design 
- Reinforcing learning through short quizzes, which helps user tests their knowledge
- Tracking progress with daily streaks like we do on leetcode and geekforgeeks
- Offering a topic library for revision which can help them understand other topics in details


![SystemDesign Platform](https://img.shields.io/badge/React-18.3-blue) ![Flask](https://img.shields.io/badge/Flask-2.3-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue) 

## 📚 What I Learned

- Designing RESTful APIs with Flask
- JWT authentication and secure session handling
- Managing global state with React Context
- Data fetching and caching using React Query
- Designing consistent UI/UX systems
- Building streak logic and progress tracking


## 🚀 Features

- **Daily Topics**: New system design topic every day with curated content
- **Interactive Quizzes**: Test your knowledge with 5-question quizzes
- **Streak Tracking**: Maintain daily and practice streaks with GitHub-style contribution graphs
- **Progress Tracking**: Monitor your learning journey with detailed statistics
- **Modern UI**: Beautiful light theme with navy blue and green color scheme
- **JWT Authentication**: Secure user authentication and session management
- **RESTful API**: Clean, well-structured backend API

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


## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.8+
- **pip** (Python package manager)

The frontend will start on `http://localhost:8080`
The backend will start on `http://localhost:5000`



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



## 🔐 Environment Variables

Create a `.env` file in the backend directory:

```env
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
DATABASE_URL=sqlite:///system_spark.db
```

For production, use stronger secrets and a production database (PostgreSQL recommended).

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

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 👥 Author

- *Mohammed ZIa uddin*

---

**Happy Learning! Thank u** 🔥
