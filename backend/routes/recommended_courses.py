from flask import Blueprint, request, jsonify
from firebase_admin import firestore

recommended_courses_bp = Blueprint('recommended_courses', __name__)

@recommended_courses_bp.route('/recommended_courses', methods=['GET'])
def get_recommended_courses():
    """Get personalized course recommendations for a user"""
    try:
        db = firestore.client() # Initialize client inside the function
        user_id = request.args.get('user_id')
        
        if not user_id:
            return jsonify({'error': 'User ID is required'}), 400
        
        # Get user profile and learning history
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            return jsonify({'error': 'User not found'}), 404
        
        user_data = user_doc.to_dict()
        
        # Get user's completed courses
        completed_courses_ref = db.collection('user_progress').where('user_id', '==', user_id).where('status', '==', 'completed')
        completed_courses = [doc.to_dict().get('course_id') for doc in completed_courses_ref.stream()]
        
        # Get user's interests
        interests = user_data.get('interests', [])
        
        # Find courses matching interests
        courses_query = db.collection('courses')
        
        # Filter out completed courses
        recommended_courses = []
        for doc in courses_query.stream():
            course = {"id": doc.id, **doc.to_dict()}
            course_tags = course.get('tags', [])
            
            # Check if course matches user interests and hasn't been completed
            if (any(tag in interests for tag in course_tags) and 
                course['id'] not in completed_courses):
                recommended_courses.append(course)
        
        # Sort by relevance (number of matching tags)
        for course in recommended_courses:
            course['relevance_score'] = len(set(course.get('tags', [])) & set(interests))
        
        recommended_courses.sort(key=lambda x: x['relevance_score'], reverse=True)
        
        return jsonify({'recommended_courses': recommended_courses[:10]}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500