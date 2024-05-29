import React from 'react';
import { Snackbar, Alert } from '@mui/material';

interface AlertProps {
  message: string | null;
  severity: 'success' | 'error';
  onClose: () => void;
}

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
