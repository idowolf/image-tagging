import React from 'react';
import { Snackbar, Alert } from '@mui/material';

interface AlertProps {
  message: string | null;
  severity: 'success' | 'error';
  onClose: () => void;
}

/**
 * Alerts component displays a snackbar with a message and severity.
 * 
 * @param message - The message to be displayed in the snackbar.
 * @param severity - The severity of the alert (e.g., "error", "warning", "info", "success").
 * @param onClose - Callback function to be called when the snackbar is closed.
 */
const Alerts: React.FC<AlertProps> = ({ message, severity, onClose }) => {
  return (
    <Snackbar open={!!message} autoHideDuration={6000} onClose={onClose}>
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Alerts;
