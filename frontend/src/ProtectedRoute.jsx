import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Assuming AuthContext manages user authentication state

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth(); // Get the current user and loading state from AuthContext

  // Show a loading indicator while Firebase is checking the auth state
  if (loading) {
    return <p>Loading...</p>; // You can replace this with a spinner or any loading indicator
  }

  // If the user is logged in, show the protected content
  return currentUser ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
