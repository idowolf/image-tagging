import React from 'react';
import CompleteProfile from '../components/Profile/CompleteProfile';
import { useParams } from 'react-router-dom';

const CompleteProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  return (
    <div>
      <CompleteProfile userId={userId!} />
    </div>
  );
};

export default CompleteProfilePage;
