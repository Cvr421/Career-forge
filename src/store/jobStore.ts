import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { JobState, Job } from '@/types';
import { slugify, ensureUniqueSlug } from '@/utils/slugify';

// Helper to parse "X days ago" to number
const parseDaysAgo = (text: string): number => {
  if (!text) return 0;
  if (text.toLowerCase().includes('today')) return 0;
  const match = text.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

// Helper to map employment type from CSV to app format
const mapJobType = (employmentType: string, jobType: string): Job['jobType'] => {
  const type = (jobType || employmentType || '').toLowerCase();
  if (type.includes('intern')) return 'internship';
  if (type.includes('contract') || type.includes('temporary')) return 'contract';
  if (type.includes('part')) return 'part-time';
  return 'full-time';
};

// CSV row structure from the sample file
interface CSVJobRow {
  title: string;
  work_policy: string;
  location: string;
  department: string;
  employment_type: string;
  experience_level: string;
  job_type: string;
  salary_range: string;
  job_slug: string;
  posted_days_ago: string;
}

// Extended JobState with import function
interface ExtendedJobState extends JobState {
  importJobs: (companyId: string, csvData: CSVJobRow[]) => Promise<{ success: number; failed: number }>;
}

// Helper to convert DB job to app Job type
const dbToAppJob = (dbJob: any): Job => ({
  id: dbJob.id,
  slug: dbJob.job_slug || slugify(dbJob.title),
  companyId: dbJob.company_id,
  title: dbJob.title,
  description: dbJob.description || '',
  location: dbJob.location || 'Remote',
  jobType: mapJobType(dbJob.employment_type || '', dbJob.job_type || ''),
  status: dbJob.is_open ? 'open' : 'closed',
  workPolicy: dbJob.work_policy,
  department: dbJob.department,
  employmentType: dbJob.employment_type,
  experienceLevel: dbJob.experience_level,
  salaryRange: dbJob.salary_range,
  postedDaysAgo: dbJob.posted_days_ago || 0,
  createdAt: dbJob.created_at,
  updatedAt: dbJob.created_at, // DB doesn't have updated_at for jobs
});

// Helper to convert app Job to DB format
const appToDbJob = (job: Partial<Job>, companyId?: string) => ({
  ...(companyId && { company_id: companyId }),
  ...(job.title && { title: job.title }),
  ...(job.slug && { job_slug: job.slug }),
  ...(job.description !== undefined && { description: job.description }),
  ...(job.location && { location: job.location }),
  ...(job.workPolicy !== undefined && { work_policy: job.workPolicy }),
  ...(job.department !== undefined && { department: job.department }),
  ...(job.employmentType !== undefined && { employment_type: job.employmentType }),
  ...(job.experienceLevel !== undefined && { experience_level: job.experienceLevel }),
  ...(job.jobType !== undefined && { job_type: job.jobType }),
  ...(job.salaryRange !== undefined && { salary_range: job.salaryRange }),
  ...(job.status && { is_open: job.status === 'open' }),
  ...(job.postedDaysAgo !== undefined && { posted_days_ago: job.postedDaysAgo }),
});

export const useJobStore = create<ExtendedJobState>((set, get) => ({
  jobs: [],
  currentJob: null,
  isLoading: false,

  fetchJobs: async (companyId: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const jobs = (data || []).map(dbToAppJob);
      set({ jobs, isLoading: false });
    } catch (error) {
      console.error('Error fetching jobs:', error);
      set({ jobs: [], isLoading: false });
    }
  },

  fetchJob: async (companySlug: string, jobSlug: string) => {
    set({ isLoading: true });
    try {
      // First get the company by slug
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('id')
        .eq('slug', companySlug)
        .single();

      if (companyError || !company) {
        set({ currentJob: null, isLoading: false });
        return;
      }

      // Then get the job
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('company_id', company.id)
        .eq('job_slug', jobSlug)
        .single();

      if (error) throw error;

      const job = data ? dbToAppJob(data) : null;
      set({ currentJob: job, isLoading: false });
    } catch (error) {
      console.error('Error fetching job:', error);
      set({ currentJob: null, isLoading: false });
    }
  },

  createJob: async (companyId: string, data: Partial<Job>) => {
    set({ isLoading: true });
    try {
      // Generate unique slug
      const baseSlug = slugify(data.title || 'new-job');
      
      // Get existing job slugs in this company
      const { data: existingSlugs } = await supabase
        .from('jobs')
        .select('job_slug')
        .eq('company_id', companyId);
      
      const slugList = (existingSlugs || []).map((j: any) => j.job_slug);
      const uniqueSlug = ensureUniqueSlug(baseSlug, slugList);

      const { data: newJob, error } = await supabase
        .from('jobs')
        .insert({
          company_id: companyId,
          title: data.title || 'New Position',
          job_slug: uniqueSlug,
          description: data.description || '',
          location: data.location || 'Remote',
          work_policy: data.workPolicy || null,
          department: data.department || null,
          employment_type: data.employmentType || 'Full time',
          experience_level: data.experienceLevel || null,
          job_type: data.jobType || 'full-time',
          salary_range: data.salaryRange || null,
          is_open: true,
          posted_days_ago: 0,
        })
        .select()
        .single();

      if (error) throw error;

      const job = dbToAppJob(newJob);
      set({ jobs: [job, ...get().jobs], isLoading: false });
      return job;
    } catch (error) {
      console.error('Error creating job:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateJob: async (id: string, data: Partial<Job>) => {
    set({ isLoading: true });
    try {
      const updateData = appToDbJob(data);

      const { data: updatedJob, error } = await supabase
        .from('jobs')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const job = dbToAppJob(updatedJob);
      set({
        jobs: get().jobs.map((j) => (j.id === id ? job : j)),
        currentJob: get().currentJob?.id === id ? job : get().currentJob,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error updating job:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  deleteJob: async (id: string) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set({
        jobs: get().jobs.filter((j) => j.id !== id),
        isLoading: false,
      });
    } catch (error) {
      console.error('Error deleting job:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  importJobs: async (companyId: string, csvData: CSVJobRow[]) => {
    set({ isLoading: true });
    
    let success = 0;
    let failed = 0;

    // Get existing job slugs for uniqueness check
    const { data: existingSlugs } = await supabase
      .from('jobs')
      .select('job_slug')
      .eq('company_id', companyId);
    
    const slugList = (existingSlugs || []).map((j: any) => j.job_slug);

    for (const row of csvData) {
      try {
        if (!row.title || row.title.trim() === '') {
          failed++;
          continue;
        }

        const baseSlug = row.job_slug || slugify(row.title);
        const uniqueSlug = ensureUniqueSlug(baseSlug, slugList);
        slugList.push(uniqueSlug); // Add to list for next iteration

        const daysAgo = parseDaysAgo(row.posted_days_ago);

        const { error } = await supabase
          .from('jobs')
          .insert({
            company_id: companyId,
            title: row.title,
            job_slug: uniqueSlug,
            description: `${row.title} position in ${row.department || 'General'} department.\n\nExperience Level: ${row.experience_level || 'Not specified'}\nEmployment Type: ${row.employment_type || 'Full time'}\nSalary: ${row.salary_range || 'Competitive'}`,
            location: row.location || 'Remote',
            work_policy: row.work_policy || null,
            department: row.department || null,
            employment_type: row.employment_type || 'Full time',
            experience_level: row.experience_level || null,
            job_type: row.job_type || 'full-time',
            salary_range: row.salary_range || null,
            is_open: true,
            posted_days_ago: daysAgo,
          });

        if (error) {
          console.error('Failed to import job:', row.title, error);
          failed++;
        } else {
          success++;
        }
      } catch (error) {
        console.error('Failed to import job:', row, error);
        failed++;
      }
    }

    // Refresh jobs list
    await get().fetchJobs(companyId);

    return { success, failed };
  },
}));
