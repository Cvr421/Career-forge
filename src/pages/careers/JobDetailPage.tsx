import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { useCompanyStore } from '@/store/companyStore';
import { useJobStore } from '@/store/jobStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, MapPin, Clock, Briefcase, Building2, Calendar } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

const JobDetailPage = () => {
  const { slug, jobSlug } = useParams<{ slug: string; jobSlug: string }>();
  const { currentCompany, isLoading: companyLoading, fetchCompany } = useCompanyStore();
  const { currentJob, isLoading: jobLoading, fetchJob } = useJobStore();

  useEffect(() => {
    if (slug) {
      fetchCompany(slug);
    }
  }, [slug, fetchCompany]);

  useEffect(() => {
    if (slug && jobSlug) {
      fetchJob(slug, jobSlug);
    }
  }, [slug, jobSlug, fetchJob]);

  const isLoading = companyLoading || jobLoading;

  const jobTypeLabels: Record<string, string> = {
    'full-time': 'Full-time',
    'part-time': 'Part-time',
    contract: 'Contract',
    internship: 'Internship',
  };

  if (isLoading || !currentCompany || !currentJob) {
    return (
      <PublicLayout>
        <div className="container py-8">
          <Skeleton className="mb-4 h-6 w-32" />
          <Skeleton className="mb-8 h-10 w-96" />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Skeleton className="h-96 w-full" />
            </div>
            <div>
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout
      primaryColor={currentCompany.primaryColor}
      accentColor={currentCompany.accentColor}
    >
      {/* SEO */}
      <title>
        {currentJob.title} at {currentCompany.name}
      </title>
      <meta
        name="description"
        content={`${currentJob.title} - ${currentJob.location} - ${jobTypeLabels[currentJob.jobType]} position at ${currentCompany.name}`}
      />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div
          className="border-b border-border py-8"
          style={{ backgroundColor: `${currentCompany.primaryColor}08` }}
        >
          <div className="container">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="mb-6 flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Link
                to={`/${slug}/careers`}
                className="flex items-center gap-1 hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to all jobs
              </Link>
            </nav>

            {/* Job Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div>
                  <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                    {currentJob.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      {currentJob.location}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-sm"
                    >
                      {jobTypeLabels[currentJob.jobType]}
                    </Badge>
                    <span className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Posted {formatDistanceToNow(new Date(currentJob.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="lg"
                      className="gap-2"
                      style={{ backgroundColor: currentCompany.primaryColor }}
                      disabled
                    >
                      <Briefcase className="h-5 w-5" />
                      Apply Now
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Applications opening soon</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="container py-12">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Job Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardContent className="p-8">
                  <h2 className="mb-6 text-xl font-semibold text-foreground">
                    About this role
                  </h2>
                  <div className="prose prose-muted max-w-none">
                    <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
                      {currentJob.description}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Company Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-xl"
                      style={{ backgroundColor: currentCompany.primaryColor }}
                    >
                      {currentCompany.logo ? (
                        <img
                          src={currentCompany.logo}
                          alt={currentCompany.name}
                          className="h-full w-full rounded-lg object-contain p-1"
                        />
                      ) : (
                        <Building2 className="h-7 w-7 text-primary-foreground" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {currentCompany.name}
                      </h3>
                      <Link
                        to={`/${slug}/careers`}
                        className="text-sm text-primary hover:underline"
                      >
                        View all jobs
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Facts */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 font-semibold text-foreground">
                    Quick Facts
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium text-foreground">
                          {currentJob.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Briefcase className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Job Type</p>
                        <p className="font-medium text-foreground">
                          {jobTypeLabels[currentJob.jobType]}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Posted</p>
                        <p className="font-medium text-foreground">
                          {format(new Date(currentJob.createdAt), 'MMMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Back Link */}
              <Link to={`/${slug}/careers`}>
                <Button variant="outline" className="w-full gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to all jobs
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default JobDetailPage;
