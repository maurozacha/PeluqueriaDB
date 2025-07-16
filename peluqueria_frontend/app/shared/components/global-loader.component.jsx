import React from 'react';
import { Spinner } from 'reactstrap';
import '../styles/global.scss'; 

const GlobalLoader = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="global-loader-overlay">
      <div className="global-loader-content">
        <Spinner color="primary" size="" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-2 text-white">Cargando aplicación...</p>
      </div>
    </div>
  );
};

export default GlobalLoader;