const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  updateComplaint,
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, authorize('student'), upload.single('image'), createComplaint);
router.get('/my', protect, authorize('student'), getMyComplaints);
router.get('/:id', protect, getComplaintById);
router.put('/:id', protect, authorize('student'), upload.single('image'), updateComplaint);

module.exports = router;
