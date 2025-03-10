from flask import Blueprint, request, jsonify

track_learning_speed_bp = Blueprint('track_learning_speed', __name__)

@track_learning_speed_bp.route('/track-learning-speed', methods=['POST', 'GET'])
def track_learning_speed():
    if request.method == 'POST':
        data = request.json
        lss = calculate_learning_speed(data['accuracy'], data['improvement'], data['time_taken'], data['difficulty'])
        return jsonify({'LSS': lss}), 200
    else:
        return jsonify({'LSS': 8.5}), 200

def calculate_learning_speed(accuracy, improvement, time_taken, difficulty, alpha=0.5, beta=0.3, gamma=0.2):
    LSS = ((alpha * accuracy) + (beta * improvement) - (gamma * time_taken)) / difficulty
    return round(LSS, 2)
