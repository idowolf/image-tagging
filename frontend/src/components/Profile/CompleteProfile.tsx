import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { completeUserProfile } from '../../routes/user';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CompleteProfile: React.FC<{ userId: string }> = ({ userId }) => {
    const [fullName, setFullName] = useState('');
    const [department, setDepartment] = useState('');
    const [team, setTeam] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();
    const { user, setUser } = useAuth();

    useEffect(() => {
        if (user) {
            setFullName(user.fullName);
            setDepartment(user.department);
            setTeam(user.team);
            setRole(user.role);
        }
    }, [user]);

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
            <Typography variant="h4" gutterBottom>Profile Details</Typography>
            <TextField
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                fullWidth
                margin="normal"
            />
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
            <Button variant="contained" color="primary" disabled={!fullName || !department || !team || !role} onClick={handleCompleteProfile} sx={{ marginTop: 2 }}>Complete Profile</Button>
        </Container>
    );
};

export default CompleteProfile;
