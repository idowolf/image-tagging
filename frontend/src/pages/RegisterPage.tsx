import React from 'react';
import Register from '../components/Auth/Register';
import GoogleAuthButton from '../components/Auth/GoogleAuthButton';
import { Typography } from '@mui/material';
import { PageContainer } from './styles';

const RegisterPage: React.FC = () => {
  return (
    <PageContainer className='auth'>
      <Register />
      <GoogleAuthButton />
      <Typography variant="body1">
        Already have an account? <a href="/login">Login</a>
      </Typography>
    </PageContainer>
  );
};

export default RegisterPage;
