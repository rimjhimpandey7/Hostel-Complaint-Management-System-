import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

const PRIORITY_COLORS = {
  Low: '#64748b',
  Medium: '#0284c7',
  High: '#d97706',
  Emergency: '#dc2626',
};

const PriorityChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-muted py-5">No priority analytics available.</div>;
  }

  const formattedData = data.map((item) => ({
    priority: item.priority,
    count: parseInt(item.count, 10),
  }));

  return (
    <div className="card custom-card p-3 h-100">
      <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
        <i className="bi bi-bar-chart-fill text-warning"></i> Complaints by Priority
      </h6>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="priority" />
            <YAxis allowDecimals={false} />
            <Tooltip formatter={(value) => [`${value} Tickets`, 'Complaints']} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.priority] || '#4f46e5'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriorityChart;
