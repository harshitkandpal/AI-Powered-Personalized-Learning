from flask import Blueprint, request, jsonify
from google.cloud import storage
import uuid
import os

upload_material_bp = Blueprint('upload_material', __name__)

# Set up Google Cloud Storage
BUCKET_NAME = "learning-videos"  # Replace with your actual bucket name

# Ensure authentication is set
current_dir = os.path.dirname(os.path.abspath(__file__))
key_path = os.path.join(current_dir, "gcs_key.json")
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = key_path

# Initialize storage client
storage_client = storage.Client()

@upload_material_bp.route('/upload-video', methods=['POST'])
def upload_video():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['file']
        
        # Generate unique filename
        filename = f"videos/{uuid.uuid4()}-{file.filename}"
        
        # Upload file to Cloud Storage
        bucket = storage_client.bucket(BUCKET_NAME)
        blob = bucket.blob(filename)
        blob.content_type = file.content_type
        blob.upload_from_file(file)
        
        # Make file publicly accessible
        blob.make_public()
        video_url = blob.public_url

        return jsonify({'message': 'Video uploaded successfully', 'video_url': video_url}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500
