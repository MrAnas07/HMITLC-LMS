import { Attendance } from '../models/Attendance.js';
import Admission from '../models/Admission.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';

export const markQrAttendance = asyncHandler(async (req, res) => {
  const { studentId } = req.body;
  const todayDate = new Date().toISOString().split('T')[0];

  if (!studentId || !studentId.trim()) {
    throw new ApiError(400, 'Student ID is required');
  }

  const student = await Admission.findOne({ 
    studentId: studentId.trim(), 
    status: 'Approved' 
  }).populate('selectedCourse', 'title');

  if (!student) {
    throw new ApiError(404, 'Invalid ID Card or Student not approved!');
  }

  const courseName = student.selectedCourse?.title || 'General';
  const batchName = student.batchName || 'N/A';

  const alreadyMarked = await Attendance.findOne({ 
    studentId: studentId.trim(), 
    date: todayDate,
    courseName: courseName
  });
  if (alreadyMarked) {
    throw new ApiError(400, `Attendance already marked today at ${new Date(alreadyMarked.scannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
  }

  const newRecord = new Attendance({
    student: student._id,
    studentId: studentId.trim(),
    courseName: courseName,
    batchName: batchName,
    date: todayDate,
    status: 'Present',
    scannedBy: req.user?._id
  });

  await newRecord.save();

  res.status(200).json({
    success: true,
    message: 'Present marked!',
    studentName: student.fullName,
    studentId: student.studentId,
    courseName: courseName,
    batchName: batchName,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
});

export const getTodayAttendance = asyncHandler(async (req, res) => {
  const todayDate = new Date().toISOString().split('T')[0];
  const { page = 1, limit = 50 } = req.query;

  const records = await Attendance.find({ date: todayDate })
    .populate('student', 'fullName studentId courseName batchName')
    .populate('scannedBy', 'name')
    .sort({ scannedAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Attendance.countDocuments({ date: todayDate });

  res.status(200).json({
    success: true,
    records,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

export const getAttendanceStats = asyncHandler(async (req, res) => {
  const todayDate = new Date().toISOString().split('T')[0];
  const { startDate, endDate } = req.query;

  if (startDate && endDate) {
    const records = await Attendance.find({
      date: { $gte: startDate, $lte: endDate }
    }).populate('student', 'fullName studentId courseName batchName');

    const dateWiseStats = {};
    records.forEach(record => {
      if (!dateWiseStats[record.date]) {
        dateWiseStats[record.date] = { total: 0, records: [] };
      }
      dateWiseStats[record.date].total++;
      dateWiseStats[record.date].records.push(record);
    });

    return res.status(200).json({
      success: true,
      totalRecords: records.length,
      dateWiseStats,
      records
    });
  }

  const todayCount = await Attendance.countDocuments({ date: todayDate });

  const totalStudents = await Admission.countDocuments({ status: 'Approved' });

  const recentRecords = await Attendance.find({ date: todayDate })
    .populate('student', 'fullName studentId courseName batchName')
    .sort({ scannedAt: -1 })
    .limit(10);

  res.status(200).json({
    success: true,
    todayCount,
    totalStudents,
    attendanceRate: totalStudents > 0 ? Math.round((todayCount / totalStudents) * 100) : 0,
    recentRecords
  });
});

export const deleteAttendance = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const record = await Attendance.findById(id);
  if (!record) {
    throw new ApiError(404, 'Attendance record not found');
  }

  await Attendance.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Attendance record deleted'
  });
});

export const getAttendanceReport = asyncHandler(async (req, res) => {
  const { date, course, search } = req.query;
  const reportDate = date || new Date().toISOString().split('T')[0];

  const todayDate = new Date().toISOString().split('T')[0];
  const isFutureDate = reportDate > todayDate;
  const isQueryingToday = (reportDate === todayDate);

  if (isFutureDate) {
    return res.status(200).json({
      success: true,
      date: reportDate,
      data: [],
      metrics: { total: 0, present: 0, absent: 0, late: 0 }
    });
  }

  const matchQuery = { status: 'Approved' };
  if (course) matchQuery['selectedCourse'] = course;

  const allStudents = await Admission.find(matchQuery)
    .populate('selectedCourse', 'title')
    .populate('student', 'name email')
    .sort({ studentId: 1 });

  const attendanceFilter = { date: reportDate };
  if (course) {
    const Course = (await import('../models/Course.js')).default;
    const courseDoc = await Course.findById(course).select('title');
    if (courseDoc) attendanceFilter.courseName = courseDoc.title;
  }
  const attendanceRecords = await Attendance.find(attendanceFilter)
    .populate('scannedBy', 'name');

  const attendanceMap = {};
  attendanceRecords.forEach(record => {
    attendanceMap[record.studentId] = record;
  });

  let presentCount = 0;
  let lateCount = 0;
  let absentCount = 0;
  let reportData = [];

  if (isQueryingToday) {
    allStudents.forEach(student => {
      const record = attendanceMap[student.studentId];
      if (record) {
        const status = record.status || 'Present';
        if (status === 'Present') presentCount++;
        if (status === 'Late') lateCount++;

        reportData.push({
          studentId: student.studentId || 'N/A',
          studentName: student.fullName,
          phoneNumber: student.phone,
          courseName: student.selectedCourse?.title || 'General',
          batchName: student.batchName || 'N/A',
          status: status,
          scannedAt: record.scannedAt,
          scannedBy: record.scannedBy?.name || null,
        });
      }
    });
  } else {
    reportData = allStudents.map(student => {
      const record = attendanceMap[student.studentId];
      let currentStatus = 'Absent';
      let scanTime = null;
      let scannedByName = null;

      if (record) {
        currentStatus = record.status || 'Present';
        scanTime = record.scannedAt;
        scannedByName = record.scannedBy?.name || null;
        if (currentStatus === 'Present') presentCount++;
        if (currentStatus === 'Late') lateCount++;
      } else {
        absentCount++;
      }

      return {
        studentId: student.studentId || 'N/A',
        studentName: student.fullName,
        phoneNumber: student.phone,
        courseName: student.selectedCourse?.title || 'General',
        batchName: student.batchName || 'N/A',
        status: currentStatus,
        scannedAt: scanTime,
        scannedBy: scannedByName,
      };
    });
  }

  reportData.sort((a, b) => {
    if (a.status === 'Present' && b.status !== 'Present') return -1;
    if (a.status !== 'Present' && b.status === 'Present') return 1;
    return 0;
  });

  const filteredData = search
    ? reportData.filter(r =>
        r.studentName.toLowerCase().includes(search.toLowerCase()) ||
        r.studentId.toLowerCase().includes(search.toLowerCase())
      )
    : reportData;

  res.status(200).json({
    success: true,
    date: reportDate,
    data: filteredData,
    metrics: {
      total: allStudents.length,
      present: presentCount,
      late: lateCount,
      absent: absentCount
    }
  });
});

export const getStudentOwnAttendance = asyncHandler(async (req, res) => {
  const studentProfile = await Admission.findOne({ 
    student: req.user._id, 
    status: 'Approved' 
  }).populate('selectedCourse', 'title');

  if (!studentProfile) {
    throw new ApiError(404, "Student profile not found or admission not approved");
  }

  const courseName = studentProfile.selectedCourse?.title || 'General';
  const batchName = studentProfile.batchName || 'N/A';

  const totalClassDays = await Attendance.distinct('date', { courseName });
  const totalDaysCount = totalClassDays.length;

  const logs = await Attendance.find({ 
    studentId: studentProfile.studentId,
    courseName: courseName
  }).sort({ scannedAt: -1 });

  const present = logs.filter(l => l.status === 'Present').length;
  const late = logs.filter(l => l.status === 'Late').length;
  const absent = totalDaysCount - (present + late);

  res.status(200).json({
    success: true,
    courseName,
    batchName,
    studentId: studentProfile.studentId,
    metrics: { 
      total: totalDaysCount, 
      present, 
      late, 
      absent: absent > 0 ? absent : 0 
    },
    data: logs.map(l => ({
      _id: l._id,
      date: l.date,
      status: l.status,
      courseName: l.courseName,
      batchName: l.batchName,
      time: new Date(l.scannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }))
  });
});
