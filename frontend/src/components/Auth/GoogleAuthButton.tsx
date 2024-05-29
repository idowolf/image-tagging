import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { authWithGoogle } from '../../routes/user';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT as string;

/**
 * Renders a Google authentication button.
 * 
 * @returns The GoogleAuth component.
 */
const GoogleAuth = () => {
    const navigate = useNavigate();
    const { setToken, user } = useAuth();

    useEffect (() => {
        if (user) {
            navigate('/');
        }
    }, [user]);
    
    /**
     * Handles the successful authentication response from Google.
     * 
     * @param response - The authentication response object.
     */
    const handleSuccess = async (response: any) => {
        const credential = response.credential;
        const clientId = response.clientId;
        try {
            const response = await authWithGoogle({ credential, clientId });
            localStorage.setItem('token', response.data.token);
            setToken(response.data.token);
            navigate('/');
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    /**
     * Handles the error during authentication.
     */
    const handleError = () => {
        console.log('Login Failed');
    };

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                useOneTap
            />
        </GoogleOAuthProvider>
    );
};

export default GoogleAuth;
