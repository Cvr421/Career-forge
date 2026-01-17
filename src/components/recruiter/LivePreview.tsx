import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Company } from '@/types';
import { useJobStore } from '@/store/jobStore';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, Building2, ExternalLink, Linkedin, Github, Twitter, Instagram } from 'lucide-react';

interface LivePreviewProps {
  company: Company;
}

export const LivePreview = ({ company }: LivePreviewProps) => {
  const { jobs } = useJobStore();
  const openJobs = jobs.filter((j) => j.status === 'open');
  const visibleSections = company.sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  const jobTypeLabels = {
    'full-time': 'Full-time',
    'part-time': 'Part-time',
    contract: 'Contract',
    internship: 'Internship',
  };

  const hasSocialLinks = company.socialLinks && (
    company.socialLinks.linkedin ||
    company.socialLinks.github ||
    company.socialLinks.twitter ||
    company.socialLinks.instagram ||
    company.socialLinks.reddit
  );

  return (
    <div className="min-h-[600px] overflow-hidden rounded-lg bg-background">
      {/* Banner */}
      <div
        className="relative h-36 w-full md:h-48"
        style={{
          background: company.banner
            ? `url(${company.banner}) center/cover`
            : `linear-gradient(135deg, ${company.primaryColor}, ${company.accentColor})`,
        }}
      >
        {/* Logo */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 md:-bottom-10">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-xl border-4 border-background shadow-lg md:h-20 md:w-20"
            style={{ backgroundColor: company.primaryColor }}
          >
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                className="h-full w-full rounded-lg object-contain"
              />
            ) : (
              <Building2 className="h-6 w-6 text-primary-foreground md:h-8 md:w-8" />
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-6 pt-12 md:px-6 md:pb-8 md:pt-14">
        {/* Company Name */}
        <h1 className="mb-4 text-center text-xl font-bold text-foreground md:mb-8 md:text-2xl">
          {company.name}
        </h1>

        {/* Social Links */}
        {hasSocialLinks && (
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
            {company.socialLinks?.linkedin && (
              <a href={company.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </a>
            )}
            {company.socialLinks?.github && (
              <a href={company.socialLinks.github} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Github className="h-4 w-4" />
                </Button>
              </a>
            )}
            {company.socialLinks?.twitter && (
              <a href={company.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Twitter className="h-4 w-4" />
                </Button>
              </a>
            )}
            {company.socialLinks?.instagram && (
              <a href={company.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Instagram className="h-4 w-4" />
                </Button>
              </a>
            )}
            {company.socialLinks?.reddit && (
              <a href={company.socialLinks.reddit} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                  </svg>
                </Button>
              </a>
            )}
          </div>
        )}

        {/* Sections */}
        <div className="space-y-6 md:space-y-8">
          {visibleSections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {section.type === 'hero' ? (
                <div
                  className="rounded-xl p-4 text-center md:p-6"
                  style={{ backgroundColor: `${company.primaryColor}15` }}
                >
                  <h2
                    className="mb-2 text-lg font-bold md:mb-3 md:text-xl"
                    style={{ color: company.primaryColor }}
                  >
                    {section.data.title}
                  </h2>
                  <p className="text-sm text-muted-foreground whitespace-pre-line md:text-base">
                    {section.data.content}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 md:space-y-3">
                  <h3 className="text-base font-semibold text-foreground md:text-lg">
                    {section.data.title}
                  </h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed md:text-base">
                    {section.data.content}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Jobs Section */}
        <div className="mt-8 space-y-4 md:mt-10">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-foreground md:text-lg">
              Open Positions
            </h3>
            <Badge variant="secondary">
              {openJobs.length} {openJobs.length === 1 ? 'job' : 'jobs'}
            </Badge>
          </div>

          {openJobs.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border py-6 text-center md:py-8">
              <Briefcase className="mx-auto mb-2 h-6 w-6 text-muted-foreground md:h-8 md:w-8" />
              <p className="text-xs text-muted-foreground md:text-sm">
                No open positions at the moment
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {openJobs.slice(0, 3).map((job) => (
                <Card key={job.id} className="transition-shadow hover:shadow-md">
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground text-sm md:text-base truncate">
                          {job.title}
                        </h4>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground md:gap-3 md:text-sm">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate max-w-[100px]">{job.location}</span>
                          </span>
                          <Badge variant="outline" className="text-[10px] md:text-xs">
                            {jobTypeLabels[job.jobType]}
                          </Badge>
                        </div>
                      </div>
                      <Link to={`/${company.slug}/careers/${job.slug}`}>
                        <Button variant="outline" size="sm" className="shrink-0 gap-1 text-xs h-7 px-2 md:h-8 md:px-3">
                          <ExternalLink className="h-3 w-3" />
                          <span className="hidden sm:inline">Details</span>
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {openJobs.length > 3 && (
                <p className="text-center text-xs text-muted-foreground md:text-sm">
                  +{openJobs.length - 3} more positions
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};