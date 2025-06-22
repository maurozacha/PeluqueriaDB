import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastContainerApp = () => (
  <ToastContainer
    position="top-left"
    className="toastify-container"
    toastClassName="toastify-toast"
  />
);

export default ToastContainerApp;
