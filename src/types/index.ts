
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  instagram?: string;
  reddit?: string;
}

export interface Company {
  id: string;
  slug: string;
  name: string;
  logo?: string;
  banner?: string;
  primaryColor: string;
  accentColor: string;
  cultureVideoUrl?: string;
  socialLinks?: SocialLinks;
  sections: Section[];
  status: 'draft' | 'published';
  jobCount: number;
  recruiterId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Section {
  id: string;
  type: 'hero' | 'about' | 'culture' | 'perks' | 'custom';
  visible: boolean;
  order: number;
  data: {
    title: string;
    content: string;
  };
}

export interface Job {
  id: string;
  slug: string;
  companyId: string;
  title: string;
  description: string;
  location: string;
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship';
  status: 'open' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export interface CompanyState {
  companies: Company[];
  currentCompany: Company | null;
  isLoading: boolean;
  fetchCompanies: () => Promise<void>;
  fetchCompany: (slug: string) => Promise<void>;
  createCompany: (data: Partial<Company>) => Promise<Company>;
  updateCompany: (id: string, data: Partial<Company>) => Promise<void>;
  publishCompany: (id: string) => Promise<void>;
  unpublishCompany: (id: string) => Promise<void>;
  setCurrentCompany: (company: Company | null) => void;
}

export interface JobState {
  jobs: Job[];
  currentJob: Job | null;
  isLoading: boolean;
  fetchJobs: (companyId: string) => Promise<void>;
  fetchJob: (companySlug: string, jobSlug: string) => Promise<void>;
  createJob: (companyId: string, data: Partial<Job>) => Promise<Job>;
  updateJob: (id: string, data: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
}
