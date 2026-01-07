const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload.middleware');
const { authenticate } = require('../middleware/auth');

// Upload single file
router.post('/', authenticate, (req, res) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ error: `Upload error: ${err.message}` });
            } else if (err) {
                return res.status(400).json({ error: err.message });
            }
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Construct URL for the uploaded file
        // Assuming 'public' folder is served at root
        const fileUrl = `/uploads/properties/${req.file.filename}`;

        res.json({
            success: true,
            url: fileUrl,
            filename: req.file.filename
        });
    });
});

module.exports = router;
