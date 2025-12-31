from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, date

# db will be initialized in app.py
db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.String(50), primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    username = db.Column(db.String(80), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='user', nullable=False)
    
    # Streak tracking
    daily_streak = db.Column(db.Integer, default=0)
    practice_streak = db.Column(db.Integer, default=0)
    best_daily_streak = db.Column(db.Integer, default=0)
    best_practice_streak = db.Column(db.Integer, default=0)
    
    # Progress tracking
    topics_completed = db.Column(db.Integer, default=0)
    total_quizzes = db.Column(db.Integer, default=0)
    correct_answers = db.Column(db.Integer, default=0)
    
    # Last completion dates
    last_daily_completion = db.Column(db.Date, nullable=True)
    last_practice_completion = db.Column(db.Date, nullable=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    progress = db.relationship('UserProgress', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'username': self.username,
            'role': self.role,
            'dailyStreak': self.daily_streak,
            'practiceStreak': self.practice_streak,
            'bestDailyStreak': self.best_daily_streak,
            'bestPracticeStreak': self.best_practice_streak,
            'topicsCompleted': self.topics_completed,
            'totalQuizzes': self.total_quizzes,
            'correctAnswers': self.correct_answers,
            'lastDailyCompletion': self.last_daily_completion.isoformat() if self.last_daily_completion else None,
            'lastPracticeCompletion': self.last_practice_completion.isoformat() if self.last_practice_completion else None
        }

class Topic(db.Model):
    __tablename__ = 'topics'
    
    id = db.Column(db.String(50), primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(500), nullable=True)
    category = db.Column(db.String(100), nullable=False)
    difficulty = db.Column(db.String(20), nullable=False)  # Beginner, Intermediate, Advanced
    estimated_time = db.Column(db.Integer, nullable=False)  # minutes
    created_at = db.Column(db.Date, default=date.today)
    
    # Relationships
    questions = db.relationship('Question', backref='topic', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self, include_questions=True):
        data = {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'content': self.content,
            'imageUrl': self.image_url,
            'category': self.category,
            'difficulty': self.difficulty,
            'estimatedTime': self.estimated_time,
            'createdAt': self.created_at.isoformat() if self.created_at else None
        }
        if include_questions:
            data['questions'] = [q.to_dict() for q in self.questions]
        return data

class Question(db.Model):
    __tablename__ = 'questions'
    
    id = db.Column(db.String(50), primary_key=True)
    topic_id = db.Column(db.String(50), db.ForeignKey('topics.id'), nullable=False)
    question = db.Column(db.Text, nullable=False)
    options = db.Column(db.JSON, nullable=False)  # List of strings
    correct_index = db.Column(db.Integer, nullable=False)
    explanation = db.Column(db.Text, nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'topicId': self.topic_id,
            'question': self.question,
            'options': self.options,
            'correctIndex': self.correct_index,
            'explanation': self.explanation
        }

class UserProgress(db.Model):
    __tablename__ = 'user_progress'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(50), db.ForeignKey('users.id'), nullable=False, index=True)
    topic_id = db.Column(db.String(50), db.ForeignKey('topics.id'), nullable=False, index=True)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_daily = db.Column(db.Boolean, default=False)
    correct_count = db.Column(db.Integer, default=0)
    total_questions = db.Column(db.Integer, default=0)
    
    # Unique constraint: user can only complete a topic once per day for daily
    __table_args__ = (db.UniqueConstraint('user_id', 'topic_id', 'completed_at', name='unique_user_topic_daily'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'topicId': self.topic_id,
            'completedAt': self.completed_at.isoformat(),
            'isDaily': self.is_daily,
            'correctCount': self.correct_count,
            'totalQuestions': self.total_questions
        }

