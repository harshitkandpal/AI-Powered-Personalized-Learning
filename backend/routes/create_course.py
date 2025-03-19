from flask import Blueprint, request, jsonify
from firebase_admin import firestore

db = firestore.client()
courses_ref = db.collection('courses')
teachers_ref = db.collection('teachers')

create_course_bp = Blueprint('create_course', __name__)

@create_course_bp.route('/create-course', methods=['POST'])
def create_course():
    try:
        # Extract the course data from the request
        course_data = request.json
        
        # Validate required fields
        required_fields = ['teacher_email', 'title', 'description', 'category', 'difficulty_level', 'duration', 'price', 'image']
        for field in required_fields:
            if field not in course_data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        teacher_email = course_data.get('teacher_email')

        # Query Firestore to find the teacher by email
        teacher_query = teachers_ref.where('email', '==', teacher_email).limit(1).stream()
        teacher_doc = next(teacher_query, None)  # Get the first result or None
        
        if not teacher_doc:
            return jsonify({'error': 'Teacher not found'}), 404
        
        teacher_id = teacher_doc.id  # Get the Firestore document ID for the teacher

        # Generate a new course ID
        course_id = courses_ref.document().id

        # Create the course
        course = {
            'course_id': course_id,
            'title': course_data['title'],
            'description': course_data['description'],
            'category': course_data['category'],
            'difficulty_level': course_data['difficulty_level'],
            'created_by': teacher_email,
            'created_at': firestore.SERVER_TIMESTAMP,
            'duration': course_data['duration'],  # In hours
            'price': course_data['price'],
            'image': course_data['image'],
            'content': {
                'videos': [],
                'pdfs': [],
                'hyperlinks': []
            }
        }

        # Add course to Firestore
        courses_ref.document(course_id).set(course)

        # Update teacher's course list using the correct document ID
        teachers_ref.document(teacher_id).update({
            'courses': firestore.ArrayUnion([course_id])
        })

        return jsonify({'message': 'Course created successfully', 'course_id': course_id}), 201

    except KeyError as e:
        # Handle missing keys
        return jsonify({'error': f'Missing key: {str(e)}'}), 400
    except Exception as e:
        # General error handler
        return jsonify({'error': str(e)}), 500
