import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import BackToTop from './BackToTop';
import HamAIChatbot from './HamAIChatbot';

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-20"> 
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
      <HamAIChatbot />
    </div>
  );
}

export default Layout;