import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeStore } from '../stores/resumeStore';
import BasicInfoForm from '../components/resume/BasicInfoForm';
import EducationForm from '../components/resume/EducationForm';
import ExperienceForm from '../components/resume/ExperienceForm';
import SkillForm from '../components/resume/SkillForm';
import ResumeTemplate from '../components/resume/ResumeTemplate';
import MobilePreview from '../components/resume/MobilePreview';
import { Eye, Download } from 'lucide-react';

const ResumeEditor: React.FC = () => {
  const { resume } = useResumeStore();
  const navigate = useNavigate();

  const handlePreview = () => {
    navigate('/preview');
  };

  const handleGeneratePDF = () => {
    // This will be implemented when we add PDF functionality
    handlePreview();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">简历编辑器</h1>
          <p className="text-gray-600">填写您的信息，实时预览简历效果</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Forms */}
          <div className="space-y-6 order-2 lg:order-1">
            <BasicInfoForm />
            <EducationForm />
            <ExperienceForm />
            <SkillForm />
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6 order-1 lg:order-2">
            <div className="lg:sticky lg:top-8">
              <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
                <h3 className="text-lg font-semibold mb-3">实时预览</h3>
                <div className="text-sm text-gray-600 mb-4">
                  您的简历将实时显示在这里，请确保信息准确完整
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={handlePreview}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    预览完整简历
                  </button>
                  <button
                    onClick={handleGeneratePDF}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    生成PDF
                  </button>
                </div>
              </div>

              {/* Preview Area */}
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden hidden lg:block">
                <div className="bg-gray-50 px-4 py-2 border-b">
                  <h4 className="text-sm font-medium text-gray-700">简历预览</h4>
                </div>
                <div className="p-4">
                  <div className="transform scale-75 origin-top-left" style={{ width: '133.33%' }}>
                    <ResumeTemplate data={resume} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Preview */}
        <div className="mt-8 lg:hidden">
          <MobilePreview />
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;