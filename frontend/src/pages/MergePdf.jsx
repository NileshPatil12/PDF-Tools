import React, { useState } from 'react';
import API from '../api/axios';

const MergePdf = () => {
    const [files, setFiles] = useState([]);
    const [downloadLink, setDownloadLink] = useState('');

    const handleUpload = async () => {
        const formData = new FormData();
        Array.from(files).forEach(file => formData.append('files', file));

        try {
            const res = await API.post('/merge', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setDownloadLink(`http://localhost:5000${res.data.downloadUrl}`);
        } catch (err) {
            alert('Merge failed: ' + err.message);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Merge PDF</h1>
            <input 
                type="file" 
                multiple 
                accept="application/pdf" 
                onChange={(e) => setFiles(e.target.files)} 
            />
            <button onClick={handleUpload} disabled={files.length < 2}>
                Merge Files
            </button>

            {downloadLink && (
                <div style={{ marginTop: '20px' }}>
                    <a href={downloadLink} download target="_blank" rel="noreferrer">
                        Download Merged PDF
                    </a>
                </div>
            )}
        </div>
    );
};

export default MergePdf;