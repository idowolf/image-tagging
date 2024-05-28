import React from 'react';
import Login from '../components/Auth/Login';
import GoogleAuthButton from '../components/Auth/GoogleAuthButton';

const LoginPage: React.FC = () => {
  return (
    <div>
      <Login />
      <GoogleAuthButton />
    </div>
  );
};

export default LoginPage;
