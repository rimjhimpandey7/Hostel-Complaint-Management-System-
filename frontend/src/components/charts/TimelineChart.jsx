import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const TimelineChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-muted py-5">No temporal complaint trend data available.</div>;
  }

  return (
    <div className="card custom-card p-3 h-100">
      <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
        <i className="bi bi-graph-up-arrow text-success"></i> Complaints Submitted Over Time
      </h6>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip formatter={(value) => [`${value} New Complaints`, 'Submissions']} />
            <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TimelineChart;
