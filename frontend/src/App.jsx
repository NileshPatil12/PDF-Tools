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
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;