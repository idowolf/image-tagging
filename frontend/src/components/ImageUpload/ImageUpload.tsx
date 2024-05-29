import React, { useState, useCallback } from 'react';
import { Button, Container, Typography } from '@mui/material';
import { uploadImage } from '../../routes/images';
import UploadContainer from './UploadContainer';
import FileInput from './FileInput';
import Alerts from './Alerts';
import { ImageUploadDiv } from './styles';

const ImageUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('Only jpg or png files are allowed');
      return;
    }
    setFile(file);
    setError(null);
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      await uploadImage(formData);
      setSuccess('Image uploaded successfully. Your file is being processed and will appear in search results soon.');
      setFile(null);
    } catch (error) {
      console.error('Upload failed', error);
      setError('Upload failed. Please try again later.');
    }
  };

  return (
    <ImageUploadDiv>
      <Typography variant="h4" gutterBottom>Upload Image</Typography>
      <UploadContainer onDrop={onDrop} />
      <FileInput file={file} />
      <Button variant="contained" onClick={handleUpload} style={{ width: 'fit-content' }}>
        Upload
      </Button>
      <Alerts message={error} severity="error" onClose={() => setError(null)} />
      <Alerts message={success} severity="success" onClose={() => setSuccess(null)} />
    </ImageUploadDiv>
  );
};

export default ImageUpload;
