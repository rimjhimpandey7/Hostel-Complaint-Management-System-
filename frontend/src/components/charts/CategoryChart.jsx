import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b', '#14b8a6', '#f97316'];

const CategoryChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-muted py-5">No category analytics data available.</div>;
  }

  const formattedData = data.map((item) => ({
    name: item.category,
    value: parseInt(item.count, 10),
  }));

  return (
    <div className="card custom-card p-3 h-100">
      <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
        <i className="bi bi-pie-chart-fill text-primary"></i> Complaints by Category
      </h6>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={formattedData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} Tickets`, 'Count']} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryChart;
