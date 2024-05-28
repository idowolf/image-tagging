import React from 'react';
import EditProfile from '../components/Profile/EditProfile';
import { useParams } from 'react-router-dom';

const EditProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  return (
    <div>
      <EditProfile userId={userId!} />
    </div>
  );
};

export default EditProfilePage;
