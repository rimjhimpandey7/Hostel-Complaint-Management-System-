const express = require('express');
const router = express.Router();
const {
  getAllComplaints,
  updateStatus,
  assignComplaint,
  deleteComplaint,
  getStudents,
  deleteStudent,
  getAnalytics,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Protect all admin routes
router.use(protect);
router.use(authorize('admin'));

router.get('/complaints', getAllComplaints);
router.put('/complaints/:id/status', updateStatus);
router.put('/complaints/:id/assign', assignComplaint);
router.delete('/complaints/:id', deleteComplaint);

router.get('/students', getStudents);
router.delete('/students/:id', deleteStudent);

router.get('/analytics', getAnalytics);

module.exports = router;
