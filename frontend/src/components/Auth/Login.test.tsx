import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';
import { AuthProvider } from '../../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

test('renders Login component', () => {
  render(
    <AuthProvider>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </AuthProvider>
  );
  expect(screen.getByTestId('login-button')).toBeInTheDocument();
});

test('validates email and password inputs', () => {
  render(
    <AuthProvider>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </AuthProvider>
  );

  const emailInput = screen.getByLabelText(/Email/i);
  const passwordInput = screen.getByLabelText(/Password/i);
  const loginButton = screen.getByTestId('login-button');

  fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
  fireEvent.change(passwordInput, { target: { value: '123' } });

  expect(loginButton).toBeDisabled();
});

test('shows error message on login failure', async () => {
  render(
    <AuthProvider>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </AuthProvider>
  );

  const emailInput = screen.getByLabelText(/Email/i);
  const passwordInput = screen.getByLabelText(/Password/i);
  const loginButton = screen.getByTestId('login-button');

  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password' } });

  fireEvent.click(loginButton);

  await waitFor(() => {
    expect(screen.getByText(/Login failed. Please try again./i)).toBeInTheDocument();
  });
});
