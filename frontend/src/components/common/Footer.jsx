import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <div className="container text-center">
        <div className="row align-items-center">
          <div className="col-md-6 text-md-start mb-2 mb-md-0">
            <h6 className="mb-0 fw-bold"><i className="bi bi-building me-2"></i>Hostel Complaint Management System</h6>
            <small className="text-muted">Streamlining campus resident feedback & maintenance</small>
          </div>
          <div className="col-md-6 text-md-end">
            <small className="text-muted">Designed for Student Welfare & Warden Office © 2026</small>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
