import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResumeEditor from '../pages/ResumeEditor';
import ResumePreview from '../pages/ResumePreview';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ResumeEditor />} />
        <Route path="/preview" element={<ResumePreview />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;