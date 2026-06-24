const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const pdfController = require('../controllers/pdfController');

// RESTORED ROUTES
router.post('/merge', upload.array('files', 10), pdfController.mergePDFs);
router.post('/split', upload.single('files'), pdfController.splitPDF);
router.post('/image-to-pdf', upload.array('files', 10), pdfController.imagesToPdf);
router.post('/word-to-pdf', upload.single('files'), pdfController.wordToPdf);

module.exports = router;