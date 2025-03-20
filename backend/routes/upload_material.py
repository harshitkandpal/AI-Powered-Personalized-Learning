from flask import Blueprint, request, jsonify
from firebase_admin import firestore

db = firestore.client()
courses_ref = db.collection('courses')

upload_material_bp = Blueprint('upload_material', __name__)

@upload_material_bp.route('/upload-course-material', methods=['POST'])
def upload_course_material():
    try:
        # Extract data from request
        material_data = request.json
        course_id = material_data.get('course_id')
        material_type = material_data.get('type')
        material = material_data.get('material')

        # Check if course exists
        course_doc = courses_ref.document(course_id).get()
        if not course_doc.exists:
            return jsonify({'error': 'Course not found'}), 404

        # Upload material based on type
        if material_type == 'video':
            courses_ref.document(course_id).update({
                'content.videos': firestore.ArrayUnion([material])
            })
        elif material_type == 'pdf':
            courses_ref.document(course_id).update({
                'content.pdfs': firestore.ArrayUnion([material])
            })
        elif material_type == 'hyperlink':
            courses_ref.document(course_id).update({
                'content.hyperlinks': firestore.ArrayUnion([material])
            })
        else:
            return jsonify({'error': 'Invalid material type'}), 400

        return jsonify({'message': f'{material_type.capitalize()} added to course'}), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@upload_material_bp.route('/get-course-materials/<course_id>', methods=['GET'])
def get_course_materials(course_id):
    try:
        # Fetch course materials for the given course ID
        course_doc = courses_ref.document(course_id).get()
        if not course_doc.exists:
            return jsonify({'error': 'Course not found'}), 404

        # Return the materials
        return jsonify(course_doc.to_dict().get('content', {})), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500