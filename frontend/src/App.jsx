import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import { ROUTES } from './constants/routes';
import MergePdf from './pages/MergePdfPage';
import SplitPdf from './pages/SplitPdf';
import ImageToPdf from './pages/ImageToPdfPage';
import WordToPdf from './pages/WordToPdf';
import HomePage from './pages/HomePage';
import Footer from './components/layout/Footer';
import ImageCompressor from './pages/ImageCompressor'
import ResizeImage from './pages/ResizeImage'
import JpgToPng from './pages/JpgToPng'
import PngToJpg from './pages/PngToJpg' 
import PdfMetadataViewer from './pages/PdfMetadataViewer'
import ReorderPdf from './pages/ReorderPdf'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.MERGE_PDF} element={<MergePdf />} />
        <Route path={ROUTES.SPLIT_PDF} element={<SplitPdf />} />
        <Route path={ROUTES.IMAGE_TO_PDF} element={<ImageToPdf />} />
        <Route path={ROUTES.WORD_TO_PDF} element={<WordToPdf />} />
        <Route path={ROUTES.IMAGE_COMPRESSOR} element={<ImageCompressor />} />

        <Route path={ROUTES.RESIZE_IMAGE} element={<ResizeImage />} />
        <Route path={ROUTES.JPG_TO_PNG} element={<JpgToPng />} />
        <Route path={ROUTES.PNG_TO_JPG} element={<PngToJpg />} />

        <Route path={ROUTES.PDF_METADATA} element={<PdfMetadataViewer />} />
        <Route path={ROUTES.REORDER_PDF} element={<ReorderPdf />} />
        
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;