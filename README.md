
# AI-Powered Personalized Study Planner Backend

This is the backend for the AI-Powered Personalized Study Planner, developed using Flask. The backend handles route logic, processes student data, tracks learning speed, manages course materials, and supports admin functionalities.

## Table of Contents

- [Installation](#installation)
- [Setup](#setup)
- [Run the Backend](#run-the-backend)
- [Testing the API](#testing-the-api)
- [Project Structure](#project-structure)

---

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/repository-name.git
   ```

2. **Navigate to the Backend Folder:**

   ```bash
   cd repository-name/backend
   ```

---

## Setup

1. **Create and Activate a Virtual Environment:**

   - For Windows:
     ```bash
     python -m venv venv
     venv\Scripts\activate
     ```

   - For macOS/Linux:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

2. **Install Dependencies:**

   After activating the virtual environment, install the required packages using:

   ```bash
   pip install -r requirements.txt
   ```

   This will install all necessary dependencies listed in the `requirements.txt` file, including Flask and other packages required by the backend.

---

## Run the Backend

1. **Run the Flask Application:**

   After the virtual environment is activated and the dependencies are installed, you can start the Flask server with:

   ```bash
   flask run
   ```

2. **Access the Backend:**

   By default, the Flask app will run at `http://127.0.0.1:5000/`. You can test your routes via Postman, cURL, or your React frontend.

---

## Testing the API

You can test the API endpoints using **Postman** or **cURL**.

### Example of Running API Tests in Postman:
- Send requests to: `http://127.0.0.1:5000/{route_name}`
- Use `POST` or `GET` as per the endpoint you are testing.
- Make sure the request body (for `POST` requests) is in JSON format.

For more details on API routes, check the [Postman Testing Setup](#).

---

## Project Structure

The project structure for the backend is as follows:

```plaintext
├── backend/
│   ├── app.py                 # Main Flask app with route definitions
│   ├── routes/                # Folder containing route files
│   │   ├── course_routes.py    # Course-related routes
│   │   ├── user_routes.py      # User-related routes
│   ├── utils/                 # Helper functions or utilities
│   ├── venv/                  # Virtual environment (created locally)
│   ├── requirements.txt       # Python dependencies file
│   └── README.md              # This file
```

---

## Contributing

Feel free to fork this repository and make improvements. If you find any bugs or have suggestions, open an issue or submit a pull request!

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

### Key Notes:
- Replace `https://github.com/yourusername/repository-name.git` with your actual repository URL.
- Add the actual routes in the "Testing the API" section if needed.
- Adjust the project structure based on your actual folder setup. 

This `README.md` will guide others through setting up and running the backend of your project.
