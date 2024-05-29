import React from 'react';
import { Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { PageContainer } from './styles';

const HomePage: React.FC = () => {
    return (
        <PageContainer>
            <Typography variant="h4" gutterBottom>Welcome to the Image Tagging Platform</Typography>
            <Button href="/upload" variant="outlined">
                Upload Image
            </Button>
            <Button href="/search" variant="outlined">
                Search Images
            </Button>
        </PageContainer>
    );
};

export default HomePage;
