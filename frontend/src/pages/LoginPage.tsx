import React from 'react';
import Login from '../components/Auth/Login';
import GoogleAuthButton from '../components/Auth/GoogleAuthButton';
import { Typography } from '@mui/material';
import { PageContainer } from './styles';


/**
 * Renders the login page component.
 * @returns The rendered login page component.
 */
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
