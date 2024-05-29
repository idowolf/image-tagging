import React from 'react';
import { Button, Typography } from '@mui/material';
import { PageContainer } from './styles';

/**
 * Renders the home page of the Image Tagging Platform.
 * @returns The rendered home page component.
 */
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
