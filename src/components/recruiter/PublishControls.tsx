import { useState } from 'react';
import { Company } from '@/types';
import { useCompanyStore } from '@/store/companyStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { ExternalLink, Copy, Check, Rocket, EyeOff, Globe, AlertCircle } from 'lucide-react';

interface PublishControlsProps {
  company: Company;
}

export const PublishControls = ({ company }: PublishControlsProps) => {
  const { publishCompany, unpublishCompany } = useCompanyStore();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUnpublishing, setIsUnpublishing] = useState(false);
  const [copied, setCopied] = useState(false);

  const publicUrl = `${window.location.origin}/${company.slug}/careers`;

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await publishCompany(company.id);
      toast.success('Careers page published successfully!');
    } catch {
      toast.error('Failed to publish');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    setIsUnpublishing(true);
    try {
      await unpublishCompany(company.id);
      toast.success('Careers page unpublished');
    } catch {
      toast.error('Failed to unpublish');
    } finally {
      setIsUnpublishing(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-foreground">Publish Settings</h3>
        <p className="text-sm text-muted-foreground">
          Control the visibility of your careers page
        </p>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
        <div className="flex items-center gap-3">
          {company.status === 'published' ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Globe className="h-5 w-5 text-primary" />
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <EyeOff className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <div>
            <p className="font-medium text-foreground">Current Status</p>
            <Badge
              variant={company.status === 'published' ? 'default' : 'secondary'}
              className="mt-1"
            >
              {company.status === 'published' ? 'Published' : 'Draft'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="space-y-2">
        <Label>Preview</Label>
        <a 
          href={`/${company.slug}/careers`} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Button variant="outline" className="w-full gap-2">
            <ExternalLink className="h-4 w-4" />
            Open Preview in New Tab
          </Button>
        </a>
      </div>

      {/* Publish / Unpublish */}
      <div className="space-y-3">
        {company.status === 'draft' ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="lg" className="w-full gap-2">
                <Rocket className="h-5 w-5" />
                Publish Careers Page
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Publish Careers Page?</AlertDialogTitle>
                <AlertDialogDescription>
                  Your careers page will be visible to anyone with the link.
                  You can unpublish it at any time.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handlePublish} disabled={isPublishing}>
                  {isPublishing ? 'Publishing...' : 'Publish'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="lg"
                variant="destructive"
                className="w-full gap-2"
              >
                <EyeOff className="h-5 w-5" />
                Unpublish Page
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Unpublish Careers Page?</AlertDialogTitle>
                <AlertDialogDescription>
                  Your careers page will no longer be publicly accessible.
                  Job seekers won't be able to view your listings.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleUnpublish}
                  disabled={isUnpublishing}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isUnpublishing ? 'Unpublishing...' : 'Unpublish'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Public Link */}
      <div className="space-y-2">
        <Label>Public Link</Label>
        <div className="flex gap-2">
          <Input value={publicUrl} readOnly className="bg-muted/50" />
          <Button
            variant="outline"
            size="icon"
            onClick={copyLink}
            className="shrink-0"
          >
            {copied ? (
              <Check className="h-4 w-4 text-primary" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <a 
            href={publicUrl} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="icon"
              className="shrink-0"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        </div>
        <p className="text-xs text-muted-foreground">
          Share this link with candidates to view your careers page
        </p>
      </div>

      {/* Info */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Only published pages are visible to the public. Draft pages can only
          be previewed by you.
        </AlertDescription>
      </Alert>
    </div>
  );
};
