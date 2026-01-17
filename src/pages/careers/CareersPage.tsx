import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { useCompanyStore } from '@/store/companyStore';
import { useJobStore } from '@/store/jobStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, MapPin, Search, Briefcase, Clock, ChevronRight, ChevronLeft, Linkedin, Github, Twitter, Instagram, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const JOBS_PER_PAGE = 20;

const CareersPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { currentCompany, isLoading: companyLoading, fetchCompany } = useCompanyStore();
  const { jobs, isLoading: jobsLoading, fetchJobs } = useJobStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

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

  const openJobs = jobs.filter((j) => j.status === 'open');

  const locations = useMemo(() => {
    const unique = [...new Set(openJobs.map((j) => j.location))];
    return unique.sort();
  }, [openJobs]);

  const filteredJobs = useMemo(() => {
    return openJobs.filter((job) => {
      const matchesSearch = job.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesLocation =
        locationFilter === 'all' || job.location === locationFilter;
      const matchesType = typeFilter === 'all' || job.jobType === typeFilter;

      return matchesSearch && matchesLocation && matchesType;
    });
  }, [openJobs, searchQuery, locationFilter, typeFilter]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, locationFilter, typeFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const endIndex = startIndex + JOBS_PER_PAGE;
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      // Scroll to jobs section
      document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const visibleSections = currentCompany?.sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order) || [];

  const jobTypeLabels: Record<string, string> = {
    'full-time': 'Full-time',
    'part-time': 'Part-time',
    contract: 'Contract',
    internship: 'Internship',
  };

  const hasSocialLinks = currentCompany?.socialLinks && (
    currentCompany.socialLinks.linkedin ||
    currentCompany.socialLinks.github ||
    currentCompany.socialLinks.twitter ||
    currentCompany.socialLinks.instagram ||
    currentCompany.socialLinks.reddit
  );

  if (companyLoading || !currentCompany) {
    return (
      <PublicLayout>
        <div className="min-h-screen">
          <Skeleton className="h-48 w-full md:h-64" />
          <div className="container py-12 md:py-16">
            <Skeleton className="mx-auto h-8 w-64" />
            <div className="mt-8 space-y-6 md:mt-12 md:space-y-8">
              <Skeleton className="h-24 w-full md:h-32" />
              <Skeleton className="h-24 w-full md:h-32" />
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
      <title>Careers at {currentCompany.name}</title>
      <meta
        name="description"
        content={`Explore career opportunities at ${currentCompany.name}. ${openJobs.length} open positions.`}
      />

      {/* Banner */}
      <div
        className="relative h-48 w-full md:h-64 lg:h-80"
        style={{
          background: currentCompany.banner
            ? `url(${currentCompany.banner}) center/cover`
            : `linear-gradient(135deg, ${currentCompany.primaryColor}, ${currentCompany.accentColor})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/20" />
        
        {/* Logo */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 md:-bottom-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-background shadow-xl md:h-24 md:w-24 lg:h-28 lg:w-28"
            style={{ backgroundColor: currentCompany.primaryColor }}
          >
            {currentCompany.logo ? (
              <img
                src={currentCompany.logo}
                alt={currentCompany.name}
                className="h-full w-full rounded-xl object-contain p-2"
              />
            ) : (
              <Building2 className="h-8 w-8 text-primary-foreground md:h-10 md:w-10 lg:h-12 lg:w-12" />
            )}
          </motion.div>
        </div>
      </div>

      <div className="container px-4 pb-12 pt-16 md:px-6 md:pb-16 md:pt-20">
        {/* Company Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 text-center text-2xl font-bold text-foreground md:mb-4 md:text-3xl lg:text-4xl"
        >
          {currentCompany.name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 text-center text-base text-muted-foreground md:mb-8 md:text-lg"
        >
          Join our team and help build something amazing
        </motion.p>

        {/* Social Links */}
        {hasSocialLinks && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8 flex flex-wrap items-center justify-center gap-2 md:mb-12"
          >
            {currentCompany.socialLinks?.linkedin && (
              <a href={currentCompany.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="h-9 w-9 md:h-10 md:w-10">
                  <Linkedin className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </a>
            )}
            {currentCompany.socialLinks?.github && (
              <a href={currentCompany.socialLinks.github} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="h-9 w-9 md:h-10 md:w-10">
                  <Github className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </a>
            )}
            {currentCompany.socialLinks?.twitter && (
              <a href={currentCompany.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="h-9 w-9 md:h-10 md:w-10">
                  <Twitter className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </a>
            )}
            {currentCompany.socialLinks?.instagram && (
              <a href={currentCompany.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="h-9 w-9 md:h-10 md:w-10">
                  <Instagram className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </a>
            )}
            {currentCompany.socialLinks?.reddit && (
              <a href={currentCompany.socialLinks.reddit} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="h-9 w-9 md:h-10 md:w-10">
                  <svg className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                  </svg>
                </Button>
              </a>
            )}
          </motion.div>
        )}

        {/* Sections */}
        <div className="mx-auto max-w-3xl space-y-8 md:space-y-12">
          {visibleSections.map((section, index) => (
            <motion.section
              key={section.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              aria-labelledby={`section-${section.id}`}
            >
              {section.type === 'hero' ? (
                <div
                  className="rounded-xl p-6 text-center md:rounded-2xl md:p-8 lg:p-12"
                  style={{ backgroundColor: `${currentCompany.primaryColor}10` }}
                >
                  <h2
                    id={`section-${section.id}`}
                    className="mb-3 text-xl font-bold md:mb-4 md:text-2xl lg:text-3xl"
                    style={{ color: currentCompany.primaryColor }}
                  >
                    {section.data.title}
                  </h2>
                  <p className="text-base text-muted-foreground whitespace-pre-line md:text-lg">
                    {section.data.content}
                  </p>
                </div>
              ) : (
                <div>
                  <h2
                    id={`section-${section.id}`}
                    className="mb-3 text-xl font-bold text-foreground md:mb-4 md:text-2xl"
                  >
                    {section.data.title}
                  </h2>
                  <div className="prose prose-muted max-w-none">
                    <p className="text-base text-muted-foreground whitespace-pre-line leading-relaxed">
                      {section.data.content}
                    </p>
                  </div>
                </div>
              )}
            </motion.section>
          ))}

          {/* Culture Video */}
          {currentCompany.cultureVideoUrl && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="mb-3 text-xl font-bold text-foreground md:mb-4 md:text-2xl">
                Life at {currentCompany.name}
              </h2>
              <div className="aspect-video overflow-hidden rounded-xl">
                <iframe
                  src={currentCompany.cultureVideoUrl}
                  title="Culture Video"
                  className="h-full w-full"
                  allowFullScreen
                />
              </div>
            </motion.section>
          )}

          {/* Jobs Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            aria-labelledby="open-positions"
          >
            <div className="mb-4 flex items-center justify-between md:mb-6">
              <h2
                id="open-positions"
                className="text-xl font-bold text-foreground md:text-2xl"
              >
                Open Positions
              </h2>
              <Badge
                className="text-xs md:text-sm"
                style={{ backgroundColor: currentCompany.primaryColor }}
              >
                {openJobs.length} {openJobs.length === 1 ? 'role' : 'roles'}
              </Badge>
            </div>

            {/* Filters */}
            <div className="mb-4 flex flex-col gap-3 md:mb-6 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  aria-label="Search jobs"
                />
              </div>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Job Listings */}
            {jobsLoading ? (
              <div className="space-y-3 md:space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full md:h-24" />
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border py-12 text-center md:py-16">
                <Briefcase className="mx-auto mb-3 h-10 w-10 text-muted-foreground md:mb-4 md:h-12 md:w-12" />
                <h3 className="mb-2 text-base font-semibold text-foreground md:text-lg">
                  {openJobs.length === 0
                    ? 'No open positions'
                    : 'No matching jobs found'}
                </h3>
                <p className="text-sm text-muted-foreground md:text-base">
                  {openJobs.length === 0
                    ? 'Check back later for new opportunities'
                    : 'Try adjusting your search or filters'}
                </p>
              </div>
            ) : (
              <>
                {/* Job count info */}
                {filteredJobs.length > JOBS_PER_PAGE && (
                  <div className="mb-4 text-sm text-muted-foreground">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredJobs.length)} of {filteredJobs.length} jobs
                  </div>
                )}

                <div className="space-y-3 md:space-y-4">
                  {paginatedJobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link to={`/${slug}/careers/${job.slug}`}>
                        <Card className="group transition-all duration-300 hover:shadow-lg hover:border-primary/30">
                          <CardContent className="p-4 md:p-6">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors md:text-lg">
                                  {job.title}
                                </h3>
                                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground md:mt-2 md:gap-3 md:text-sm">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3 md:h-4 md:w-4" />
                                    {job.location}
                                  </span>
                                  <Badge variant="outline" className="text-[10px] md:text-xs">
                                    {jobTypeLabels[job.jobType]}
                                  </Badge>
                                  {job.workPolicy && (
                                    <Badge variant="secondary" className="text-[10px] md:text-xs">
                                      {job.workPolicy}
                                    </Badge>
                                  )}
                                  {job.salaryRange && (
                                    <span className="hidden text-green-600 lg:inline">
                                      {job.salaryRange}
                                    </span>
                                  )}
                                  <span className="hidden items-center gap-1 sm:flex">
                                    <Clock className="h-3 w-3 md:h-4 md:w-4" />
                                    {formatDistanceToNow(new Date(job.createdAt), {
                                      addSuffix: true,
                                    })}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="gap-1 text-xs h-8 px-3 md:h-9 md:px-4">
                                  <ExternalLink className="h-3 w-3 md:h-4 md:w-4" />
                                  <span className="hidden sm:inline">Details</span>
                                </Button>
                                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary md:h-5 md:w-5" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className="gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className="gap-2"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </motion.section>
        </div>
      </div>
    </PublicLayout>
  );
};

export default CareersPage;