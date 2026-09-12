import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import CategoryChart from '../../components/charts/CategoryChart';
import StatusChart from '../../components/charts/StatusChart';
import PriorityChart from '../../components/charts/PriorityChart';
import TimelineChart from '../../components/charts/TimelineChart';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/analytics');
      if (res.success) setAnalytics(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const counters = analytics?.counters || {};

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h4 className="fw-bold mb-1">Interactive Complaint Analytics & Insights</h4>
          <p className="text-muted mb-0">Visual analysis of hostel maintenance bottlenecks, complaint trends, and department performance</p>
        </div>
        <button className="btn btn-outline-dark rounded-pill px-4" onClick={fetchAnalytics}>
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh Analytics
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading Analytics Data...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Metric Highlights */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="card custom-card p-3 text-center border-0 bg-primary text-white">
                <small className="text-uppercase fw-bold opacity-75">Total Filed Tickets</small>
                <h2 className="fw-bold my-1">{counters.total_complaints || 0}</h2>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card custom-card p-3 text-center border-0 bg-warning text-dark">
                <small className="text-uppercase fw-bold opacity-75">Pending Action</small>
                <h2 className="fw-bold my-1">{counters.pending_complaints || 0}</h2>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card custom-card p-3 text-center border-0 bg-success text-white">
                <small className="text-uppercase fw-bold opacity-75">Successfully Resolved</small>
                <h2 className="fw-bold my-1">{counters.resolved_complaints || 0}</h2>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card custom-card p-3 text-center border-0 bg-danger text-white">
                <small className="text-uppercase fw-bold opacity-75">Emergency Tickets</small>
                <h2 className="fw-bold my-1">{counters.emergency_complaints || 0}</h2>
              </div>
            </div>
          </div>

          {/* Recharts Analytics Grid */}
          <div className="row g-4 mb-4">
            <div className="col-lg-6">
              <CategoryChart data={analytics?.byCategory} />
            </div>
            <div className="col-lg-6">
              <StatusChart data={analytics?.byStatus} />
            </div>
            <div className="col-lg-6">
              <PriorityChart data={analytics?.byPriority} />
            </div>
            <div className="col-lg-6">
              <TimelineChart data={analytics?.overTime} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
