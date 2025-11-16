import { ResumeData } from '../types/resume';

export const sampleResume: ResumeData = {
  name: '张三',
  email: 'zhangsan@example.com',
  phone: '138-0000-0000',
  position: '软件工程师',
  educations: [
    {
      id: '1',
      school: '清华大学',
      major: '计算机科学与技术',
      degree: '本科',
      startDate: '2020-09-01',
      endDate: '2024-06-30',
      description: '数据结构、算法分析、软件工程、数据库系统、操作系统、计算机网络'
    }
  ],
  experiences: [
    {
      id: '1',
      company: '腾讯科技有限公司',
      position: '前端开发实习生',
      startDate: '2023-06-01',
      endDate: '2023-09-30',
      description: '参与微信小程序前端开发，使用React和TypeScript\n优化页面性能，提升用户体验\n与后端团队协作，完成API接口对接'
    }
  ],
  skills: [
    {
      id: '1',
      category: '编程语言',
      skillName: 'JavaScript、TypeScript、Python'
    },
    {
      id: '2',
      category: '前端技术',
      skillName: 'React、Vue.js、HTML/CSS'
    },
    {
      id: '3',
      category: '工具',
      skillName: 'Git、Webpack、VS Code'
    }
  ]
};