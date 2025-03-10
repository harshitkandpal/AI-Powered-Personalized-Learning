from flask import Blueprint, jsonify

recommended_courses_bp = Blueprint('recommended_courses', __name__)

@recommended_courses_bp.route('/recommended-courses', methods=['GET'])
def recommended_courses():
    # Return recommended courses based on user's learning path
    return jsonify({'courses': ['Course A', 'Course B', 'Course C']}), 200
