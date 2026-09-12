import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const STATUS_COLORS = {
  Pending: '#f59e0b',
  Assigned: '#6366f1',
  'In Progress': '#3b82f6',
  Resolved: '#10b981',
  Rejected: '#64748b',
};

const StatusChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-muted py-5">No status data available.</div>;
  }

  const formattedData = data.map((item) => ({
    name: item.status,
    value: parseInt(item.count, 10),
  }));

  return (
    <div className="card custom-card p-3 h-100">
      <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
        <i className="bi bi-donut-chart-fill text-info"></i> Complaints by Status
      </h6>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={formattedData}
              cx="50%"
              cy="50%"
              outerRadius={95}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#8884d8'} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} Complaints`, 'Count']} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatusChart;
