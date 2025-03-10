from flask import Blueprint, request, jsonify

student_progress_bp = Blueprint('student_progress', __name__)

@student_progress_bp.route('/student-progress', methods=['POST', 'GET'])
def student_progress():
    if request.method == 'POST':
        # Update student progress
        return jsonify({'message': 'Student progress updated successfully'}), 200
    else:
        # Fetch student progress data
        return jsonify({'progress': 'Intermediate'}), 200
