import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Company, SocialLinks } from '@/types';
import { useCompanyStore } from '@/store/companyStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Save, Upload, Image as ImageIcon, Video, Linkedin, Github, Twitter, Instagram } from 'lucide-react';

const brandSchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  primaryColor: z.string(),
  accentColor: z.string(),
  cultureVideoUrl: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  instagram: z.string().url().optional().or(z.literal('')),
  reddit: z.string().url().optional().or(z.literal('')),
});

type BrandFormData = z.infer<typeof brandSchema>;

interface BrandSettingsProps {
  company: Company;
}

export const BrandSettings = ({ company }: BrandSettingsProps) => {
  const { updateCompany } = useCompanyStore();
  const [logo, setLogo] = useState<string | undefined>(company.logo);
  const [banner, setBanner] = useState<string | undefined>(company.banner);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: company.name,
      primaryColor: company.primaryColor,
      accentColor: company.accentColor,
      cultureVideoUrl: company.cultureVideoUrl || '',
      linkedin: company.socialLinks?.linkedin || '',
      github: company.socialLinks?.github || '',
      twitter: company.socialLinks?.twitter || '',
      instagram: company.socialLinks?.instagram || '',
      reddit: company.socialLinks?.reddit || '',
    },
  });

  const onSubmit = async (data: BrandFormData) => {
    try {
      const socialLinks: SocialLinks = {
        linkedin: data.linkedin || undefined,
        github: data.github || undefined,
        twitter: data.twitter || undefined,
        instagram: data.instagram || undefined,
        reddit: data.reddit || undefined,
      };

      await updateCompany(company.id, {
        name: data.name,
        primaryColor: data.primaryColor,
        accentColor: data.accentColor,
        logo,
        banner,
        cultureVideoUrl: data.cultureVideoUrl || undefined,
        socialLinks,
      });
      toast.success('Brand settings saved!');
    } catch {
      toast.error('Failed to save settings');
    }
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'banner'
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (type === 'logo') {
          setLogo(result);
        } else {
          setBanner(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Brand Settings</h3>
        <p className="text-sm text-muted-foreground">
          Customize your careers page appearance
        </p>
      </div>

      {/* Company Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Company Name</Label>
        <Input
          id="name"
          {...register('name')}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Colors */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="primaryColor">Primary Color</Label>
          <div className="flex gap-2">
            <Input
              id="primaryColor"
              type="color"
              className="h-10 w-14 cursor-pointer p-1"
              {...register('primaryColor')}
            />
            <Input
              {...register('primaryColor')}
              placeholder="#0284c7"
              className="flex-1"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="accentColor">Accent Color</Label>
          <div className="flex gap-2">
            <Input
              id="accentColor"
              type="color"
              className="h-10 w-14 cursor-pointer p-1"
              {...register('accentColor')}
            />
            <Input
              {...register('accentColor')}
              placeholder="#7c3aed"
              className="flex-1"
            />
          </div>
        </div>
      </div>

      {/* Logo Upload */}
      <div className="space-y-2">
        <Label>Logo</Label>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted/30 md:h-20 md:w-20">
            {logo ? (
              <img
                src={logo}
                alt="Logo preview"
                className="h-full w-full object-contain"
              />
            ) : (
              <ImageIcon className="h-6 w-6 text-muted-foreground md:h-8 md:w-8" />
            )}
          </div>
          <div className="flex-1">
            <input
              type="file"
              id="logo-upload"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'logo')}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => document.getElementById('logo-upload')?.click()}
            >
              <Upload className="h-4 w-4" />
              Upload Logo
            </Button>
            <p className="mt-1 text-xs text-muted-foreground">
              Recommended: 200x200px PNG or JPG
            </p>
          </div>
        </div>
      </div>

      {/* Banner Upload */}
      <div className="space-y-2">
        <Label>Banner Image</Label>
        <div className="space-y-2">
          <div className="flex h-24 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted/30 md:h-32">
            {banner ? (
              <img
                src={banner}
                alt="Banner preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <ImageIcon className="h-8 w-8 text-muted-foreground md:h-10 md:w-10" />
            )}
          </div>
          <input
            type="file"
            id="banner-upload"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, 'banner')}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => document.getElementById('banner-upload')?.click()}
          >
            <Upload className="h-4 w-4" />
            Upload Banner
          </Button>
        </div>
      </div>

      {/* Culture Video URL */}
      <div className="space-y-2">
        <Label htmlFor="cultureVideoUrl">
          <div className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Culture Video URL
          </div>
        </Label>
        <Input
          id="cultureVideoUrl"
          placeholder="https://youtube.com/embed/..."
          {...register('cultureVideoUrl')}
        />
        <p className="text-xs text-muted-foreground">
          YouTube or Vimeo embed URL (optional)
        </p>
      </div>

      {/* Social Links */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Social Links</Label>
        <p className="text-sm text-muted-foreground">
          Add your company's social media profiles
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Linkedin className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="https://linkedin.com/company/..."
              {...register('linkedin')}
              className="flex-1"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Github className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="https://github.com/..."
              {...register('github')}
              className="flex-1"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Twitter className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="https://x.com/..."
              {...register('twitter')}
              className="flex-1"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Instagram className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="https://instagram.com/..."
              {...register('instagram')}
              className="flex-1"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
            </svg>
            <Input
              placeholder="https://reddit.com/r/..."
              {...register('reddit')}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <Button
        type="submit"
        className="w-full gap-2"
        disabled={isSubmitting || (!isDirty && logo === company.logo && banner === company.banner)}
      >
        {isSubmitting ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
};