import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    strict?: boolean;
    element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ strict = true, element }) => {
    const { user, loading } = useAuth();

    const validatedUser = (user: any) => {
        return user.fullName && user.department && user.team && user.role;
    };
    
    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    } else if (strict && !validatedUser(user)) {
        return <Navigate to="/complete-profile" />;
    } else {
        return element;
    }
};

export default ProtectedRoute;
