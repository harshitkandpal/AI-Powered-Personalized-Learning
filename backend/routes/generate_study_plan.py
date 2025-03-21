from flask import Blueprint, request, jsonify
from firebase_admin import firestore
import google.generativeai as genai
import fitz  # PyMuPDF for PDF text extraction
import re
import requests
import os
import tempfile

generate_study_plan_bp = Blueprint('generate_study_plan', __name__)

# Set up Gemini API key
GENAI_API_KEY = os.environ.get("GENAI_API_KEY", "AIzaSyCSEb4ACT2QBJE3DAUQq2xIiB_xvZmB664")
genai.configure(api_key=GENAI_API_KEY)

# Google Search API Key & CSE ID
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY", "AIzaSyDHqU4TyZK62j9R15bV6FIkGiSE9n5_SI4")
SEARCH_ENGINE_ID = os.environ.get("SEARCH_ENGINE_ID", "e1e416051a2d644c2")

def extract_syllabus_topics(pdf_path):
    """Extracts course names and module topics from the syllabus PDF dynamically."""
    doc = fitz.open(pdf_path)
    full_text = "\n".join([page.get_text("text") for page in doc])

    # Extract course names (titles like "Cryptography & System Security")
    course_pattern = re.findall(r"(?i)(?:course\s*code:\s*)?(CSC\d{3,4}\s*.*?)(?:\n|$)", full_text)

    # Extract module titles (like "Introduction to Cryptography", "Machine Learning Basics")
    module_pattern = re.findall(r"(?i)\d+\.\s+(.*?)\n", full_text)

    # Combine course and module topics
    syllabus_topics = list(set(course_pattern + module_pattern))
    return syllabus_topics[:10]  # Limit to first 10 topics to avoid excessive search requests

def generate_study_plan(name, lss, strengths, syllabus_text):
    """Generate a structured and personalized study plan using Gemini API."""
    prompt = (
        f"Student {name} has a Learning Speed Score (LSS) of {lss}.\n"
        f"Based on their strengths in {', '.join(strengths)}, generate a personalized study plan "
        "following this syllabus:\n\n"
        f"{syllabus_text}\n\n"
        "The study plan should:\n"
        "- Divide topics over weeks systematically.\n"
        "- Specify daily study hours and recommended resources.\n"
        "- Include revision sessions and mock tests.\n"
        "- Highlight difficult topics that need extra focus.\n"
        "- Also make a tabular structure of weekly and daily study plan."
    )

    model = genai.GenerativeModel('gemini-2.0-flash')
    response = model.generate_content(prompt)
    return response.text

def search_learning_resources(query):
    """Search Google for relevant YouTube, IEEE, and NPTEL resources dynamically."""
    search_results = []
    search_url = f"https://www.googleapis.com/customsearch/v1?q={query}+site:youtube.com+OR+site:ieeexplore.ieee.org+OR+site:nptel.ac.in&key={GOOGLE_API_KEY}&cx={SEARCH_ENGINE_ID}"
    
    try:
        response = requests.get(search_url)
        results = response.json()
        
        for item in results.get("items", []):
            search_results.append({
                "title": item['title'],
                "link": item['link']
            })
    
    except Exception as e:
        return [{"title": "Error fetching external resources", "link": "#"}]
    
    return search_results

def get_user_by_email(email):
    """Fetch user data from Firestore using email."""
    db = firestore.client()
    users_ref = db.collection('students').where('email', '==', email).limit(1)
    users = list(users_ref.stream())
    
    if not users:
        return None
    
    user_data = users[0].to_dict()
    user_data['id'] = users[0].id
    return user_data

@generate_study_plan_bp.route('/generate_study_plan', methods=['POST'])
def create_study_plan():
    try:
        # Check if this is a multipart form or JSON request
        if request.content_type and 'multipart/form-data' in request.content_type:
            # Get data from form
            email = request.form.get('email')
            syllabus_text = request.form.get('syllabus_text', '')
            uploaded_file = request.files.get('syllabus_pdf')
        else:
            # Get data from JSON
            data = request.json
            email = data.get('email')
            syllabus_text = data.get('syllabus_text', '')
            uploaded_file = None
        
        # Get the Firestore database instance
        db = firestore.client()
        
        # Default values
        name = "Student"
        lss = 50.0
        strengths = ["General Studies"]
        user_id = None
        
        # If email is provided, fetch student data from Firestore
        if email:
            try:
                user_data = get_user_by_email(email)
                if user_data:
                    name = user_data.get('name', 'Student')
                    lss = float(user_data.get('learning_speed_score', 50.0))
                    strengths = user_data.get('strengths', ['General Studies'])
                    user_id = user_data.get('id')
                    
                    if isinstance(strengths, str):
                        strengths = [s.strip() for s in strengths.split(',')]
            except Exception as e:
                return jsonify({'error': f"Error fetching student data: {str(e)}"}), 500
        else:
            # If no email, get data from request directly
            if request.content_type and 'multipart/form-data' in request.content_type:
                name = request.form.get('name', 'Student')
                lss = float(request.form.get('lss', 50.0))
                strengths_input = request.form.get('strengths', 'General Studies')
            else:
                name = data.get('name', 'Student')
                lss = float(data.get('lss', 50.0))
                strengths_input = data.get('strengths', 'General Studies')
                
            if isinstance(strengths_input, str):
                strengths = [s.strip() for s in strengths_input.split(',')]
            else:
                strengths = strengths_input
        
        # Handle syllabus content
        if uploaded_file:
            # Save uploaded file to temporary location
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
            uploaded_file.save(temp_file.name)
            temp_file.close()
            
            # Extract topics from PDF
            syllabus_topics = extract_syllabus_topics(temp_file.name)
            syllabus_text = "\n".join(syllabus_topics)
            
            # Clean up temp file
            os.unlink(temp_file.name)
        elif not syllabus_text:
            return jsonify({'error': 'No syllabus content provided. Please upload a PDF or provide syllabus text.'}), 400
        
        # Generate the study plan
        study_plan = generate_study_plan(name, lss, strengths, syllabus_text)
        
        # Extract topics for resource search
        topics = syllabus_text.split('\n')
        
        # Fetch external references for each topic
        external_resources = {}
        for topic in topics:
            if topic.strip():  # Skip empty topics
                external_resources[topic] = search_learning_resources(topic)
        
        # Store the study plan in Firestore if user_id is provided
        if user_id:
            try:
                plan_ref = db.collection('study_plans').document()
                plan_data = {
                    'user_id': user_id,
                    'email': email,
                    'plan_content': study_plan,
                    'resources': external_resources,
                    'created_at': firestore.SERVER_TIMESTAMP
                }
                plan_ref.set(plan_data)
                plan_id = plan_ref.id
            except Exception as e:
                return jsonify({'error': f"Error storing study plan: {str(e)}"}), 500
        else:
            plan_id = None
        
        # Return the response
        return jsonify({
            'status': 'success',
            'study_plan': study_plan,
            'resources': external_resources,
            'plan_id': plan_id
        }), 200
        
    except Exception as e:
        return jsonify({'error': f"Failed to generate study plan: {str(e)}"}), 500

@generate_study_plan_bp.route('/study_plans/email/<email>', methods=['GET'])
def get_user_study_plans_by_email(email):
    """Fetch all study plans for a specific user by email"""
    try:
        db = firestore.client()
        plans_ref = db.collection('study_plans').where('email', '==', email).order_by('created_at', direction='DESCENDING')
        plans = []
        
        for doc in plans_ref.stream():
            plan_data = doc.to_dict()
            plan_data['id'] = doc.id
            plans.append(plan_data)
            
        return jsonify({'status': 'success', 'plans': plans}), 200
    except Exception as e:
        return jsonify({'error': f"Failed to fetch study plans: {str(e)}"}), 500

@generate_study_plan_bp.route('/study_plans/<plan_id>', methods=['GET'])
def get_study_plan(plan_id):
    """Fetch a specific study plan by ID"""
    try:
        db = firestore.client()
        plan_ref = db.collection('study_plans').document(plan_id)
        plan_doc = plan_ref.get()
        
        if not plan_doc.exists:
            return jsonify({'error': 'Study plan not found'}), 404
            
        plan_data = plan_doc.to_dict()
        plan_data['id'] = plan_doc.id
        
        return jsonify({'status': 'success', 'plan': plan_data}), 200
    except Exception as e:
        return jsonify({'error': f"Failed to fetch study plan: {str(e)}"}), 500

