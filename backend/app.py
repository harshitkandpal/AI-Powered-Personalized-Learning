from flask import Flask, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials
import os

# Initialize Firebase first
cred_path = os.path.join(os.path.dirname(__file__), "firebase.json")
if not firebase_admin._apps:
    cred = credentials.Certificate(cred_path)
    firebase_app = firebase_admin.initialize_app(cred)
print("Initialized Firebase Apps:", firebase_admin._apps)
# Import routes AFTER Firebase initialization
from routes.course_selection import course_selection_bp
from routes.recommended_courses import recommended_courses_bp
from routes.upload_material import upload_material_bp
from routes.track_learning_speed import track_learning_speed_bp
from routes.chatbot import chatbot_bp
from routes.student_progress import student_progress_bp
from routes.admin import admin_bp

# Create Flask app
app = Flask(__name__)

# Enable CORS
CORS(app)

# Register blueprints
app.register_blueprint(course_selection_bp)
app.register_blueprint(recommended_courses_bp)
app.register_blueprint(upload_material_bp)
app.register_blueprint(track_learning_speed_bp)
app.register_blueprint(chatbot_bp)
app.register_blueprint(student_progress_bp)
app.register_blueprint(admin_bp)

@app.route('/')
def home():
    return jsonify({"message": "Welcome to AI-Powered Personalized Learning API"})

@app.route('/health')
def health_check():
    """API health check endpoint"""
    return jsonify({
        "status": "ok",
        "firebase_connected": firebase_admin._apps is not None,
        "version": "1.0.0"
    })

if __name__ == '__main__':
    app.run(debug=True)