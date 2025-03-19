import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Assuming AuthContext manages user authentication state

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth(); // Get the current user from AuthContext

  // If user is not logged in, redirect to sign-in page
  return currentUser ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
