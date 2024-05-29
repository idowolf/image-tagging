import React, { useState } from 'react';
import { TextField, Button, Typography, Snackbar, Alert } from '@mui/material';
import { loginUser } from '../../routes/user';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isEmailValid, isPasswordValid } from '../../utils/dataValidation';
import { FormContainer } from './styles';

/**
 * Login component for user authentication.
 * 
 * @returns React functional component
 */
const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setToken } = useAuth();

  /**
   * Handles the login process.
   * 
   * @returns void
   */
  const handleLogin = async () => {
    try {
      const response = await loginUser({ email, password });
      setToken(response.data.token);
      navigate('/');
    } catch (error) {
      console.error('Login failed', error);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <FormContainer>
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
      <Button
        data-testid="login-button"
        variant="contained"
        color="primary"
        onClick={handleLogin}
        disabled={!isEmailValid(email) || !isPasswordValid(password)}
        sx={{ marginTop: 2 }}
      >
        Login
      </Button>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </FormContainer>
  );
};

export default Login;
