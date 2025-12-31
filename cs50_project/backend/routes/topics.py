from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import date, datetime
try:
    from backend.models import Topic, UserProgress, db
except ModuleNotFoundError:
    from models import Topic, UserProgress, db

topics_bp = Blueprint('topics', __name__)

def get_daily_topic_index():
    """Calculate which topic is the daily topic based on date"""
    today = date.today()
    start_of_year = date(today.year, 1, 1)
    day_of_year = (today - start_of_year).days + 1
    
    # Get total number of topics
    total_topics = Topic.query.count()
    if total_topics == 0:
        return 0
    
    return (day_of_year - 1) % total_topics

@topics_bp.route('/', methods=['GET'])
@jwt_required()
def get_all_topics():
    try:
        user_id = get_jwt_identity()
        topics = Topic.query.order_by(Topic.created_at).all()
        
        # Get user's completed topics
        completed_topic_ids = {
            progress.topic_id 
            for progress in UserProgress.query.filter_by(user_id=user_id).all()
        }
        
        topics_data = []
        for topic in topics:
            topic_dict = topic.to_dict(include_questions=False)
            topic_dict['isCompleted'] = topic.id in completed_topic_ids
            topics_data.append(topic_dict)
        
        return jsonify({'topics': topics_data}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@topics_bp.route('/<topic_id>', methods=['GET'])
@jwt_required()
def get_topic_by_id(topic_id):
    try:
        topic = Topic.query.get(topic_id)
        
        if not topic:
            return jsonify({'error': 'Topic not found'}), 404
        
        return jsonify({'topic': topic.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@topics_bp.route('/daily', methods=['GET'])
@jwt_required()
def get_daily_topic():
    try:
        user_id = get_jwt_identity()
        
        # Get all topics ordered by creation date
        topics = Topic.query.order_by(Topic.created_at).all()
        
        if not topics:
            return jsonify({'error': 'No topics available'}), 404
        
        # Calculate daily topic index
        index = get_daily_topic_index()
        daily_topic = topics[index]
        
        # Check if user has completed today's daily topic
        today = date.today()
        has_completed = UserProgress.query.filter_by(
            user_id=user_id,
            topic_id=daily_topic.id,
            is_daily=True
        ).filter(
            db.func.date(UserProgress.completed_at) == today
        ).first() is not None
        
        topic_dict = daily_topic.to_dict()
        topic_dict['hasCompleted'] = has_completed
        
        return jsonify({'topic': topic_dict}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@topics_bp.route('/<topic_id>/completed', methods=['GET'])
@jwt_required()
def check_topic_completed(topic_id):
    try:
        user_id = get_jwt_identity()
        
        completed = UserProgress.query.filter_by(
            user_id=user_id,
            topic_id=topic_id
        ).first() is not None
        
        return jsonify({'completed': completed}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


