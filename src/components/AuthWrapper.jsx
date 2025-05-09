import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

const AuthWrapper = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  return currentUser ? <Outlet /> : null;
};

export default AuthWrapper;