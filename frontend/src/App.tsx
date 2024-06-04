import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CompleteProfilePage from './pages/CompleteProfilePage';
import ProtectedRoute from './components/General/ProtectedRoute';
import { CssBaseline } from '@mui/material';
import UploadPage from './pages/UploadPage';
import SearchPage from './pages/SearchPage';
import TopBar from './components/General/TopBar';
import { AppContainer, ContentContainer } from './styles';

const App: React.FC = () => {

  return (
    <>
      <CssBaseline />
      <AppContainer>
        <TopBar />
      <ContentContainer>

            <Routes>
              <Route path="/" element={<ProtectedRoute element={<HomePage />} />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/complete-profile" element={<ProtectedRoute strict={false} element={<CompleteProfilePage />} />} />
              <Route path="/upload" element={<ProtectedRoute element={<UploadPage />} />} />
              <Route path="/search" element={<ProtectedRoute element={<SearchPage />} />} />
            </Routes>
        </ContentContainer>
      </AppContainer>
    </>
  );
};

export default App;
