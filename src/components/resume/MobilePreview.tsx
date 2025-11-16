import React from 'react';
import { useResumeStore } from '../../stores/resumeStore';
import ResumeTemplate from './ResumeTemplate';

const MobilePreview: React.FC = () => {
  const { resume } = useResumeStore();

  return (
    <div className="lg:hidden bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="bg-gray-50 px-4 py-2 border-b">
        <h4 className="text-sm font-medium text-gray-700">简历预览</h4>
      </div>
      <div className="p-4">
        <div className="transform scale-50 origin-top-left" style={{ width: '200%' }}>
          <ResumeTemplate data={resume} />
        </div>
      </div>
    </div>
  );
};

export default MobilePreview;