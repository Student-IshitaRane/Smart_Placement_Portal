

const Admin = require('../models/Admin');

// Registration controller
const registerAdmin = async (req, res) => {
    try {
        const { name, email, phone, department, password } = req.body;
        const newAdmin = new Admin({ name, email, phone, department, password });
        await newAdmin.save();
        res.status(201).send('Teacher Registered Successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering teacher');
    }
};

// Login handler
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Compare plain text passwords (for now)
        if (admin.password !== password) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // You can return a token here later if needed
        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Login failed" });
    }
};

module.exports = { registerAdmin, loginAdmin };