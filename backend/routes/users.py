from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
try:
    from backend.models import User, UserProgress, db
except ModuleNotFoundError:
    from models import User, UserProgress, db

users_bp = Blueprint('users', __name__)

@users_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Calculate accuracy
        total_questions_answered = user.total_quizzes * 5  # Assuming 5 questions per quiz average
        accuracy = 0
        if total_questions_answered > 0:
            accuracy = round((user.correct_answers / total_questions_answered) * 100)
        
        profile_data = user.to_dict()
        profile_data['accuracy'] = accuracy
        
        return jsonify({'user': profile_data}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_bp.route('/progress', methods=['GET'])
@jwt_required()
def get_progress():
    try:
        user_id = get_jwt_identity()
        
        # Get all progress records
        progress_records = UserProgress.query.filter_by(user_id=user_id).all()
        
        progress_data = [progress.to_dict() for progress in progress_records]
        
        return jsonify({'progress': progress_data}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


