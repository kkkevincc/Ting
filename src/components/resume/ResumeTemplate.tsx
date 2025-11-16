import React from 'react';
import { ResumeData } from '../../types/resume';

interface ResumeTemplateProps {
  data: ResumeData;
  className?: string;
}

const ResumeTemplate: React.FC<ResumeTemplateProps> = ({ data, className = '' }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`;
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = formatDate(startDate);
    const end = formatDate(endDate) || '至今';
    return `${start} - ${end}`;
  };

  return (
    <div className={`bg-white text-black p-8 ${className}`}>
      {/* Header */}
      <div className="relative mb-8">
        {/* UCL Logo Placeholder */}
        <div className="absolute top-0 left-0 text-gray-400 text-4xl font-bold">
          UCL
        </div>
        
        {/* Name and Contact */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold mb-2">{data.name || '姓名'}</h1>
          <div className="text-base">
            {data.phone && <span>{data.phone}</span>}
            {data.phone && data.email && <span className="mx-2">|</span>}
            {data.email && <span>{data.email}</span>}
          </div>
        </div>
      </div>

      {/* Education Section */}
      {data.educations.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 border-b border-black pb-1">教育经历</h2>
          {data.educations.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-semibold">
                    {edu.school} · {edu.major} · {edu.degree}
                  </div>
                </div>
                <div className="text-sm ml-4">
                  {formatDateRange(edu.startDate, edu.endDate)}
                </div>
              </div>
              {edu.description && (
                <div className="text-sm mt-2 text-gray-700">
                  主修课程：{edu.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Experience Section */}
      {data.experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 border-b border-black pb-1">实习经历</h2>
          {data.experiences.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-semibold">{exp.company}</div>
                  <div className="text-sm text-gray-700">{exp.position}</div>
                </div>
                <div className="text-sm ml-4">
                  {formatDateRange(exp.startDate, exp.endDate)}
                </div>
              </div>
              {exp.description && (
                <div className="text-sm mt-2">
                  {exp.description.split('\n').map((line, i) => (
                    line.trim() && (
                      <div key={i} className="mb-1 flex">
                        <span className="mr-2">•</span>
                        <span>{line.trim()}</span>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills Section */}
      {data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 border-b border-black pb-1">个人技能</h2>
          <div className="text-sm">
            {data.skills.map((skill, index) => (
              <span key={index}>
                {skill.category}：{skill.skillName}
                {index < data.skills.length - 1 && '；'}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeTemplate;