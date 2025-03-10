from flask import Blueprint, request, jsonify

course_selection_bp = Blueprint('course_selection', __name__)

@course_selection_bp.route('/course-selection', methods=['GET', 'POST'])
def course_selection():
    if request.method == 'POST':
        # Handle user preferences and generate learning path
        data = request.json
        return jsonify({'message': 'Learning path generated based on preferences'}), 201
    else:
        # Return available courses/domains
        return jsonify({'domains': ['AI', 'Data Science', 'Web Development']}), 200
