import React, { useState } from 'react';
import API from '../api/axios';

const ImageToPdf = () => {
    const [files, setFiles] = useState([]);
    const [downloadLink, setDownloadLink] = useState('');

    const handleUpload = async () => {
        const formData = new FormData();
        Array.from(files).forEach(file => formData.append('images', file));

        try {
            const res = await API.post('/image-to-pdf', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setDownloadLink(`http://localhost:5000${res.data.downloadUrl}`);
        } catch (err) {
            alert('Conversion failed: ' + err.message);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Images to PDF</h1>
            <input type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)} />
            <button onClick={handleUpload} disabled={files.length === 0}>Convert to PDF</button>

            {downloadLink && (
                <div style={{ marginTop: '20px' }}>
                    <a href={downloadLink} download target="_blank" rel="noreferrer">
                        Download PDF
                    </a>
                </div>
            )}
        </div>
    );
};

export default ImageToPdf;