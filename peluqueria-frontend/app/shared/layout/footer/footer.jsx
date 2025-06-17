import React from 'react';
import { FOOTER_TITLE } from '../constants/system-constants';
import '../shared/layout/footer/footer.scss';

const Footer = ({ isAuthenticated }) => {
  return (
    <div className="footer page-content" style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <span>{FOOTER_TITLE}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span>Versión: {process.env.REACT_APP_VERSION || '1.0.0'}</span>
      </div>
    </div>
  );
};

export default Footer;