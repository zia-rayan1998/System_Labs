from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import date, datetime, timedelta
from backend.models import User, UserProgress, Topic, db

quizzes_bp = Blueprint('quizzes', __name__)

def get_daily_topic():
    """Helper function to get today's daily topic"""
    topics = Topic.query.order_by(Topic.created_at).all()
    if not topics:
        return None
    
    today = date.today()
    start_of_year = date(today.year, 1, 1)
    day_of_year = (today - start_of_year).days + 1
    index = (day_of_year - 1) % len(topics)
    
    return topics[index]

def update_streak(user, is_daily=True):
    """Update user streak based on completion"""
    today = date.today()
    yesterday = today - timedelta(days=1)
    
    if is_daily:
        last_completion = user.last_daily_completion
        
        if last_completion == today:
            # Already completed today, don't update streak
            return user.daily_streak
        
        if last_completion == yesterday:
            # Consecutive day
            new_streak = user.daily_streak + 1
        elif last_completion is None:
            # First completion
            new_streak = 1
        else:
            # Streak broken
            new_streak = 1
        
        user.daily_streak = new_streak
        user.best_daily_streak = max(new_streak, user.best_daily_streak)
        user.last_daily_completion = today
        
        return new_streak
    else:
        # Practice streak (simplified - just increment)
        new_streak = user.practice_streak + 1
        user.practice_streak = new_streak
        user.best_practice_streak = max(new_streak, user.best_practice_streak)
        user.last_practice_completion = today
        
        return new_streak

@quizzes_bp.route('/daily/submit', methods=['POST'])
@jwt_required()
def submit_daily_quiz():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        correct_count = data.get('correctCount', 0)
        total_questions = data.get('totalQuestions', 0)
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Check if already completed today
        today = date.today()
        daily_topic = get_daily_topic()
        
        existing_progress = UserProgress.query.filter_by(
            user_id=user_id,
            topic_id=daily_topic.id,
            is_daily=True
        ).filter(
            db.func.date(UserProgress.completed_at) == today
        ).first()
        
        if existing_progress:
            return jsonify({
                'message': 'Already completed today',
                'newStreak': user.daily_streak,
                'streakIncreased': False
            }), 200
        
        # Update streak
        new_streak = update_streak(user, is_daily=True)
        streak_increased = new_streak > (user.daily_streak - 1) if user.daily_streak > 0 else True
        
        # Update user stats
        user.topics_completed = len(set(
            progress.topic_id 
            for progress in UserProgress.query.filter_by(user_id=user_id).all()
        )) + 1
        user.total_quizzes += 1
        user.correct_answers += correct_count
        
        # Create progress record
        progress = UserProgress(
            user_id=user_id,
            topic_id=daily_topic.id,
            is_daily=True,
            correct_count=correct_count,
            total_questions=total_questions,
            completed_at=datetime.utcnow()
        )
        
        db.session.add(progress)
        db.session.commit()
        
        return jsonify({
            'newStreak': new_streak,
            'streakIncreased': streak_increased,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@quizzes_bp.route('/practice/submit', methods=['POST'])
@jwt_required()
def submit_practice_quiz():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        topic_id = data.get('topicId')
        correct_count = data.get('correctCount', 0)
        total_questions = data.get('totalQuestions', 0)
        
        if not topic_id:
            return jsonify({'error': 'Topic ID is required'}), 400
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        topic = Topic.query.get(topic_id)
        if not topic:
            return jsonify({'error': 'Topic not found'}), 404
        
        # Update practice streak
        new_streak = update_streak(user, is_daily=False)
        
        # Update user stats
        user.total_quizzes += 1
        user.correct_answers += correct_count
        
        # Check if topic already completed (for topics_completed count)
        existing_progress = UserProgress.query.filter_by(
            user_id=user_id,
            topic_id=topic_id
        ).first()
        
        if not existing_progress:
            user.topics_completed = len(set(
                progress.topic_id 
                for progress in UserProgress.query.filter_by(user_id=user_id).all()
            )) + 1
        
        # Create progress record
        progress = UserProgress(
            user_id=user_id,
            topic_id=topic_id,
            is_daily=False,
            correct_count=correct_count,
            total_questions=total_questions,
            completed_at=datetime.utcnow()
        )
        
        db.session.add(progress)
        db.session.commit()
        
        return jsonify({
            'newStreak': new_streak,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


