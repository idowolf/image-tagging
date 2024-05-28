import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { authWithGoogle } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';

const clientId = '437586661469-8pc9qal7rqqm8da9r3dtii3kd2m82b85.apps.googleusercontent.com';

const GoogleAuth = () => {
    const navigate = useNavigate();
    const { setToken, user } = useAuth();

    useEffect (() => {
        if (user) {
            navigate('/');
        }
    }, [user]);
    
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
