const express = require('express');
const Company = require('../models/Company');
// Ensure this path is correct
const Application = require('../models/Application');


const router = express.Router();

// POST route to add a new company
router.post('/add', async (req, res) => {
  try {
    const { name, role, ctc, eligibility, testDate, interviewDate, notes } = req.body;

    const newCompany = new Company({
      name,
      role,
      ctc,
      eligibility,
      testDate,
      interviewDate,
      notes
    });

    const savedCompany = await newCompany.save();
    res.status(201).json(savedCompany);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding company' });
  }
});

// GET route to fetch all companies
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching companies' });
  }
});

// DELETE route to delete a company by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedCompany = await Company.findByIdAndDelete(req.params.id);
    if (!deletedCompany) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting company' });
  }
});

// PUT route to update a company by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCompany) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.status(200).json(updatedCompany);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating company' });
  }
});

router.get('/finalized-report', async (req, res) => {
  try {
    const finalizedCompanies = await Company.find({ finalized: true });
    const report = [];

    for (const company of finalizedCompanies) {
      // ✅ Check for 'Approved' (case-sensitive)
      const placedApplications = await Application.find({
        companyId: company._id,
        status: 'Approved'
      });

      report.push({
        name: company.name,
        ctc: company.ctc,
        eligibleBranches: company.eligibility.allowedBranches,
        eligibleYears: [company.eligibility.year],
        numStudentsPlaced: placedApplications.length,
        // Debugging info:
        totalApplications: await Application.countDocuments({ companyId: company._id }),
        applicationStatuses: await Application.distinct('status', { companyId: company._id })
      });
    }

    res.status(200).json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Error generating report',
      error: error.message 
    });
  }
});


module.exports = router;
