import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const categories = [
    { title: 'Electrical', icon: 'bi-lightning-charge-fill', desc: 'Lights, fans, sockets, wiring & voltage issues' },
    { title: 'Plumbing', icon: 'bi-droplet-fill', desc: 'Leaking taps, flush repairs, pipe blockage & drainage' },
    { title: 'Wi-Fi / Internet', icon: 'bi-wifi', desc: 'Network router connectivity, speed & port issues' },
    { title: 'Cleaning & Sanitation', icon: 'bi-stars', desc: 'Room sweeping, garbage removal & washroom hygiene' },
    { title: 'Furniture Repair', icon: 'bi-lamp-fill', desc: 'Beds, study tables, chairs, cupboards & locks' },
    { title: 'Food & Mess', icon: 'bi-cup-hot-fill', desc: 'Mess food quality, hygiene & dining hall issues' },
    { title: 'Security', icon: 'bi-shield-check', desc: 'Gate entry, CCTV coverage & safety measures' },
    { title: 'Water Supply', icon: 'bi-water', desc: 'Hot water geysers, overhead tank supply & purifiers' },
  ];

  return (
    <div className="container">
      {/* Hero Banner */}
      <div className="hero-banner mb-5 text-center text-lg-start">
        <div className="row align-items-center">
          <div className="col-lg-7">
            <span className="badge bg-warning text-dark px-3 py-2 rounded-pill mb-3 fw-bold">
              ⚡ Smart Hostel Grievance Portal
            </span>
            <h1 className="display-5 fw-extrabold mb-3">
              Fast, Transparent & Efficient Hostel Complaint Tracking
            </h1>
            <p className="lead mb-4 opacity-90">
              Eliminate paper complaint registers. Submit your hostel maintenance tickets online, track live resolution milestones, and receive instant status notifications.
            </p>

            <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
              {isAuthenticated ? (
                <Link
                  to={user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                  className="btn btn-warning btn-lg rounded-pill px-4 fw-bold shadow"
                >
                  <i className="bi bi-speedometer2 me-2"></i> Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-warning btn-lg rounded-pill px-4 fw-bold shadow">
                    <i className="bi bi-pencil-square me-2"></i> Register Complaint Account
                  </Link>
                  <Link to="/login" className="btn btn-outline-light btn-lg rounded-pill px-4 fw-semibold">
                    <i className="bi bi-box-arrow-in-right me-2"></i> Student / Admin Login
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="col-lg-5 text-center mt-4 mt-lg-0">
            <div className="p-4 bg-white text-dark rounded-4 shadow-lg">
              <i className="bi bi-headset text-primary display-1 mb-3"></i>
              <h5 className="fw-bold">24/7 Warden Assistance</h5>
              <p className="text-muted small">Direct escalation for emergency water, electrical, or security tickets.</p>
              <div className="d-flex justify-content-around text-start border-top pt-3 mt-3">
                <div>
                  <h6 className="fw-bold mb-0 text-primary">100%</h6>
                  <small className="text-muted">Digital Tracking</small>
                </div>
                <div>
                  <h6 className="fw-bold mb-0 text-success">Real-Time</h6>
                  <small className="text-muted">Status Alerts</small>
                </div>
                <div>
                  <h6 className="fw-bold mb-0 text-warning">Quick</h6>
                  <small className="text-muted">Staff Assign</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Categories */}
      <div className="mb-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold text-dark">Supported Complaint Categories</h2>
          <p className="text-muted">Categorized tickets ensure swift routing to dedicated maintenance staff.</p>
        </div>

        <div className="row g-4">
          {categories.map((cat, index) => (
            <div className="col-md-6 col-lg-3" key={index}>
              <div className="card custom-card h-100 p-4 border-0">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-3">
                    <i className={`bi ${cat.icon} fs-3`}></i>
                  </div>
                  <h6 className="fw-bold mb-0">{cat.title}</h6>
                </div>
                <p className="text-muted fs-7 mb-0">{cat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
