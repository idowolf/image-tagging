import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  margin-right: 20px;
`;

const StyledButton = styled(Button)`
    color: white;
    text-decoration: none;
    margin-right: 20px;
`;

/**
 * Represents the top bar component of the application.
 * This component displays the navigation links and user information.
 */
const TopBar: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <AppBar position="static">
            <Toolbar>
                {user && <>
                    <StyledLink to="/">
                        Welcome, {user.fullName.split(' ')[0]}
                    </StyledLink>
                    <div style={{ flexGrow: 1 }} />
                    <StyledLink to="/upload">Upload</StyledLink>
                    <StyledLink to="/search">Search</StyledLink>
                    <StyledLink to="/complete-profile">Profile</StyledLink>
                    <StyledButton style={{ textTransform: 'none' }} color='inherit' onClick={logout}>
                        Logout
                    </StyledButton>
                </>}
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;
