import React from 'react';
import { PageContainer } from './styles';
import ImageUpload from '../components/ImageUpload/ImageUpload';

const UploadPage: React.FC = () => {
  return (
    <PageContainer>
      <ImageUpload />
    </PageContainer>
  );
};

export default UploadPage;
