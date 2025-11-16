import React from 'react';
import { useForm } from 'react-hook-form';
import { useResumeStore } from '../../stores/resumeStore';

interface BasicInfoFormData {
  name: string;
  email: string;
  phone: string;
  position: string;
}

const BasicInfoForm: React.FC = () => {
  const { resume, updateBasicInfo } = useResumeStore();
  const { register, handleSubmit, formState: { errors } } = useForm<BasicInfoFormData>({
    defaultValues: {
      name: resume.name,
      email: resume.email,
      phone: resume.phone,
      position: resume.position || '',
    }
  });

  const onSubmit = (data: BasicInfoFormData) => {
    updateBasicInfo(data);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">基本信息</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            姓名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('name', { required: '请输入姓名' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入您的姓名"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            邮箱 <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            {...register('email', { 
              required: '请输入邮箱',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: '请输入有效的邮箱地址'
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入您的邮箱"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            电话 <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            {...register('phone', { required: '请输入电话号码' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入您的电话号码"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            求职意向
          </label>
          <input
            type="text"
            {...register('position')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="例如：软件工程师、产品经理等"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          更新基本信息
        </button>
      </form>
    </div>
  );
};

export default BasicInfoForm;