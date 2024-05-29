import React from 'react';
import { PageContainer } from './styles';
import ImageUpload from '../components/ImageUpload/ImageUpload';

/**
 * Represents the UploadPage component.
 * This component is responsible for rendering the page that allows users to upload images.
 */
const UploadPage: React.FC = () => {
  return (
    <PageContainer>
      <ImageUpload />
    </PageContainer>
  );
};

export default UploadPage;
