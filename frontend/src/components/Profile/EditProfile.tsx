import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { completeUserProfile } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const EditProfile: React.FC<{ userId: string }> = ({ userId }) => {
  const [department, setDepartment] = useState('');
  const [team, setTeam] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user profile and set the state
  }, [userId]);

  const handleEditProfile = async () => {
    try {
      await completeUserProfile({ userId, department, team, role });
      navigate('/');
    } catch (error) {
      console.error('Profile update failed', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Edit Profile</Typography>
      <TextField
        label="Department"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Team"
        value={team}
        onChange={(e) => setTeam(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleEditProfile}>Save Changes</Button>
    </Container>
  );
};

export default EditProfile;
