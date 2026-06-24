import React, { useState, useEffect } from 'react';
import ToolLayout from '../layouts/ToolLayout';
import { wordToPdf, getPdfErrorMessage, downloadBlob } from '../api/pdf';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import ToolIcon from '../components/icons/ToolIcons';

const WordToPdf = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [convertedBlob, setConvertedBlob] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (!convertedBlob) {
            setPreviewUrl(null);
            return;
        }
        const url = URL.createObjectURL(convertedBlob);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [convertedBlob]);

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        setError('');
        setConvertedBlob(null);

        try {
            const blob = await wordToPdf(file);
            setConvertedBlob(blob);
        } catch (err) {
            setError(await getPdfErrorMessage(err, 'Conversion failed'));
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected && (selected.name.endsWith('.doc') || selected.name.endsWith('.docx'))) {
            setFile(selected);
            setConvertedBlob(null);
            setError('');
        } else {
            setError('Please select a valid Word document (.doc or .docx)');
        }
    };

    const handleDownload = () => {
        if (convertedBlob) {
            downloadBlob(convertedBlob, 'converted.pdf');
        }
    };

    return (
        <ToolLayout toolId="word-to-pdf">
            <GlassCard className="p-8">
                <div className="flex flex-col items-center gap-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-500/20 text-blue-400">
                        <ToolIcon name="document" className="h-10 w-10" />
                    </div>
                    
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white">Select Word Document</h2>
                        <p className="mt-2 text-zinc-400">Upload a .docx or .doc file to convert it to PDF.</p>
                    </div>

                    <input 
                        type="file" 
                        id="word-upload"
                        className="hidden"
                        accept=".doc,.docx" 
                        onChange={handleFileChange} 
                        disabled={loading}
                    />
                    
                    <label 
                        htmlFor="word-upload"
                        className="cursor-pointer rounded-xl border-2 border-dashed border-white/10 bg-white/5 px-10 py-8 transition-colors hover:bg-white/10"
                    >
                        <span className="text-sm font-medium text-zinc-300">
                            {file ? file.name : 'Click to select a file'}
                        </span>
                    </label>

                    {error && (
                        <div className="w-full rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                            {error}
                        </div>
                    )}

                    <Button onClick={handleUpload} disabled={!file || loading} size="lg">
                        {loading ? <><Spinner /> Converting...</> : 'Convert to PDF'}
                    </Button>
                </div>
            </GlassCard>

            {convertedBlob && previewUrl && (
                <div style={{ marginTop: '20px' }}>
                    <div className="mb-4 flex justify-end">
                        <Button variant="secondary" onClick={handleDownload}>
                            Download PDF
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

export default WordToPdf;