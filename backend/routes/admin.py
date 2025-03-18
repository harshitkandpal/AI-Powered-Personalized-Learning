from flask import Blueprint, request, jsonify
from firebase_admin import firestore

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin/dashboard', methods=['GET'])
def admin_dashboard():
    """Get admin dashboard statistics"""
    try:
        db = firestore.client() # Initialize client inside the function
        
        # Get course counts
        courses_ref = db.collection('courses')
        courses_count = len(list(courses_ref.stream()))
        
        # Get student counts
        students_ref = db.collection('users').where('role', '==', 'student')
        students_count = len(list(students_ref.stream()))
        
        # Get recent activities
        activities_ref = db.collection('activities').order_by('timestamp', direction='DESCENDING').limit(10)
        recent_activities = [{"id": doc.id, **doc.to_dict()} for doc in activities_ref.stream()]
        
        stats = {
            "courses_count": courses_count,
            "students_count": students_count,
            "recent_activities": recent_activities
        }
        
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/courses', methods=['GET'])
def admin_courses():
    """Get all courses for admin management"""
    try:
        db = firestore.client() # Initialize client inside the function
        courses_ref = db.collection('courses')
        courses = [{"id": doc.id, **doc.to_dict()} for doc in courses_ref.stream()]
        return jsonify({'courses': courses}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500