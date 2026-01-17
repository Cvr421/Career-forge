import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCompanyStore } from '@/store/companyStore';
import { useJobStore } from '@/store/jobStore';
import { RecruiterLayout } from '@/components/layout/RecruiterLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BrandSettings } from '@/components/recruiter/BrandSettings';
import { SectionsManager } from '@/components/recruiter/SectionsManager';
import { JobsManager } from '@/components/recruiter/JobsManager';
import { PublishControls } from '@/components/recruiter/PublishControls';
import { LivePreview } from '@/components/recruiter/LivePreview';
import { ArrowLeft, Palette, Layout, Briefcase, Rocket, Monitor, Smartphone, Eye, EyeOff } from 'lucide-react';

const CompanyEditPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { currentCompany, isLoading, fetchCompany } = useCompanyStore();
  const { fetchJobs } = useJobStore();
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchCompany(slug);
    }
  }, [slug, fetchCompany]);

  useEffect(() => {
    if (currentCompany) {
      fetchJobs(currentCompany.id);
    }
  }, [currentCompany, fetchJobs]);

  if (isLoading || !currentCompany) {
    return (
      <RecruiterLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="flex flex-col gap-6 lg:flex-row">
            <Skeleton className="h-[600px] w-full lg:w-[400px]" />
            <Skeleton className="hidden h-[600px] flex-1 lg:block" />
          </div>
        </div>
      </RecruiterLayout>
    );
  }

  return (
    <RecruiterLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground md:text-2xl">
                {currentCompany.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                Edit your careers page
              </p>
            </div>
          </div>
          
          {/* Mobile Preview Toggle */}
          <Button
            variant="outline"
            className="gap-2 lg:hidden"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
        </div>

        {/* Editor Layout */}
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left Panel - Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full shrink-0 lg:w-[420px]"
          >
            <div className="overflow-hidden rounded-xl border border-border bg-card lg:sticky lg:top-24">
              <Tabs defaultValue="brand" className="w-full">
                <TabsList className="grid w-full grid-cols-4 rounded-none border-b border-border bg-transparent p-0">
                  <TabsTrigger
                    value="brand"
                    className="flex flex-col gap-1 rounded-none border-b-2 border-transparent py-2 md:py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    <Palette className="h-4 w-4" />
                    <span className="text-[10px] md:text-xs">Brand</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="sections"
                    className="flex flex-col gap-1 rounded-none border-b-2 border-transparent py-2 md:py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    <Layout className="h-4 w-4" />
                    <span className="text-[10px] md:text-xs">Sections</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="jobs"
                    className="flex flex-col gap-1 rounded-none border-b-2 border-transparent py-2 md:py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    <Briefcase className="h-4 w-4" />
                    <span className="text-[10px] md:text-xs">Jobs</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="publish"
                    className="flex flex-col gap-1 rounded-none border-b-2 border-transparent py-2 md:py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    <Rocket className="h-4 w-4" />
                    <span className="text-[10px] md:text-xs">Publish</span>
                  </TabsTrigger>
                </TabsList>

                <div className="max-h-[60vh] overflow-y-auto p-4 lg:max-h-[calc(100vh-250px)]">
                  <TabsContent value="brand" className="m-0">
                    <BrandSettings company={currentCompany} />
                  </TabsContent>
                  <TabsContent value="sections" className="m-0">
                    <SectionsManager company={currentCompany} />
                  </TabsContent>
                  <TabsContent value="jobs" className="m-0">
                    <JobsManager company={currentCompany} />
                  </TabsContent>
                  <TabsContent value="publish" className="m-0">
                    <PublishControls company={currentCompany} />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </motion.div>

          {/* Right Panel - Live Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex-1 ${showPreview ? 'block' : 'hidden lg:block'}`}
          >
            <div className="overflow-hidden rounded-xl border border-border bg-card lg:sticky lg:top-24">
              {/* Preview Header */}
              <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2">
                <span className="text-sm font-medium text-foreground">
                  Live Preview
                </span>
                <div className="flex gap-1">
                  <Button
                    variant={previewMode === 'desktop' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setPreviewMode('desktop')}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={previewMode === 'mobile' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setPreviewMode('mobile')}
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Preview Content */}
              <div className="h-[60vh] overflow-y-auto bg-background p-4 lg:h-[calc(100vh-250px)]">
                <div
                  className={`mx-auto transition-all duration-300 ${
                    previewMode === 'mobile'
                      ? 'w-[375px] max-w-full rounded-3xl border border-border shadow-xl'
                      : 'w-full'
                  }`}
                >
                  <LivePreview company={currentCompany} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </RecruiterLayout>
  );
};

export default CompanyEditPage;