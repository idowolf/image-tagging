import React, { useState } from 'react';
import { Button, Container, Typography, Input } from '@mui/material';
import { uploadImage } from '../../services/api';

const ImageUpload: React.FC = () => {
  const [file, setFile] = useState<File | void>(undefined);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      await uploadImage(formData);
      alert('Image uploaded successfully');
    } catch (error) {
      console.error('Upload failed', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Upload Image</Typography>
      <Input
        type="file"
        onChange={(e) => setFile((e.target as HTMLInputElement)?.files?.[0])}
        fullWidth
      />
      <Button variant="contained" color="primary" onClick={handleUpload}>Upload</Button>
    </Container>
  );
};

export default ImageUpload;
