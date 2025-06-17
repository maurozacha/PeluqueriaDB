import React from 'react';
import { Link } from 'react-router-dom';
import Title from '../shared/componentes/title.component';

const PageNotFound = () => {
  return (
    <div className="page-not-found-container">
      <div className="error-content text-center">
        <Title title={'404'} />
        <Title title={'La página no ha sido encontrada'} />
        <p className="mt-3">Lo sentimos, la página que buscas no existe o ha sido movida.</p>
        <Link to="/" className="btn btn-primary mt-4">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;