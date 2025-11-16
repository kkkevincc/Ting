import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeStore } from '../stores/resumeStore';
import ResumeTemplate from '../components/resume/ResumeTemplate';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import { generatePDF, generatePDFWithSmartLayout } from '../utils/pdfGenerator';

const ResumePreview: React.FC = () => {
  const { resume } = useResumeStore();
  const navigate = useNavigate();
  const resumeRef = useRef<HTMLDivElement>(null);

  const handleBack = () => {
    navigate('/');
  };

  const handleDownloadPDF = async () => {
    if (resumeRef.current) {
      await generatePDFWithSmartLayout(resumeRef.current, `${resume.name}_简历.pdf`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={handleBack}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回编辑
            </button>
            
            <div className="flex space-x-3">
              <button
                onClick={handlePrint}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <Printer className="w-4 h-4 mr-2" />
                打印
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                下载PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-8">
              <div ref={resumeRef} className="resume-preview">
                <ResumeTemplate data={resume} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .resume-preview {
            box-shadow: none;
            margin: 0;
            padding: 0;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          @page {
            size: A4;
            margin: 2cm 2cm 2cm 2cm;
          }
        }
      `}</style>
    </div>
  );
};

export default ResumePreview;