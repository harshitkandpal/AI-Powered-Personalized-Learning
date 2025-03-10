from flask import Flask
from routes.course_selection import course_selection_bp
from routes.recommended_courses import recommended_courses_bp
from routes.upload_material import upload_material_bp
from routes.track_learning_speed import track_learning_speed_bp
from routes.chatbot import chatbot_bp
from routes.student_progress import student_progress_bp
from routes.admin import admin_bp

app = Flask(__name__)

# Register blueprints
app.register_blueprint(course_selection_bp)
app.register_blueprint(recommended_courses_bp)
app.register_blueprint(upload_material_bp)
app.register_blueprint(track_learning_speed_bp)
app.register_blueprint(chatbot_bp)
app.register_blueprint(student_progress_bp)
app.register_blueprint(admin_bp)

if __name__ == '__main__':
    app.run(debug=True)


@app.route('/')
def home():
    return jsonify(message="Hello, Flask!")

if __name__ == '__main__':
    app.run(debug=True)
