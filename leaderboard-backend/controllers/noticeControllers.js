const Notice = require('../models/Notice');

const createNotice = async (req, res) => {
    try {
        const { content } = req.body;
        const newNotice = new Notice({ content });
        await newNotice.save();
        res.status(201).send('Notice created successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating notice');
    }
};

const getNotices = async (req, res) => {
    try {
        const notices = await Notice.find().sort({ createdAt: -1 }); // Latest first
        res.status(200).json(notices);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching notice');
    }
};

module.exports = { createNotice, getNotices };