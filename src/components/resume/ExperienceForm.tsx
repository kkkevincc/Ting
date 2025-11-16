import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useResumeStore } from '../../stores/resumeStore';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface ExperienceFormData {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

const ExperienceForm: React.FC = () => {
  const { resume, addExperience, updateExperience, removeExperience } = useResumeStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<ExperienceFormData>();

  const onSubmit = (data: ExperienceFormData) => {
    if (editingId) {
      updateExperience(editingId, data);
      setEditingId(null);
    } else {
      addExperience(data);
    }
    reset();
    setShowForm(false);
  };

  const handleEdit = (experience: any) => {
    setEditingId(experience.id);
    setShowForm(true);
    Object.keys(experience).forEach(key => {
      setValue(key as keyof ExperienceFormData, experience[key]);
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    reset();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">实习经历</h3>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          添加
        </button>
      </div>

      {/* Experience List */}
      <div className="space-y-3 mb-4">
        {resume.experiences.map((experience) => (
          <div key={experience.id} className="p-3 border border-gray-200 rounded-md">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{experience.company}</div>
                <div className="text-sm text-gray-600">{experience.position}</div>
                <div className="text-sm text-gray-500">
                  {experience.startDate} - {experience.endDate}
                </div>
                {experience.description && (
                  <div className="text-sm text-gray-700 mt-2">
                    {experience.description.split('\n').map((line, i) => (
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
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(experience)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeExperience(experience.id!)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 bg-gray-50 rounded-md">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                公司名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('company', { required: '请输入公司名称' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例如：腾讯科技有限公司"
              />
              {errors.company && (
                <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                职位 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('position', { required: '请输入职位' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例如：软件工程师"
              />
              {errors.position && (
                <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                开始时间 <span className="text-red-500">*</span>
              </label>
              <input
                type="month"
                {...register('startDate', { required: '请选择开始时间' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                结束时间
              </label>
              <input
                type="month"
                {...register('endDate')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              工作描述
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请描述您的工作内容和成就，每行一个要点"
            />
            <p className="text-sm text-gray-500 mt-1">
              每行输入一个工作要点，会显示为项目符号
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              {editingId ? '更新' : '添加'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
            >
              取消
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ExperienceForm;