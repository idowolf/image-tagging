import { Container } from '@mui/material';
import styled from 'styled-components';

export const UploadDiv = styled.div`
  border: 2px dashed #ccc;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: border 0.2s ease-in-out;

  &:hover {
    border: 2px dashed;
  }
`;

export const ImageUploadDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 100vh;
`;

export const FileInputDiv = styled.div`
  margin-top: 20px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  grid-gap: 20px;
`;