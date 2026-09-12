import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

const AdminLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="dashboard-wrapper">
        <Sidebar />
        <main className="main-content p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
