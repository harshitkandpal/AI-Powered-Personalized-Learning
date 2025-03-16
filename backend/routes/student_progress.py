from flask import Blueprint, request, jsonify
from firebase_admin import firestore
import datetime

student_progress_bp = Blueprint('student_progress', __name__)

@student_progress_bp.route('/progress', methods=['GET'])
def get_student_progress():
    """Get progress details for a student across all courses"""
    try:
        db = firestore.client() # Initialize client inside the function
        user_id = request.args.get('user_id')
        
        if not user_id:
            return jsonify({'error': 'User ID is required'}), 400
        
        # Get all progress records for this user
        progress_ref = db.collection('user_progress').where('user_id', '==', user_id)
        progress_docs = progress_ref.stream()
        
        # Get course details for each progress record
        progress_data = []
        for doc in progress_docs:
            progress = doc.to_dict()
            course_id = progress.get('course_id')
            
            course_ref = db.collection('courses').document(course_id)
            course_doc = course_ref.get()
            
            if course_doc.exists:
                course_data = course_doc.to_dict()
                progress_data.append({
                    'progress_id': doc.id,
                    'course_id': course_id,
                    'course_title': course_data.get('title'),
                    'completion_percentage': progress.get('completion_percentage', 0),
                    'last_accessed': progress.get('last_accessed'),
                    'status': progress.get('status')
                })
        
        return jsonify({'progress': progress_data}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@student_progress_bp.route('/progress/update', methods=['POST'])
def update_progress():
    """Update progress for a student in a specific course"""
    try:
        db = firestore.client() # Initialize client inside the function
        data = request.json
        user_id = data.get('user_id')
        course_id = data.get('course_id')
        completion_percentage = data.get('completion_percentage')
        
        if not user_id or not course_id or completion_percentage is None:
            return jsonify({'error': 'User ID, course ID, and completion percentage are required'}), 400
        
        # Check if progress record exists
        progress_ref = db.collection('user_progress')
        query = progress_ref.where('user_id', '==', user_id).where('course_id', '==', course_id)
        progress_docs = list(query.stream())
        
        now = datetime.datetime.now()
        
        if progress_docs:
            # Update existing record
            progress_doc = progress_docs[0]
            progress_ref.document(progress_doc.id).update({
                'completion_percentage': completion_percentage,
                'last_accessed': now,
                'status': 'completed' if completion_percentage >= 100 else 'in_progress'
            })
            progress_id = progress_doc.id
        else:
            # Create new record
            new_progress_ref = progress_ref.document()
            new_progress_ref.set({
                'user_id': user_id,
                'course_id': course_id,
                'completion_percentage': completion_percentage,
                'start_date': now,
                'last_accessed': now,
                'status': 'completed' if completion_percentage >= 100 else 'in_progress'
            })
            progress_id = new_progress_ref.id
        
        return jsonify({
            'progress_id': progress_id,
            'completion_percentage': completion_percentage,
            'status': 'completed' if completion_percentage >= 100 else 'in_progress'
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500