import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { loginUser } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setToken } = useAuth();
  
  const handleLogin = async () => {
    try {
      const response = await loginUser({ email, password });
      setToken(response.data.token);
      navigate('/');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Login</Typography>
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
      <Button variant="contained" color="primary" onClick={handleLogin}>Login</Button>
    </Container>
  );
};

export default Login;
