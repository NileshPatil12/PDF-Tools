const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const pdfRoutes = require('./routes/pdfRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure directories exist
const dirs = [path.join(__dirname, 'uploads'), path.join(__dirname, 'generated')];
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

app.use(cors());
app.use(express.json());

// Serve generated files for download
app.use('/generated', express.static(path.join(__dirname, 'generated')));

// Route Mounting
app.use('/api/pdf', pdfRoutes);

app.get('/', (req, res) => {
    res.send('PDF Tools Backend is running...');
});

const server = app.listen(PORT, () => {
    console.log(`>>> PDF Tools Backend restored on http://localhost:${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Error: Port ${PORT} is already in use. Try changing the PORT in server.js.`);
    } else {
        console.error('Server error:', err);
    }
});

process.on('uncaughtException', (err) => {
    console.error('There was an uncaught error', err);
    process.exit(1);
});