import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Papa from 'papaparse';
import { Company, Job } from '@/types';
import { useJobStore } from '@/store/jobStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Briefcase, Upload, FileSpreadsheet, Loader2 } from 'lucide-react';

const jobSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  description: z.string().min(1, 'Job description is required'),
  location: z.string().min(1, 'Location is required'),
  jobType: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  status: z.enum(['open', 'closed']),
});

type JobFormData = z.infer<typeof jobSchema>;

interface JobsManagerProps {
  company: Company;
}

export const JobsManager = ({ company }: JobsManagerProps) => {
  const { jobs, createJob, updateJob, deleteJob, importJobs } = useJobStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      jobType: 'full-time',
      status: 'open',
    },
  });

  const jobType = watch('jobType');
  const status = watch('status');

  const openCreateDialog = () => {
    setEditingJob(null);
    reset({
      title: '',
      description: '',
      location: '',
      jobType: 'full-time',
      status: 'open',
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (job: Job) => {
    setEditingJob(job);
    reset({
      title: job.title,
      description: job.description,
      location: job.location,
      jobType: job.jobType,
      status: job.status,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: JobFormData) => {
    try {
      if (editingJob) {
        await updateJob(editingJob.id, data);
        toast.success('Job updated successfully!');
      } else {
        await createJob(company.id, data);
        toast.success('Job created successfully!');
      }
      setIsDialogOpen(false);
      reset();
    } catch {
      toast.error('Failed to save job');
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      await deleteJob(id);
      toast.success('Job deleted');
    } catch {
      toast.error('Failed to delete job');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleStatusToggle = async (job: Job) => {
    try {
      await updateJob(job.id, {
        status: job.status === 'open' ? 'closed' : 'open',
      });
      toast.success(`Job ${job.status === 'open' ? 'closed' : 'opened'}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    const isValidType = validTypes.includes(file.type) || 
      file.name.endsWith('.csv') || 
      file.name.endsWith('.xlsx') || 
      file.name.endsWith('.xls');

    if (!isValidType) {
      toast.error('Please upload a CSV or Excel file');
      return;
    }

    setIsImporting(true);

    try {
      // For Excel files, we'd need xlsx library, but papaparse can handle CSV
      // For now, we'll use papaparse which handles CSV well
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          if (results.errors.length > 0) {
            console.error('Parse errors:', results.errors);
            toast.error('Error parsing file. Please check the format.');
            setIsImporting(false);
            return;
          }

          const csvData = results.data as any[];
          
          if (csvData.length === 0) {
            toast.error('No data found in the file');
            setIsImporting(false);
            return;
          }

          // Import jobs
          const { success, failed } = await importJobs(company.id, csvData);

          if (success > 0) {
            toast.success(`Successfully imported ${success} jobs${failed > 0 ? ` (${failed} failed)` : ''}`);
          } else {
            toast.error('Failed to import any jobs. Please check the file format.');
          }

          setIsImporting(false);
        },
        error: (error) => {
          console.error('Parse error:', error);
          toast.error('Error reading file');
          setIsImporting(false);
        },
      });
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import jobs');
      setIsImporting(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const jobTypeLabels = {
    'full-time': 'Full-time',
    'part-time': 'Part-time',
    contract: 'Contract',
    internship: 'Internship',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">Job Listings</h3>
          <p className="text-sm text-muted-foreground">
            {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} posted
          </p>
        </div>
        <div className="flex gap-2">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button 
            size="sm" 
            variant="outline" 
            className="gap-2" 
            onClick={triggerFileUpload}
            disabled={isImporting}
          >
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Import CSV
              </>
            )}
          </Button>
          <Button size="sm" className="gap-2" onClick={openCreateDialog}>
            <Plus className="h-4 w-4" />
            Add Job
          </Button>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-8 text-center">
          <Briefcase className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No jobs yet</p>
          <Button
            variant="link"
            size="sm"
            onClick={openCreateDialog}
            className="mt-2"
          >
            Create your first job
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {jobs.map((job) => (
                  <motion.tr
                    key={job.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-border"
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{job.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {job.location} • {jobTypeLabels[job.jobType]}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={job.status === 'open'}
                          onCheckedChange={() => handleStatusToggle(job)}
                        />
                        <Badge
                          variant={job.status === 'open' ? 'default' : 'secondary'}
                        >
                          {job.status === 'open' ? 'Open' : 'Closed'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditDialog(job)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(job.id)}
                          disabled={isDeleting === job.id}
                        >
                          {isDeleting === job.id ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-destructive border-t-transparent" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      )}

      {/* Job Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingJob ? 'Edit Job' : 'Create New Job'}
            </DialogTitle>
            <DialogDescription>
              {editingJob
                ? 'Update the job listing details'
                : 'Fill in the details for your new job listing'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                placeholder="e.g., Senior Frontend Developer"
                {...register('title')}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., San Francisco, CA or Remote"
                {...register('location')}
              />
              {errors.location && (
                <p className="text-sm text-destructive">{errors.location.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Job Type</Label>
                <Select
                  value={jobType}
                  onValueChange={(value) => setValue('jobType', value as JobFormData['jobType'])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={status}
                  onValueChange={(value) => setValue('status', value as JobFormData['status'])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={6}
                placeholder="Describe the role, responsibilities, and requirements..."
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? 'Saving...'
                  : editingJob
                  ? 'Save Changes'
                  : 'Create Job'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
