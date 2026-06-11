import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admission',
    required: true
  },
  studentId: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  batchName: {
    type: String,
    default: 'N/A'
  },
  date: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Late'],
    default: 'Present'
  },
  scannedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  scannedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

attendanceSchema.index({ studentId: 1, date: 1, courseName: 1 }, { unique: true });
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ student: 1, date: 1 });
attendanceSchema.index({ courseName: 1, date: 1 });

export const Attendance = mongoose.model('Attendance', attendanceSchema);
