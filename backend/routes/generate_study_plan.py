from flask import Blueprint, request, jsonify
import google.generativeai as genai
from langchain.prompts import PromptTemplate
from firebase_admin import firestore
# Set up Gemini API key
GENAI_API_KEY = "AIzaSyCSEb4ACT2QBJE3DAUQq2xIiB_xvZmB664"
genai.configure(api_key=GENAI_API_KEY)

# Create a Blueprint
generate_study_plan_bp = Blueprint('generate_study_plan', __name__)

def generate_study_plan(user_data):
    """
    Generate a personalized study plan based on LSS and learning preferences.
    """
    prompt_template = PromptTemplate(
        input_variables=["name", "lss", "strengths"],
        template=(
            "Student {name} has a Learning Speed Score (LSS) of {lss}. "
            "Based on their strengths in {strengths}, generate a personalized study plan "
            "with recommended subjects, topics, and daily study hours."
        )
    )

    prompt = prompt_template.format(
        name=user_data["name"],
        lss=user_data["lss"],
        strengths=", ".join(user_data["strengths"])
    )

    # Use Gemini AI model
    model = genai.GenerativeModel('gemini-2.0-flash')  
    response = model.generate_content(prompt)

    return response.text

@generate_study_plan_bp.route('/generate-study-plan', methods=['POST'])

def generate_plan():
    """
    API endpoint to generate a study plan.
    Expects JSON input: {"name": "Tanmay", "lss": 7.5, "strengths": ["Math", "Science"]}
    """
    try:
        user_data = request.json
        required_fields = ["name", "lss", "strengths"]

        # Validate required fields
        for field in required_fields:
            if field not in user_data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Generate study plan
        study_plan = generate_study_plan(user_data)
        return jsonify({"study_plan": study_plan}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
