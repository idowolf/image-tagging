import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CompleteProfilePage from './pages/CompleteProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import ImageUpload from './components/ImageUpload/ImageUpload';
import SearchImages from './components/Search/SearchImages';
import ProtectedRoute from './components/ProtectedRoute';
import { CssBaseline } from '@mui/material';

const App: React.FC = () => {
  return (
    <>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/complete-profile" element={<ProtectedRoute strict={false} element={<CompleteProfilePage />} />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/upload" element={<ProtectedRoute element={<ImageUpload />} />} />
        <Route path="/search" element={<ProtectedRoute element={<SearchImages />} />} />
      </Routes>
    </>
  );
};

export default App;
