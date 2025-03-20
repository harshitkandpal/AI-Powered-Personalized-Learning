

# import requests
# import json
# from flask import Blueprint, request, jsonify
# from firebase_admin import firestore

# chatbot_bp = Blueprint('chatbot', __name__)

# # Gemini API configuration
# API_KEY = "AIzaSyB9ZhPtJL7gX77j9oi0_ZkejdszjBAMC0U"  # Move this to environment variables in production
# GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={API_KEY}"

# @chatbot_bp.route('/chatbot', methods=['POST', 'GET'])
# def chatbot():
#     if request.method == 'POST':
#         try:
#             # Get the Firestore database instance
#             db = firestore.client()
            
#             # Get user input and user ID from request
#             data = request.get_json()
#             user_input = data.get('message', '')
#             user_id = data.get('user_id')  # Get student ID if available
            
#             # Default values
#             learning_speed_score = 50
#             progress = 50
#             course_context = "general learning"
            
#             # If user_id is provided, fetch student data from Firestore
#             if user_id:
#                 try:
#                     student_ref = db.collection('students').document(user_id)
#                     student_doc = student_ref.get()
                    
#                     if student_doc.exists:
#                         student_data = student_doc.to_dict()
#                         learning_speed_score = student_data.get('learning_speed_score', 50)
                        
#                         # Get current course if available
#                         current_course_id = student_data.get('current_course_id')
#                         if current_course_id:
#                             course_ref = db.collection('courses').document(current_course_id)
#                             course_doc = course_ref.get()
#                             if course_doc.exists:
#                                 course_data = course_doc.to_dict()
#                                 course_context = course_data.get('title', 'general learning')
                                
#                         # Get progress data if available
#                         progress_ref = db.collection('progress').where('student_id', '==', user_id).limit(1)
#                         progress_docs = progress_ref.stream()
#                         for doc in progress_docs:
#                             progress_data = doc.to_dict()
#                             progress = progress_data.get('percentage', 50)
                
#                 except Exception as e:
#                     print(f"Error fetching student data: {e}")
#                     # Continue with default values if there's an error
            
#             # Create personalized prompt considering student data
#             chatbot_prompt = f"""
#             As a personalized learning assistant for an educational platform:
#             - The student's learning speed score is {learning_speed_score}/100
#             - Their current progress is {progress}%
#             - They're currently studying: {course_context}
            
#             Respond to their question in a helpful, encouraging manner:
#             "{user_input}"
            
#             Keep your response concise and tailored to their learning pace.
#             """
            
#             # Call the Gemini API for response
#             gemini_response = call_gemini_api(chatbot_prompt)
            
#             # Store conversation in Firebase if user_id is provided
#             if user_id:
#                 try:
#                     chat_ref = db.collection('chat_history').document()
#                     chat_ref.set({
#                         'user_id': user_id,
#                         'user_message': user_input,
#                         'bot_response': gemini_response,
#                         'timestamp': firestore.SERVER_TIMESTAMP
#                     })
#                 except Exception as e:
#                     print(f"Error storing chat history: {e}")
            
#             return jsonify({'response': gemini_response}), 200
            
#         except Exception as e:
#             return jsonify({'response': f"Error processing request: {str(e)}"}), 500
#     else:
#         return jsonify({'message': 'Hello! How can I assist you with your learning today?'}), 200

# def call_gemini_api(prompt):
#     headers = {
#         'Content-Type': 'application/json'
#     }
#     payload = {
#         "contents": [
#             {
#                 "parts": [
#                     {"text": prompt}
#                 ]
#             }
#         ]
#     }
    
#     try:
#         # Make POST request to Gemini API
#         response = requests.post(GEMINI_API_URL, headers=headers, json=payload)
        
#         # Check response status and parse the generated content
#         if response.status_code == 200:
#             try:
#                 # Parse the JSON response
#                 data = response.json()
                
#                 # Extract the relevant text from the candidates array
#                 generated_text = data['candidates'][0]['content']['parts'][0]['text']
                
#                 return generated_text
                
#             except (KeyError, IndexError, json.JSONDecodeError) as e:
#                 return f"Error in parsing Gemini API response: {str(e)}"
#         else:
#             return f"Error from Gemini API: Status code {response.status_code}"
#     except requests.exceptions.RequestException as e:
#         return f"Network error connecting to Gemini API: {str(e)}"


import requests
import json
from flask import Blueprint, request, jsonify
from firebase_admin import firestore
import random

chatbot_bp = Blueprint('chatbot', __name__)

# Gemini API configuration
API_KEY = "AIzaSyB9ZhPtJL7gX77j9oi0_ZkejdszjBAMC0U"  # Move this to environment variables in production
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={API_KEY}"

# Add supportive responses for different emotional states
SUPPORTIVE_RESPONSES = {
    "frustrated": [
        "I can hear that you're feeling frustrated. That's completely normal when learning something new.",
        "Learning can be challenging sometimes. Let's tackle this together.",
        "It's okay to feel stuck - everyone does sometimes! What part is the most confusing?",
        "Learning has ups and downs. Let's take it step by step."
    ],
    "confused": [
        "It sounds like this concept is a bit tricky. Let me try explaining it differently.",
        "Sometimes confusion is just the first step to understanding. What specifically is unclear?",
        "Let's break this down into smaller pieces. Which part makes the least sense right now?",
        "It's perfectly okay to be confused! That often happens right before a breakthrough."
    ],
    "discouraged": [
        "Remember that progress isn't always linear. You're doing better than you think!",
        "It's normal to feel discouraged sometimes, but I believe in you. Let's keep going.",
        "Every expert was once a beginner who didn't give up. You've got this!",
        "Learning takes time and patience. Be kind to yourself along the way."
    ],
    "positive": [
        "That's fantastic! I love seeing your enthusiasm!",
        "You're making great progress! Keep that positive energy going.",
        "It's wonderful to see things clicking for you!",
        "Your positive attitude will take you far. Keep it up!"
    ],
    "neutral": [
        "How are you feeling about your learning journey today?",
        "Remember, I'm here to support you every step of the way.",
        "Learning is as much about the journey as the destination. How's your journey going?",
        "Is there anything specific you'd like to focus on today?"
    ]
}

def analyze_message_sentiment(message):
    """Basic sentiment analysis based on keywords in the message"""
    message_lower = message.lower()
    
    # Check for emotional indicators
    frustrated_keywords = ['frustrated', 'annoying', 'stuck', 'difficult', 'hard', 'struggling', 'give up', 'can\'t do this']
    confused_keywords = ['confused', 'don\'t understand', 'not clear', 'what does this mean', 'lost', 'unclear']
    discouraged_keywords = ['pointless', 'too hard', 'never get it', 'too difficult', 'not smart enough', 'impossible']
    positive_keywords = ['got it', 'understand', 'makes sense', 'thanks', 'helpful', 'great', 'awesome', 'excited']
    
    for keyword in frustrated_keywords:
        if keyword in message_lower:
            return "frustrated"
    
    for keyword in confused_keywords:
        if keyword in message_lower:
            return "confused"
            
    for keyword in discouraged_keywords:
        if keyword in message_lower:
            return "discouraged"
            
    for keyword in positive_keywords:
        if keyword in message_lower:
            return "positive"
            
    return "neutral"

def get_supportive_response(sentiment):
    """Get a random supportive response based on detected sentiment"""
    responses = SUPPORTIVE_RESPONSES.get(sentiment, SUPPORTIVE_RESPONSES["neutral"])
    return random.choice(responses)

@chatbot_bp.route('/chatbot', methods=['POST', 'GET'])
def chatbot():
    if request.method == 'POST':
        try:
            # Get the Firestore database instance
            db = firestore.client()
            
            # Get user input and user ID from request
            data = request.get_json()
            user_input = data.get('message', '')
            user_id = data.get('user_id')  # Get student ID if available
            
            # Default values
            learning_speed_score = 50
            progress = 50
            course_context = "general learning"
            user_name = "there"
            message_count = 0
            
            # Analyze sentiment of the message
            sentiment = analyze_message_sentiment(user_input)
            
            # If user_id is provided, fetch student data from Firestore
            if user_id:
                try:
                    # Get student data
                    student_ref = db.collection('students').document(user_id)
                    student_doc = student_ref.get()
                    
                    if student_doc.exists:
                        student_data = student_doc.to_dict()
                        learning_speed_score = student_data.get('learning_speed_score', 50)
                        user_name = student_data.get('name', 'there')
                        
                        # Get current course if available
                        current_course_id = student_data.get('current_course_id')
                        if current_course_id:
                            course_ref = db.collection('courses').document(current_course_id)
                            course_doc = course_ref.get()
                            if course_doc.exists:
                                course_data = course_doc.to_dict()
                                course_context = course_data.get('title', 'general learning')
                                
                        # Get progress data if available
                        progress_ref = db.collection('progress').where('student_id', '==', user_id).limit(1)
                        progress_docs = progress_ref.stream()
                        for doc in progress_docs:
                            progress_data = doc.to_dict()
                            progress = progress_data.get('percentage', 50)
                    
                    # Check for user preferences
                    prefs_ref = db.collection('user_preferences').document(user_id)
                    prefs_doc = prefs_ref.get()
                    
                    user_preferences = {}
                    if prefs_doc.exists:
                        user_preferences = prefs_doc.to_dict()
                    
                    # Get message count
                    chat_count_ref = db.collection('chat_history').where('user_id', '==', user_id).count()
                    message_count = len(list(chat_count_ref.stream()))
                
                except Exception as e:
                    print(f"Error fetching student data: {e}")
                    # Continue with default values if there's an error
            
            # Get supportive response based on sentiment
            supportive_response = get_supportive_response(sentiment)
            
            # Create personalized prompt considering student data
            chatbot_prompt = f"""
            As a friendly, supportive learning companion (not just an assistant) named Lexi:

            STUDENT CONTEXT:
            - Name: {user_name}
            - Learning speed score: {learning_speed_score}/100
            - Current progress: {progress}%
            - Currently studying: {course_context}
            - Message sentiment: {sentiment}
            - Chat history length: {message_count} messages
            
            USER PREFERENCES:
            - Communication style: {user_preferences.get('communication_style', 'friendly')}
            - Encouragement level: {user_preferences.get('encouragement_level', 'moderate')}
            - Detail level: {user_preferences.get('detail_level', 'balanced')}
            
            SUPPORTIVE CONTEXT:
            Here's a supportive response that might help: "{supportive_response}"
            
            INSTRUCTIONS:
            Respond to their message: "{user_input}"
            
            Please follow these specific guidelines:
            - Use a warm, conversational tone as if you're a trusted friend (NOT a formal assistant)
            - Call them by name occasionally if you know it
            - Be empathetic and acknowledge their feelings when appropriate
            - Use encouraging language that reduces anxiety around learning
            - Provide specific, helpful answers rather than generic responses
            - Keep responses concise and engaging (2-4 sentences is often ideal)
            - Use casual language with contractions (like "you're" instead of "you are")
            - Occasionally use light humor when appropriate
            - If they're struggling, normalize the difficulty and offer specific encouragement
            - End with a friendly question to continue the conversation only when appropriate
            - Include occasional emojis but don't overuse them
            
            As "Lexi," your personality is:
            - Warm, empathetic, and supportive
            - Patient and never condescending
            - Conversational rather than formal
            - Encouraging without being artificially chipper
            - Genuinely interested in the student's learning journey
            
            Your response MUST feel like talking to a supportive friend who happens to be knowledgeable, not an AI assistant.
            """
            
            # Call the Gemini API for response
            gemini_response = call_gemini_api(chatbot_prompt)
            
            # Store conversation in Firebase if user_id is provided
            if user_id:
                try:
                    chat_ref = db.collection('chat_history').document()
                    chat_ref.set({
                        'user_id': user_id,
                        'user_message': user_input,
                        'bot_response': gemini_response,
                        'sentiment': sentiment,
                        'timestamp': firestore.SERVER_TIMESTAMP
                    })
                    
                    # Update sentiment history for the user
                    sentiment_ref = db.collection('sentiment_history').document()
                    sentiment_ref.set({
                        'user_id': user_id,
                        'sentiment': sentiment,
                        'timestamp': firestore.SERVER_TIMESTAMP
                    })
                except Exception as e:
                    print(f"Error storing chat history: {e}")
            
            return jsonify({'response': gemini_response}), 200
            
        except Exception as e:
            return jsonify({'response': f"Hi there! I'm having a little trouble connecting right now. Could you try again in a moment? Thanks for your patience!"}), 500
    else:
        return jsonify({'message': "Hey there! I'm Lexi, your learning buddy. How can I help make learning more fun today?"}), 200

def call_gemini_api(prompt):
    headers = {
        'Content-Type': 'application/json'
    }
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ]
    }
    
    try:
        # Make POST request to Gemini API
        response = requests.post(GEMINI_API_URL, headers=headers, json=payload)
        
        # Check response status and parse the generated content
        if response.status_code == 200:
            try:
                # Parse the JSON response
                data = response.json()
                
                # Extract the relevant text from the candidates array
                generated_text = data['candidates'][0]['content']['parts'][0]['text']
                
                return generated_text
                
            except (KeyError, IndexError, json.JSONDecodeError) as e:
                return f"Sorry about that! I had a little hiccup understanding something. Can you try asking me again, maybe in a different way?"
        else:
            return f"I'm having a moment here! My brain's a bit foggy right now. Let's try again in a second?"
    except requests.exceptions.RequestException as e:
        return f"Oops! Looks like I'm having trouble connecting. Give me a moment and try again?"

# New endpoint to update user preferences
@chatbot_bp.route('/update_chatbot_preferences', methods=['POST'])
def update_preferences():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        preferences = data.get('preferences', {})
        
        if not user_id:
            return jsonify({'status': 'error', 'message': 'User ID is required'}), 400
            
        db = firestore.client()
        prefs_ref = db.collection('user_preferences').document(user_id)
        prefs_ref.set(preferences, merge=True)
        
        return jsonify({'status': 'success', 'message': 'Preferences updated successfully'}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500