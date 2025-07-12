import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './header/header';
import Footer from './footer/footer';

const Layout = () => {
  return (
    <>
      <Header />
      <main className="container">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </>
  );
};

export default Layout;
