import React from 'react';
import Login from '../components/Auth/Login';
import GoogleAuthButton from '../components/Auth/GoogleAuthButton';
import { Typography } from '@mui/material';
import { PageContainer } from './styles';


const LoginPage: React.FC = () => {
  return (
    <PageContainer className='auth'>
      <Login />
      <GoogleAuthButton />
      <Typography variant="body1">
        Don't have an account? <a href="/register">Sign up</a>
      </Typography>
    </PageContainer>
  );
};

export default LoginPage;
