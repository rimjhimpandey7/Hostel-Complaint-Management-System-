import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import DeleteModal from '../../components/modals/DeleteModal';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Delete Modal
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/students', { params: { search } });
      setStudents(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  const handleDeleteStudent = async () => {
    if (selectedStudent) {
      await api.delete(`/admin/students/${selectedStudent.id}`);
      setShowDeleteModal(false);
      fetchStudents();
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h4 className="fw-bold mb-1">Manage Registered Students</h4>
          <p className="text-muted mb-0">Search resident records, inspect complaint submission history, and manage accounts</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card custom-card p-3 mb-4">
        <form onSubmit={handleSearchSubmit} className="row g-2">
          <div className="col-md-10">
            <div className="input-group">
              <span className="input-group-text bg-light"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="Search Student Name, Email, Roll ID, Room, or Block..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-outline-primary w-100 rounded-pill">
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Students Master Table */}
      <div className="card custom-card p-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading students...</span>
            </div>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-5 text-muted">No student records found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table custom-table align-middle">
              <thead className="table-light text-muted fs-7 text-uppercase">
                <tr>
                  <th>Student Name</th>
                  <th>Roll / Student ID</th>
                  <th>Contact Email & Phone</th>
                  <th>Room & Block</th>
                  <th>Total Complaints</th>
                  <th>Registered On</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="fw-bold text-dark">{s.name}</div>
                    </td>
                    <td>
                      <span className="badge bg-secondary">{s.student_id || 'N/A'}</span>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{s.email}</div>
                      <small className="text-muted">{s.phone}</small>
                    </td>
                    <td>
                      <div className="fw-bold text-primary">Room {s.room_number}</div>
                      <small className="text-muted">{s.hostel_block}</small>
                    </td>
                    <td>
                      <span className="badge bg-info text-white rounded-pill px-3">{s.total_complaints} Complaints</span>
                    </td>
                    <td>
                      <small className="text-muted">{new Date(s.created_at).toLocaleDateString()}</small>
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-danger rounded-pill px-3"
                        onClick={() => {
                          setSelectedStudent(s);
                          setShowDeleteModal(true);
                        }}
                      >
                        <i className="bi bi-person-x me-1"></i> Remove Account
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteStudent}
        title="Remove Student Account"
        message={`Are you sure you want to remove student account '${selectedStudent?.name}' (${selectedStudent?.student_id})? All complaint tickets filed by this student will also be removed.`}
      />
    </div>
  );
};

export default ManageStudents;
