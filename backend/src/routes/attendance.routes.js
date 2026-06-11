import { Router } from 'express';
import { body } from 'express-validator';
import { markQrAttendance, getTodayAttendance, getAttendanceStats, getAttendanceReport, getStudentOwnAttendance, deleteAttendance } from '../controllers/attendance.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router = Router();

const scanRules = [
  body('studentId')
    .trim()
    .notEmpty().withMessage('Student ID is required')
    .isLength({ min: 5 }).withMessage('Invalid Student ID format'),
  validate
];

router.post('/scan', protect, authorize('teacher', 'admin'), scanRules, markQrAttendance);
router.get('/my-attendance', protect, authorize('student'), getStudentOwnAttendance);
router.get('/today', protect, authorize('teacher', 'admin'), getTodayAttendance);
router.get('/stats', protect, authorize('teacher', 'admin'), getAttendanceStats);
router.get('/report', protect, authorize('teacher', 'admin'), getAttendanceReport);
router.delete('/:id', protect, authorize('admin'), deleteAttendance);

export default router;
