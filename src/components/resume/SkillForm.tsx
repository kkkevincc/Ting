import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useResumeStore } from '../../stores/resumeStore';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface SkillFormData {
  category: string;
  skillName: string;
}

const SkillForm: React.FC = () => {
  const { resume, addSkill, updateSkill, removeSkill } = useResumeStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<SkillFormData>();

  const onSubmit = (data: SkillFormData) => {
    if (editingId) {
      updateSkill(editingId, data);
      setEditingId(null);
    } else {
      addSkill(data);
    }
    reset();
    setShowForm(false);
  };

  const handleEdit = (skill: any) => {
    setEditingId(skill.id);
    setShowForm(true);
    Object.keys(skill).forEach(key => {
      setValue(key as keyof SkillFormData, skill[key]);
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
        <h3 className="text-lg font-semibold">个人技能</h3>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          添加
        </button>
      </div>

      {/* Skills List */}
      <div className="space-y-3 mb-4">
        {resume.skills.map((skill) => (
          <div key={skill.id} className="p-3 border border-gray-200 rounded-md">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">{skill.category}</span>
                <span className="mx-2">：</span>
                <span>{skill.skillName}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(skill)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeSkill(skill.id!)}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              技能类别 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('category', { required: '请输入技能类别' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例如：编程语言、软件工具、语言能力"
            />
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              具体技能 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('skillName', { required: '请输入具体技能' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例如：JavaScript、Excel、英语"
            />
            {errors.skillName && (
              <p className="text-red-500 text-sm mt-1">{errors.skillName.message}</p>
            )}
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

export default SkillForm;