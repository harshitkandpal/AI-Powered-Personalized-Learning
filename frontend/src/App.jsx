import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './pages/SignIn.jsx';
import Login from './pages/Login.jsx';
import Homepage from './pages/Homepage.jsx';
import DomainRoadmaps from './pages/DomainRoadmaps.jsx';
import MyLearning from './pages/MyLearning.jsx';
import Profile from './pages/Profile.jsx';
import CourseDetail from './pages/CourseDetail.jsx';
import CourseContent from './pages/CourseContent.jsx';
import StudyPlanner from './pages/StudyPlanner.jsx';
// import Courses from './pages/Courses.jsx';
// import CourseDetails from './pages/CourseDetails.jsx'; // Page for individual course
import ProtectedRoute from './ProtectedRoute.jsx'; // Component for private route handling
import SummativeTest from './pages/SummativeTest.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/domain-roadmaps" element={<StudyPlanner />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Homepage />} />

        {/* Protected routes */}
        <Route path="/my-learning" element={<ProtectedRoute><MyLearning /></ProtectedRoute>} />
        <Route path="/course/:course_id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/course/:course_id/learn" element={<ProtectedRoute><CourseContent /></ProtectedRoute>} />
        <Route path="/courses/:course_id/summative-test" element={<ProtectedRoute><SummativeTest /></ProtectedRoute>} />
        
      </Routes>
    </Router>
  );
}

export default App;
