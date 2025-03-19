import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './pages/SignIn.jsx';
import Login from './pages/Login.jsx';
import Homepage from './pages/Homepage.jsx';
// import Courses from './pages/Courses.jsx';
// import CourseDetails from './pages/CourseDetails.jsx'; // Page for individual course
import ProtectedRoute from './ProtectedRoute.jsx'; // Component for private route handling

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Homepage />} />
        {/* <Route path="/courses" element={<Courses />} /> */}

        {/* Protected routes */}
        {/* <Route 
          path="/courses/:courseId" 
          element={<ProtectedRoute><CourseDetails /></ProtectedRoute>} 
        /> */}
      </Routes>
    </Router>
  );
}

export default App;
