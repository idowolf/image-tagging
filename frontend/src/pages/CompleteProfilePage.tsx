import React from 'react';
import CompleteProfile from '../components/Profile/CompleteProfile';
import { useParams } from 'react-router-dom';
import { PageContainer } from './styles';

/**
 * Renders the CompleteProfilePage component.
 * 
 * @returns The rendered CompleteProfilePage component.
 */
const CompleteProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  return (
    <PageContainer className='auth'>
      <CompleteProfile userId={userId!} />
    </PageContainer>
  );
};

export default CompleteProfilePage;
