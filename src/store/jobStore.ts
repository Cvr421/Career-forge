import { create } from 'zustand';
import { JobState, Job } from '@/types';

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Mock data store
let mockJobs: Job[] = [
  {
    id: '1',
    slug: 'senior-frontend-developer',
    companyId: '1',
    title: 'Senior Frontend Developer',
    description: 'We are looking for an experienced Frontend Developer to join our team. You will be working on cutting-edge web applications using React, TypeScript, and modern CSS frameworks.\n\nResponsibilities:\n• Build and maintain web applications\n• Collaborate with designers and backend developers\n• Write clean, maintainable code\n• Mentor junior developers\n\nRequirements:\n• 5+ years of experience with React\n• Strong TypeScript skills\n• Experience with state management\n• Excellent communication skills',
    location: 'San Francisco, CA',
    jobType: 'full-time',
    status: 'open',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    slug: 'product-designer',
    companyId: '1',
    title: 'Product Designer',
    description: 'Join our design team to create beautiful and intuitive user experiences.\n\nResponsibilities:\n• Design user interfaces for web and mobile\n• Conduct user research\n• Create prototypes and design systems\n• Collaborate with engineering teams\n\nRequirements:\n• 3+ years of product design experience\n• Proficiency in Figma\n• Strong portfolio\n• UX research experience',
    location: 'Remote',
    jobType: 'full-time',
    status: 'open',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    slug: 'engineering-intern',
    companyId: '1',
    title: 'Engineering Intern',
    description: 'Summer internship opportunity for aspiring software engineers.\n\nWhat you will learn:\n• Modern web development practices\n• Agile methodologies\n• Code review processes\n• Team collaboration\n\nRequirements:\n• Currently pursuing CS degree\n• Basic programming knowledge\n• Eagerness to learn\n• Available for 3 months',
    location: 'New York, NY',
    jobType: 'internship',
    status: 'open',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    slug: 'backend-developer',
    companyId: '2',
    title: 'Backend Developer',
    description: 'Build scalable APIs and services.\n\nResponsibilities:\n• Design and implement APIs\n• Optimize database performance\n• Write unit and integration tests\n\nRequirements:\n• Experience with Node.js or Python\n• Database expertise\n• API design skills',
    location: 'Austin, TX',
    jobType: 'full-time',
    status: 'open',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useJobStore = create<JobState>((set) => ({
  jobs: [],
  currentJob: null,
  isLoading: false,

  fetchJobs: async (companyId: string) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 300));
    const jobs = mockJobs.filter((j) => j.companyId === companyId);
    set({ jobs, isLoading: false });
  },

  fetchJob: async (companySlug: string, jobSlug: string) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 300));
    // In real app, would fetch by company slug first
    const job = mockJobs.find((j) => j.slug === jobSlug) || null;
    set({ currentJob: job, isLoading: false });
  },

  createJob: async (companyId: string, data: Partial<Job>) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newJob: Job = {
      id: Date.now().toString(),
      slug: generateSlug(data.title || 'new-job'),
      companyId,
      title: data.title || 'New Position',
      description: data.description || '',
      location: data.location || 'Remote',
      jobType: data.jobType || 'full-time',
      status: data.status || 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockJobs = [...mockJobs, newJob];
    const jobs = mockJobs.filter((j) => j.companyId === companyId);
    set({ jobs, isLoading: false });
    return newJob;
  },

  updateJob: async (id: string, data: Partial<Job>) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 300));

    mockJobs = mockJobs.map((j) =>
      j.id === id ? { ...j, ...data, updatedAt: new Date().toISOString() } : j
    );

    const updated = mockJobs.find((j) => j.id === id);
    if (updated) {
      const jobs = mockJobs.filter((j) => j.companyId === updated.companyId);
      set({ jobs, currentJob: updated, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  deleteJob: async (id: string) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 300));

    const job = mockJobs.find((j) => j.id === id);
    mockJobs = mockJobs.filter((j) => j.id !== id);

    if (job) {
      const jobs = mockJobs.filter((j) => j.companyId === job.companyId);
      set({ jobs, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },
}));
