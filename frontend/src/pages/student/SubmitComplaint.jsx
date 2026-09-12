import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const SubmitComplaint = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Electrical',
    description: '',
    room_number: user?.room_number || '',
    priority: 'Medium',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    'Electrical',
    'Plumbing',
    'Cleaning',
    'Wi-Fi/Internet',
    'Furniture',
    'Food/Mess',
    'Security',
    'Water Supply',
    'Room Maintenance',
    'Other',
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must not exceed 5 MB.');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('description', formData.description);
      data.append('room_number', formData.room_number);
      data.append('priority', formData.priority);
      if (imageFile) {
        data.append('image', imageFile);
      }

      const res = await api.post('/complaints', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.success) {
        setSuccess('Complaint submitted successfully. Unique Ticket ID: ' + res.data.complaint_id);
        setTimeout(() => {
          navigate(`/student/complaints/${res.data.id}`);
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit complaint. Please check your input.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-2">
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <div className="card custom-card p-4 p-md-5">
            <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
              <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-3">
                <i className="bi bi-file-earmark-plus-fill fs-2"></i>
              </div>
              <div>
                <h4 className="fw-bold mb-0">Submit New Maintenance Complaint</h4>
                <p className="text-muted small mb-0">Provide precise issue details to help staff resolve it quickly</p>
              </div>
            </div>

            {success && (
              <div className="alert alert-success d-flex align-items-center gap-2 mb-4">
                <i className="bi bi-check-circle-fill fs-5"></i>
                <div>{success}</div>
              </div>
            )}

            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
                <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-8">
                  <label className="form-label text-muted small fw-bold">COMPLAINT TITLE *</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    placeholder="e.g. Ceiling Fan making noise / Leaking washroom tap"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label text-muted small fw-bold">ROOM NUMBER *</label>
                  <input
                    type="text"
                    name="room_number"
                    className="form-control"
                    value={formData.room_number}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold">CATEGORY *</label>
                  <select
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold">PRIORITY LEVEL *</label>
                  <select
                    name="priority"
                    className="form-select"
                    value={formData.priority}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Low">Low - Minor cosmetic issue</option>
                    <option value="Medium">Medium - Regular repair issue</option>
                    <option value="High">High - Impairing daily study/room use</option>
                    <option value="Emergency">Emergency - Hazard, major leakage or sparking</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label text-muted small fw-bold">DETAILED DESCRIPTION *</label>
                  <textarea
                    name="description"
                    className="form-control"
                    rows="4"
                    placeholder="Describe the problem, precise location in room, and any relevant details..."
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>

                <div className="col-12">
                  <label className="form-label text-muted small fw-bold">UPLOAD COMPLAINT IMAGE (OPTIONAL)</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                  />
                  <small className="text-muted d-block mt-1">Accepted formats: JPG, PNG, WEBP (Max 5MB)</small>

                  {imagePreview && (
                    <div className="mt-3">
                      <p className="small text-muted fw-bold mb-1">Image Preview:</p>
                      <div className="image-preview-container" style={{ maxHeight: '200px', width: '300px' }}>
                        <img src={imagePreview} alt="Upload Preview" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill px-4"
                  onClick={() => navigate('/student/dashboard')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary rounded-pill px-5 fw-bold shadow-sm"
                  disabled={loading}
                >
                  {loading ? (
                    <span><span className="spinner-border spinner-border-sm me-2"></span>Submitting...</span>
                  ) : (
                    'Submit Ticket Now'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitComplaint;
