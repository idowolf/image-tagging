import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Snackbar, Alert } from '@mui/material';
import { registerUser } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { isEmailValid, isPasswordValid } from '../../utils/dataValidation';
import { FormContainer } from './styles';
import { useAuth } from '../../context/AuthContext';

const Register: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setToken } = useAuth();
  
  const handleRegister = async () => {
    try {
      const response = await registerUser({ fullName, email, password });
      setToken(response.data.token);
      navigate('/login');
    } catch (error) {
      console.error('Registration failed', error);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <FormContainer>
      <Typography variant="h4" gutterBottom>Sign up</Typography>
      <TextField
        label="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleRegister}
        disabled={!isEmailValid(email) || !isPasswordValid(password) || !fullName}
        sx={{ marginTop: 2 }}
      >
        Register
      </Button>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </FormContainer>
  );
};

export default Register;
