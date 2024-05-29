import React from 'react';
import { PageContainer } from './styles';
import SearchImages from '../components/Search/SearchImages';

/**
 * Represents the UploadPage component.
 * This component renders the search page, which includes the SearchImages component.
 */
const UploadPage: React.FC = () => {
  return (
    <PageContainer>
      <SearchImages />
    </PageContainer>
  );
};

export default UploadPage;
