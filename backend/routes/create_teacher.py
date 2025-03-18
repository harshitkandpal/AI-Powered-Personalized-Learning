from flask import Blueprint, request, jsonify
from firebase_admin import firestore

db = firestore.client()
teachers_ref = db.collection('teachers')

create_teacher_bp = Blueprint('create_teacher', __name__)

@create_teacher_bp.route('/create-teacher', methods=['POST'])
def create_teacher():
    try:
        # Extract teacher data from request
        teacher_data = request.json

        # Validate required fields
        required_fields = ['teacher_id', 'name', 'email']
        for field in required_fields:
            if field not in teacher_data:
                return jsonify({'error': f'Missing required field: {field}'}), 400

        teacher_email = teacher_data.get('email')

        # Check if teacher already exists
        teacher_doc = teachers_ref.document(teacher_email).get()
        if teacher_doc.exists:
            return jsonify({'error': 'Teacher already exists'}), 409

        # Create teacher document
        teacher = {
            'teacher_id': teacher_data['teacher_id'],
            'name': teacher_data['name'],
            'email': teacher_email,
            'profile_picture': teacher_data.get('profile_picture', ''),  # Optional
            'created_at': firestore.SERVER_TIMESTAMP,
            'courses': []  # Empty list initially, will be updated when courses are added
        }

        # Add teacher to Firestore
        teachers_ref.document(teacher_email).set(teacher)

        return jsonify({'message': 'Teacher created successfully', 'teacher_id': teacher_data['teacher_id']}), 201

    except KeyError as e:
        # Handle missing keys
        return jsonify({'error': f'Missing key: {str(e)}'}), 400
    except Exception as e:
        # General error handler
        return jsonify({'error': str(e)}), 500
