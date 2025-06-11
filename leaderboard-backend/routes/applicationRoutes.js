const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Student = require('../models/User');
const Company = require('../models/Company');

// POST route to apply
router.post('/apply', async (req, res) => {
  try {
    const { studentId, companyId } = req.body;

    const student = await Student.findById(studentId);
    const company = await Company.findById(companyId);

    if (!student || !company) return res.status(404).json({ message: 'Student or Company not found' });

    if (company.finalized) return res.status(400).json({ message: 'Applications closed for this company' });

    const existingApplication = await Application.findOne({ studentId, companyId });
    if (existingApplication) return res.status(409).json({ message: 'Application already exists' });

    if (student.cgpa < company.eligibility.minCgpa) {
      return res.status(403).json({ message: 'CGPA not sufficient' });
    }

    if (!company.eligibility.allowedBranches.some(
      branch => branch.trim().toLowerCase() === student.branch.trim().toLowerCase()
    )) {
      return res.status(403).json({ message: 'Branch not eligible' });
    }

    if (student.placed) {
      return res.status(403).json({ message: 'Already placed' });
    }

    if (student.year !== company.eligibility.year) {
      return res.status(403).json({ message: 'Year not eligible' });
    }

    const application = await Application.create({ studentId, companyId });
    res.status(201).json(application);

  } catch (error) {
    console.error('Application error:', error);
    res.status(500).json({ message: 'Server error during application' });
  }
});

// GET all active companies
router.get('/companies/active', async (req, res) => {
  try {
    const companies = await Company.find({ finalized: false });
    res.json(companies);
  } catch (error) {
    console.error('Error fetching active companies:', error);
    res.status(500).json({ message: 'Failed to fetch companies' });
  }
});

// GET applications for a specific company
router.get('/admin/:companyId/applications', async (req, res) => {
  try {
    const { companyId } = req.params;
    const applications = await Application.find({ companyId })
      .populate('studentId')
      .populate('companyId');
    res.json(applications);
  } catch (error) {
    console.error('Error fetching company applications:', error);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
});

// PATCH to approve a student for a company


// PATCH to reject a student
// PATCH to approve a student for a company
// PATCH to approve a student for a company
router.patch('/admin/approve/:applicationId', async (req, res) => {
  try {
    const { applicationId } = req.params;

    // Find the application and populate student details
    const application = await Application.findById(applicationId).populate('studentId');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    // Check if student is already placed
    if (application.studentId.placed) {
      return res.status(400).json({ message: 'Student is already placed in another company' });
    }

    // Approve the application
    application.status = 'Approved';
    await application.save();

    // Mark the student as placed
    await Student.findByIdAndUpdate(application.studentId._id, { placed: true });

    res.json({
      message: 'Student approved and marked as placed',
      application
    });
  } catch (error) {
    console.error('Error approving student:', error);
    res.status(500).json({ message: 'Failed to approve student' });
  }
});


// Finalize selection for a company
router.post('/admin/finalize/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params;

    // Reject all still-applied applications
    const result = await Application.updateMany(
      { companyId, status: 'Applied' },
      { $set: { status: 'Rejected' } }
    );

    // Mark company as finalized
    await Company.findByIdAndUpdate(companyId, { finalized: true });

    res.json({
      message: 'Company finalized successfully',
      rejectedApplications: result.modifiedCount
    });
  } catch (error) {
    console.error('Error finalizing company:', error);
    res.status(500).json({ message: 'Finalization failed' });
  }
});

router.patch('/admin/reject/:applicationId', async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId).populate('studentId').populate('companyId');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    // Reject the application
    application.status = 'Rejected';
    await application.save();

    

    res.json({
      message: 'Application rejected',
      application
    });
  } catch (error) {
    console.error('Error rejecting application:', error);
    res.status(500).json({ message: 'Failed to reject application' });
  }
});

// ✅ Student Application History Route
router.get('/student/:studentId/history', async (req, res) => {
  try {
    const { studentId } = req.params;
    const applications = await Application.find({ studentId })
      .populate('companyId') // Company ka detail laane ke liye
      .sort({ createdAt: -1 }); // Latest applications pehle dikhaye

    res.json(applications);
  } catch (error) {
    console.error('Error fetching student history:', error);
    res.status(500).json({ message: 'Failed to fetch history' });
  }
});


module.exports = router;
 //why this isnt marking student placed as true once its aprovved.