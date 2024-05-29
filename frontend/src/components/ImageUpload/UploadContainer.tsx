import React from 'react';
import { Typography } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { UploadDiv } from './styles';

interface UploadContainerProps {
  onDrop: (acceptedFiles: File[]) => void;
}

/**
 * UploadContainer component for handling file uploads.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.onDrop - The function to be called when a file is dropped.
 * @returns {JSX.Element} - The rendered UploadContainer component.
 */
const UploadContainer: React.FC<UploadContainerProps> = ({ onDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({ onDrop, 
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      }    
    , maxSize: 10 * 1024 * 1024 });

  return (
    <UploadDiv {...getRootProps()}>
      <input {...getInputProps()} />
      <Typography variant="body1">Drag 'n' drop a file here, or click to select one</Typography>
      <Typography variant="body2">(Only *.jpeg and *.png images, max size 10MB)</Typography>
    </UploadDiv>
  );
};

export default UploadContainer;
