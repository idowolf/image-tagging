import React from 'react';
import { Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <Container>
            <Typography variant="h2" gutterBottom>Welcome to the Image Tagging Platform</Typography>
            <Link to="/upload">Upload Image</Link>
            <Link to="/search">Search Images</Link>
        </Container>
    );
};

export default Home;
