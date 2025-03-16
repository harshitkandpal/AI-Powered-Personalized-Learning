from flask import Blueprint, request, jsonify
import firebase_admin
from firebase_admin import firestore

course_selection_bp = Blueprint('course_selection', __name__)
db = firestore.client()

@course_selection_bp.route('/get_subjects', methods=['GET'])
def get_subjects():
    """Get all available subjects"""
    try:
        subjects_ref = db.collection('subjects')
        subjects = [{"id": doc.id, **doc.to_dict()} for doc in subjects_ref.stream()]
        return jsonify({'subjects': subjects}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@course_selection_bp.route('/get_courses', methods=['POST'])
def get_courses():
    """Get courses based on subject and difficulty level"""
    try:
        data = request.json
        subject_id = data.get('subject_id')
        difficulty = data.get('difficulty')
        
        if not subject_id or not difficulty:
            return jsonify({'error': 'Subject ID and difficulty level are required'}), 400
            
        # Query courses with filters
        courses_ref = db.collection('courses')
        query = courses_ref.where('subject_id', '==', subject_id).where('difficulty', '==', difficulty)
        courses = [{"id": doc.id, **doc.to_dict()} for doc in query.stream()]
        
        return jsonify({'courses': courses}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500