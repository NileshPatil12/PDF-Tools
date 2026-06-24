const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');
const docxToPdf = require('docx-pdf');

const cleanup = async (files) => {
    for (const file of files) {
        try {
            if (file) await fs.unlink(file);
        } catch (e) { /* file already gone */ }
    }
};

exports.mergePDFs = async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length < 2) return res.status(400).json({ message: 'Upload at least 2 files' });

        console.log(`Processing Merge: ${files.length} files`);
        const mergedPdf = await PDFDocument.create();
        for (const file of files) {
            const pdfBytes = await fs.readFile(file.path);
            const pdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const pdfBytes = await mergedPdf.save();
        res.contentType("application/pdf");
        res.send(Buffer.from(pdfBytes));

        await cleanup(files.map(f => f.path));
    } catch (err) {
        console.error('Merge Operation Failed:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.splitPDF = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        console.log(`Processing Split: ${req.file.originalname}`);
        const pdfBytes = await fs.readFile(req.file.path);
        const pdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
        const pageCount = pdf.getPageCount();

        if (pageCount === 0) return res.status(400).json({ message: 'PDF contains no pages' });
        
        // Simple split: Extract first page for demonstration
        const newPdf = await PDFDocument.create();
        const [firstPage] = await newPdf.copyPages(pdf, [0]);
        newPdf.addPage(firstPage);
        
        const outBytes = await newPdf.save();
        res.contentType("application/pdf");
        res.send(Buffer.from(outBytes));

        await cleanup([req.file.path]);
    } catch (err) {
        console.error('Split Operation Failed:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.imagesToPdf = async (req, res) => {
    try {
        const pdfDoc = await PDFDocument.create();
        console.log(`Processing ImageToPdf: ${req.files.length} images`);
        for (const file of req.files) {
            const imgBytes = await fs.readFile(file.path);
            let image;
            if (file.mimetype === 'image/png') image = await pdfDoc.embedPng(imgBytes);
            else image = await pdfDoc.embedJpg(imgBytes);

            const page = pdfDoc.addPage([image.width, image.height]);
            page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
        }
        const pdfBytes = await pdfDoc.save();
        res.contentType("application/pdf");
        res.send(Buffer.from(pdfBytes));

        await cleanup(req.files.map(f => f.path));
    } catch (err) {
        console.error('Image Conversion Failed:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.wordToPdf = (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    
    console.log(`Processing WordToPdf: ${req.file.originalname}`);
    const outputName = `word-to-pdf-${Date.now()}.pdf`;
    const outputPath = path.join(__dirname, '..', 'generated', outputName);

    docxToPdf(req.file.path, outputPath, async (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        
        // Read the generated file and send it as a blob to match the frontend api utility
        fs.readFile(outputPath).then(async (pdfBytes) => {
            res.contentType("application/pdf");
            res.send(Buffer.from(pdfBytes));
            await cleanup([req.file.path, outputPath]);
        });
    });
};