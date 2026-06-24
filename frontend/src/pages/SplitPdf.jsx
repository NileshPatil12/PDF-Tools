import React, { useState, useEffect } from 'react';
import ToolLayout from '../layouts/ToolLayout';
import { splitPdf, getPdfErrorMessage, downloadBlob } from '../api/pdf';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import ToolIcon from '../components/icons/ToolIcons';

const SplitPdf = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [splitBlob, setSplitBlob] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (!splitBlob) {
            setPreviewUrl(null);
            return;
        }
        const url = URL.createObjectURL(splitBlob);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [splitBlob]);

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        setError('');
        setSplitBlob(null);

        try {
            const blob = await splitPdf(file);
            setSplitBlob(blob);
        } catch (err) {
            setError(await getPdfErrorMessage(err, 'Failed to split PDF'));
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected && selected.type === 'application/pdf') {
            setFile(selected);
            setSplitBlob(null);
            setError('');
        } else {
            setError('Please select a valid PDF file.');
        }
    };

    const handleDownload = () => {
        if (splitBlob) {
            downloadBlob(splitBlob, `split-${file.name}`);
        }
    };

    return (
        <ToolLayout toolId="split">
            <GlassCard className="p-8">
                <div className="flex flex-col items-center gap-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-500/20 text-indigo-400">
                        <ToolIcon name="scissors" className="h-10 w-10" />
                    </div>
                    
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white">Extract PDF Pages</h2>
                        <p className="mt-2 text-zinc-400">Upload a PDF to extract individual pages.</p>
                    </div>

                    <input 
                        type="file" 
                        id="split-upload"
                        className="hidden"
                        accept="application/pdf" 
                        onChange={handleFileChange} 
                        disabled={loading}
                    />
                    
                    <label 
                        htmlFor="split-upload"
                        className="w-full cursor-pointer rounded-xl border-2 border-dashed border-white/10 bg-white/5 px-6 py-10 text-center transition-colors hover:bg-white/10"
                    >
                        <span className="text-sm font-medium text-zinc-300">
                            {file ? file.name : 'Click to select a PDF file'}
                        </span>
                    </label>

                    {error && (
                        <div className="w-full rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                            {error}
                        </div>
                    )}

                    <Button onClick={handleUpload} disabled={!file || loading} size="lg">
                        {loading ? <><Spinner /> Splitting...</> : 'Split PDF'}
                    </Button>
                </div>
            </GlassCard>

            {splitBlob && previewUrl && (
                <div style={{ marginTop: '20px' }}>
                    <div className="mb-4 flex justify-end">
                        <Button variant="secondary" onClick={handleDownload}>
                            Download Result
                        </Button>
                    </div>
                    <GlassCard hover={false} className="overflow-hidden p-1">
                        <iframe 
                            src={previewUrl} 
                            className="aspect-4/3 w-full min-h-96 border-0"
                            title="PDF Preview"
                        />
                    </GlassCard>
                </div>
            )}
        </ToolLayout>
    );
};

export default SplitPdf;