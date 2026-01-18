import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { CompanyState, Company, Section } from '@/types';
import { slugify, ensureUniqueSlug } from '@/utils/slugify';

// Default sections for new companies
const defaultSections: Section[] = [
  {
    id: 'hero',
    type: 'hero',
    visible: true,
    order: 0,
    data: {
      title: 'Join Our Team',
      subtitle: 'Build amazing things with us',
      content: 'Build the future with us. We are looking for passionate people to join our growing team.',
    },
  },
  {
    id: 'about',
    type: 'about',
    visible: true,
    order: 1,
    data: {
      title: 'About Us',
      content: 'We are a forward-thinking company dedicated to innovation and excellence.',
    },
  },
  {
    id: 'culture',
    type: 'culture',
    visible: true,
    order: 2,
    data: {
      title: 'Our Culture',
      content: 'We believe in collaboration, creativity, and continuous learning.',
    },
  },
  {
    id: 'perks',
    type: 'perks',
    visible: true,
    order: 3,
    data: {
      title: 'Perks & Benefits',
      content: '🏥 Health Insurance\n🏠 Remote Work\n📚 Learning Budget\n🎉 Team Events\n💰 Competitive Salary',
    },
  },
];

// Helper to convert DB company to app Company type
const dbToAppCompany = (dbCompany: any): Company => ({
  id: dbCompany.id,
  slug: dbCompany.slug,
  name: dbCompany.name,
  logo: dbCompany.logo_url || undefined,
  banner: dbCompany.banner_url || undefined,
  primaryColor: dbCompany.brand_primary_color || '#3b82f6',
  accentColor: dbCompany.brand_accent_color || '#8b5cf6',
  cultureVideoUrl: dbCompany.culture_video_url || undefined,
  sections: dbCompany.sections || defaultSections,
  status: dbCompany.is_published ? 'published' : 'draft',
  jobCount: dbCompany.job_count || 0,
  recruiterId: dbCompany.owner_id,
  createdAt: dbCompany.created_at,
  updatedAt: dbCompany.updated_at,
});

// Helper to convert app Company to DB format
const appToDbCompany = (company: Partial<Company>, ownerId?: string) => ({
  ...(ownerId && { owner_id: ownerId }),
  ...(company.name && { name: company.name }),
  ...(company.slug && { slug: company.slug }),
  ...(company.primaryColor && { brand_primary_color: company.primaryColor }),
  ...(company.accentColor && { brand_accent_color: company.accentColor }),
  ...(company.logo !== undefined && { logo_url: company.logo || null }),
  ...(company.banner !== undefined && { banner_url: company.banner || null }),
  ...(company.cultureVideoUrl !== undefined && { culture_video_url: company.cultureVideoUrl || null }),
  ...(company.sections && { sections: company.sections }),
  ...(company.status && { is_published: company.status === 'published' }),
});

export const useCompanyStore = create<CompanyState>((set, get) => ({
  companies: [],
  currentCompany: null,
  isLoading: false,

  fetchCompanies: async () => {
    set({ isLoading: true });
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        set({ companies: [], isLoading: false });
        return;
      }

      // Fetch companies with job count
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          jobs:jobs(count)
        `)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const companies = (data || []).map((c: any) => ({
        ...dbToAppCompany(c),
        jobCount: c.jobs?.[0]?.count || 0,
      }));

      set({ companies, isLoading: false });
    } catch (error) {
      console.error('Error fetching companies:', error);
      set({ companies: [], isLoading: false });
    }
  },

  fetchCompany: async (slug: string) => {
    set({ isLoading: true });
    try {
      // Fetch company by slug (works for both owner and public view)
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          jobs:jobs(count)
        `)
        .eq('slug', slug)
        .single();

      if (error) throw error;

      const company = data ? {
        ...dbToAppCompany(data),
        jobCount: data.jobs?.[0]?.count || 0,
      } : null;

      set({ currentCompany: company, isLoading: false });
    } catch (error) {
      console.error('Error fetching company:', error);
      set({ currentCompany: null, isLoading: false });
    }
  },

  createCompany: async (data: Partial<Company>) => {
    set({ isLoading: true });
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Generate unique slug
      const baseSlug = slugify(data.name || 'new-company');
      
      // Get existing slugs to ensure uniqueness
      const { data: existingSlugs } = await supabase
        .from('companies')
        .select('slug');
      
      const slugList = (existingSlugs || []).map((c: any) => c.slug);
      const uniqueSlug = ensureUniqueSlug(baseSlug, slugList);

      // Insert company
      const { data: newCompany, error } = await supabase
        .from('companies')
        .insert({
          owner_id: user.id,
          name: data.name || 'New Company',
          slug: uniqueSlug,
          brand_primary_color: data.primaryColor || '#3b82f6',
          brand_accent_color: data.accentColor || '#8b5cf6',
          logo_url: data.logo || null,
          banner_url: data.banner || null,
          sections: defaultSections,
          is_published: false,
        })
        .select()
        .single();

      if (error) throw error;

      const company = dbToAppCompany(newCompany);
      
      // Update local state
      set({ 
        companies: [company, ...get().companies], 
        isLoading: false 
      });

      return company;
    } catch (error) {
      console.error('Error creating company:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateCompany: async (id: string, data: Partial<Company>) => {
    set({ isLoading: true });
    try {
      const updateData = appToDbCompany(data);

      const { data: updatedCompany, error } = await supabase
        .from('companies')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const company = dbToAppCompany(updatedCompany);

      // Update local state
      set({
        companies: get().companies.map((c) => (c.id === id ? { ...c, ...company } : c)),
        currentCompany: get().currentCompany?.id === id 
          ? { ...get().currentCompany, ...company } 
          : get().currentCompany,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error updating company:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  deleteCompany: async (id: string) => {
    set({ isLoading: true });
    try {
      // First delete all jobs associated with this company
      const { error: jobsError } = await supabase
        .from('jobs')
        .delete()
        .eq('company_id', id);

      if (jobsError) throw jobsError;

      // Then delete the company
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      set({
        companies: get().companies.filter((c) => c.id !== id),
        currentCompany: get().currentCompany?.id === id ? null : get().currentCompany,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error deleting company:', error);
      set({ isLoading: false });
      throw error;
    }
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
