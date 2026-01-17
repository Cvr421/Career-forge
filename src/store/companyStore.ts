import { create } from 'zustand';
import { CompanyState, Company, Section } from '@/types';

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const defaultSections: Section[] = [
  {
    id: '1',
    type: 'hero',
    visible: true,
    order: 0,
    data: {
      title: 'Join Our Team',
      content: 'Build the future with us. We are looking for passionate people to join our growing team.',
    },
  },
  {
    id: '2',
    type: 'about',
    visible: true,
    order: 1,
    data: {
      title: 'About Us',
      content: 'We are a forward-thinking company dedicated to innovation and excellence.',
    },
  },
  {
    id: '3',
    type: 'culture',
    visible: true,
    order: 2,
    data: {
      title: 'Our Culture',
      content: 'We believe in collaboration, creativity, and continuous learning.',
    },
  },
  {
    id: '4',
    type: 'perks',
    visible: true,
    order: 3,
    data: {
      title: 'Perks & Benefits',
      content: '🏥 Health Insurance\n🏠 Remote Work\n📚 Learning Budget\n🎉 Team Events\n💰 Competitive Salary',
    },
  },
];

// Mock data store
let mockCompanies: Company[] = [
  {
    id: '1',
    slug: 'techcorp',
    name: 'TechCorp Inc.',
    logo: undefined,
    banner: undefined,
    primaryColor: '#0284c7',
    accentColor: '#7c3aed',
    socialLinks: {
      linkedin: 'https://linkedin.com/company/techcorp',
      github: 'https://github.com/techcorp',
      twitter: 'https://x.com/techcorp',
    },
    sections: defaultSections,
    status: 'published',
    jobCount: 3,
    recruiterId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    slug: 'innovate-labs',
    name: 'Innovate Labs',
    logo: undefined,
    banner: undefined,
    primaryColor: '#059669',
    accentColor: '#ea580c',
    socialLinks: {
      linkedin: 'https://linkedin.com/company/innovatelabs',
      instagram: 'https://instagram.com/innovatelabs',
    },
    sections: defaultSections,
    status: 'draft',
    jobCount: 1,
    recruiterId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useCompanyStore = create<CompanyState>((set, get) => ({
  companies: [],
  currentCompany: null,
  isLoading: false,

  fetchCompanies: async () => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 500));
    set({ companies: mockCompanies, isLoading: false });
  },

  fetchCompany: async (slug: string) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 300));
    const company = mockCompanies.find((c) => c.slug === slug) || null;
    set({ currentCompany: company, isLoading: false });
  },

  createCompany: async (data: Partial<Company>) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newCompany: Company = {
      id: Date.now().toString(),
      slug: generateSlug(data.name || 'new-company'),
      name: data.name || 'New Company',
      logo: data.logo,
      banner: data.banner,
      primaryColor: data.primaryColor || '#0284c7',
      accentColor: data.accentColor || '#7c3aed',
      sections: defaultSections,
      status: 'draft',
      jobCount: 0,
      recruiterId: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockCompanies = [...mockCompanies, newCompany];
    set({ companies: mockCompanies, isLoading: false });
    return newCompany;
  },

  updateCompany: async (id: string, data: Partial<Company>) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 300));

    mockCompanies = mockCompanies.map((c) =>
      c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c
    );

    const updated = mockCompanies.find((c) => c.id === id);
    set({
      companies: mockCompanies,
      currentCompany: updated || get().currentCompany,
      isLoading: false,
    });
  },

  publishCompany: async (id: string) => {
    await get().updateCompany(id, { status: 'published' });
  },

  unpublishCompany: async (id: string) => {
    await get().updateCompany(id, { status: 'draft' });
  },

  setCurrentCompany: (company: Company | null) => {
    set({ currentCompany: company });
  },
}));
