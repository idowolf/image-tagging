import React from 'react';
import Login from '../components/Auth/Login';
import GoogleAuthButton from '../components/Auth/GoogleAuthButton';

const LoginPage: React.FC = () => {
  return (
    <div>
      <Login />
      <GoogleAuthButton />
      <p>Don't have an account? <a href="/register">Sign up</a></p>
    </div>
  );
};

export default LoginPage;
