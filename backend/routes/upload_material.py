from flask import Blueprint, request, jsonify

upload_material_bp = Blueprint('upload_material', __name__)

@upload_material_bp.route('/upload-course-material', methods=['POST', 'GET'])
def upload_course_material():
    if request.method == 'POST':
        # Handle file upload logic
        return jsonify({'message': 'Course material uploaded successfully'}), 201
    else:
        # Fetch course material for specific module
        return jsonify({'materials': ['Video', 'PDF', 'Hyperlink']}), 200
