import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastNotifier = () => {
  const { error, loginMessage, registrationStatus } = useSelector(state => state.auth);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (loginMessage) {
      toast.success(loginMessage);
    }
  }, [loginMessage]);

  useEffect(() => {
    if (registrationStatus === 'success') {
      toast.success('Registro exitoso!');
    }
  }, [registrationStatus]);

  return null;
};

export default ToastNotifier;