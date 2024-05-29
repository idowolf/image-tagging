import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CircularProgress } from '@mui/material';
interface ProtectedRouteProps {
    strict?: boolean;
    element: React.ReactElement;
}

/**
 * A protected route component that redirects users based on their authentication status and profile completeness.
 * @param strict - Determines whether the user's profile must be fully validated.
 * @param element - The component to render if the user is authenticated and their profile is valid.
 * @returns The protected route component.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ strict = true, element }) => {
    const { user, loading } = useAuth();

    const validatedUser = (user: any) => {
        return user.fullName && user.department && user.team && user.role;
    };
    
    if (loading) {

        if (loading) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </div>
            );
        }
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
