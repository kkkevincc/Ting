import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useResumeStore } from '../../stores/resumeStore';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface EducationFormData {
  school: string;
  major: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
}

const EducationForm: React.FC = () => {
  const { resume, addEducation, updateEducation, removeEducation } = useResumeStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<EducationFormData>();

  const onSubmit = (data: EducationFormData) => {
    if (editingId) {
      updateEducation(editingId, data);
      setEditingId(null);
    } else {
      addEducation(data);
    }
    reset();
    setShowForm(false);
  };

  const handleEdit = (education: any) => {
    setEditingId(education.id);
    setShowForm(true);
    Object.keys(education).forEach(key => {
      setValue(key as keyof EducationFormData, education[key]);
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
        <h3 className="text-lg font-semibold">教育背景</h3>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          添加
        </button>
      </div>

      {/* Education List */}
      <div className="space-y-3 mb-4">
        {resume.educations.map((education) => (
          <div key={education.id} className="p-3 border border-gray-200 rounded-md">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">
                  {education.school} · {education.major} · {education.degree}
                </div>
                <div className="text-sm text-gray-600">
                  {education.startDate} - {education.endDate}
                </div>
                {education.description && (
                  <div className="text-sm text-gray-700 mt-1">
                    主修课程：{education.description}
                  </div>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(education)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeEducation(education.id!)}
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
                学校名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('school', { required: '请输入学校名称' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例如：清华大学"
              />
              {errors.school && (
                <p className="text-red-500 text-sm mt-1">{errors.school.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                专业 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('major', { required: '请输入专业' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例如：计算机科学"
              />
              {errors.major && (
                <p className="text-red-500 text-sm mt-1">{errors.major.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                学历 <span className="text-red-500">*</span>
              </label>
              <select
                {...register('degree', { required: '请选择学历' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">请选择学历</option>
                <option value="本科">本科</option>
                <option value="硕士">硕士</option>
                <option value="博士">博士</option>
                <option value="专科">专科</option>
              </select>
              {errors.degree && (
                <p className="text-red-500 text-sm mt-1">{errors.degree.message}</p>
              )}
            </div>

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
          </div>

          <div className="grid grid-cols-2 gap-4">
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

            <div></div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              主修课程
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入主修课程，用顿号分隔"
            />
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

export default EducationForm;