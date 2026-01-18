import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RecruiterLayout } from '@/components/layout/RecruiterLayout';
import { useCompanyStore } from '@/store/companyStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Edit, ExternalLink, Copy, Briefcase, Building2, Check, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const DashboardPage = () => {
  const { companies, isLoading, fetchCompanies, createCompany, deleteCompany } = useCompanyStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleCreateCompany = async () => {
    if (!newCompanyName.trim()) return;
    setIsCreating(true);
    try {
      const company = await createCompany({ name: newCompanyName });
      toast.success(`${company.name} created successfully!`);
      setIsDialogOpen(false);
      setNewCompanyName('');
    } catch {
      toast.error('Failed to create company');
    } finally {
      setIsCreating(false);
    }
  };

  const copyPublicLink = (slug: string) => {
    const url = `${window.location.origin}/${slug}/careers`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleDeleteCompany = async (id: string, name: string) => {
    setDeletingId(id);
    try {
      await deleteCompany(id);
      toast.success(`${name} deleted successfully`);
    } catch {
      toast.error('Failed to delete company');
    } finally {
      setDeletingId(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <RecruiterLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Your Companies</h1>
            <p className="text-muted-foreground">
              Manage your branded careers pages
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Create New Company
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Company</DialogTitle>
                <DialogDescription>
                  Enter the company name to get started with your careers page.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="e.g., Acme Corporation"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreateCompany();
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateCompany}
                  disabled={!newCompanyName.trim() || isCreating}
                >
                  {isCreating ? 'Creating...' : 'Create Company'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Companies Grid */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : companies.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 py-16 text-center"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">
              No companies yet
            </h3>
            <p className="mb-6 max-w-md text-muted-foreground">
              Create your first company to start building your branded careers page.
            </p>
            <Button
              size="lg"
              className="gap-2"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="h-5 w-5" />
              Create Your First Company
            </Button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence>
              {companies.map((company) => (
                <motion.div key={company.id} variants={itemVariants} layout>
                  <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
                    <CardHeader className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-lg text-primary-foreground"
                            style={{ backgroundColor: company.primaryColor }}
                          >
                            <Briefcase className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {company.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              /{company.slug}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={company.status === 'published' ? 'default' : 'secondary'}
                        >
                          {company.status === 'published' ? 'Published' : 'Draft'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {company.jobCount} {company.jobCount === 1 ? 'job' : 'jobs'} posted
                      </p>
                    </CardContent>
                    <CardFooter className="flex flex-wrap gap-2">
                      <Link to={`/${company.slug}/edit`} className="flex-1">
                        <Button variant="outline" className="w-full gap-2">
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                      </Link>
                      <a
                        href={`/${company.slug}/careers`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button variant="outline" className="w-full gap-2">
                          <ExternalLink className="h-4 w-4" />
                          View
                        </Button>
                      </a>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyPublicLink(company.slug)}
                      >
                        {copiedSlug === company.slug ? (
                          <Check className="h-4 w-4 text-primary" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            disabled={deletingId === company.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete {company.name}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the company and all its jobs. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteCompany(company.id, company.name)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {deletingId === company.id ? 'Deleting...' : 'Delete'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </RecruiterLayout>
  );
};

export default DashboardPage;
