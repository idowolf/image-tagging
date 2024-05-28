import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { completeUserProfile } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CompleteProfile: React.FC<{ userId: string }> = ({ userId }) => {
    const [department, setDepartment] = useState('');
    const [team, setTeam] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();
    const { setUser } = useAuth();
    
    const handleCompleteProfile = async () => {
        try {
            const user = await completeUserProfile({ userId, department, team, role });
            setUser(user.data);
            navigate('/');
        } catch (error) {
            console.error('Profile completion failed', error);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Complete Profile</Typography>
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
            <Button variant="contained" color="primary" onClick={handleCompleteProfile}>Complete Profile</Button>
        </Container>
    );
};

export default CompleteProfile;
