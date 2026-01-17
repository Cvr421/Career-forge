import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, 
  LayoutGrid, 
  Rocket, 
  Users, 
  ArrowRight, 
  Sparkles, 
  Palette, 
  Eye,
  Zap,
  Globe,
  Shield,
  BarChart3,
  Code2,
  Layers
} from 'lucide-react';
import { HoneycombFeature } from '@/components/home/HoneycombFeature';
import { GlowingOrb } from '@/components/home/GlowingOrb';
import { FloatingCard } from '@/components/home/FloatingCard';
import { GridPattern } from '@/components/home/GridPattern';
import { GradientText, GlowText } from '@/components/home/AnimatedText';

const Index = () => {
  const features = [
    { 
      icon: Palette, 
      title: 'Custom Branding', 
      desc: 'Match your company colors, logos, and unique style identity',
      variant: 'primary' as const
    },
    { 
      icon: LayoutGrid, 
      title: 'Drag & Drop Builder', 
      desc: 'Build stunning pages with intuitive drag and drop interface',
      variant: 'secondary' as const
    },
    { 
      icon: Eye, 
      title: 'Live Preview', 
      desc: 'See every change in real-time as you build your page',
      variant: 'primary' as const
    },
    { 
      icon: Rocket, 
      title: 'One-Click Publish', 
      desc: 'Go live instantly with a single click deployment',
      variant: 'secondary' as const
    },
    { 
      icon: Zap, 
      title: 'Lightning Fast', 
      desc: 'Optimized performance for the best candidate experience',
      variant: 'primary' as const
    },
    { 
      icon: Globe, 
      title: 'SEO Optimized', 
      desc: 'Built-in SEO features to help candidates find your jobs',
      variant: 'secondary' as const
    },
    { 
      icon: Shield, 
      title: 'Enterprise Security', 
      desc: 'Bank-level security to protect your data and candidates',
      variant: 'primary' as const
    },
    { 
      icon: BarChart3, 
      title: 'Analytics Dashboard', 
      desc: 'Track views, applications, and conversion rates',
      variant: 'secondary' as const
    },
  ];

  const stats = [
    { value: '10K+', label: 'Companies' },
    { value: '500K+', label: 'Jobs Posted' },
    { value: '2M+', label: 'Candidates' },
    { value: '99.9%', label: 'Uptime' },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated background elements */}
      <GlowingOrb color="primary" size="lg" position={{ top: '10%', left: '-10%' }} delay={0} />
      <GlowingOrb color="secondary" size="lg" position={{ top: '30%', right: '-15%' }} delay={2} />
      <GlowingOrb color="primary" size="md" position={{ bottom: '20%', left: '20%' }} delay={4} />
      <GlowingOrb color="secondary" size="sm" position={{ top: '60%', right: '10%' }} delay={1} />
      
      <GridPattern />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
              <Briefcase className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">CareerForge</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/login">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <motion.div 
                className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-5 py-2.5 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Build beautiful careers pages in minutes
                </span>
              </motion.div>
              
              {/* Main Heading */}
              <motion.h1 
                className="mb-8 text-5xl font-bold tracking-tight text-foreground md:text-7xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                The Modern Way to
                <br />
                <GlowText className="text-5xl md:text-7xl">Attract Top Talent</GlowText>
              </motion.h1>
              
              {/* Subtitle */}
              <motion.p 
                className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground md:text-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Create stunning, branded careers pages with our drag-and-drop builder. 
                No coding required. Publish in seconds.
              </motion.p>
              
              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-col items-center justify-center gap-4 sm:flex-row"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link to="/register">
                  <Button 
                    size="lg" 
                    className="gap-2 px-8 py-6 text-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-xl shadow-primary/30 transition-all hover:shadow-primary/50"
                  >
                    Start Building Free <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/techcorp/careers">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="gap-2 px-8 py-6 text-lg border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 hover:border-secondary/50"
                  >
                    <Eye className="h-5 w-5" /> View Demo
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Hero Visual - 3D Card Preview */}
            <FloatingCard delay={0.6} className="mt-16">
              <div className="relative mx-auto max-w-3xl rounded-2xl border border-border/50 bg-card/30 p-2 backdrop-blur-xl shadow-2xl">
                <div className="relative rounded-xl bg-gradient-to-br from-card to-card/80 p-6 overflow-hidden">
                  {/* Mock dashboard preview */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                    <div className="w-3 h-3 rounded-full bg-primary/60" />
                    <div className="w-3 h-3 rounded-full bg-secondary/60" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-48 h-32 rounded-lg bg-muted/50 animate-pulse" />
                      <div className="flex-1 space-y-3">
                        <div className="h-6 bg-muted/50 rounded w-3/4 animate-pulse" />
                        <div className="h-4 bg-muted/30 rounded w-1/2 animate-pulse" />
                        <div className="h-4 bg-muted/30 rounded w-2/3 animate-pulse" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 rounded-lg bg-muted/30 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                      ))}
                    </div>
                  </div>
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent pointer-events-none" />
                </div>
              </div>
            </FloatingCard>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 border-y border-border/30">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-bold text-foreground md:text-5xl">
                  <GradientText>{stat.value}</GradientText>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Honeycomb Grid */}
      <section className="relative py-24 md:py-32">
        <div className="container">
          <motion.div
            className="mx-auto mb-16 max-w-2xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-5xl">
              Everything You Need to <GradientText>Succeed</GradientText>
            </h2>
            <p className="text-muted-foreground text-lg">
              Powerful features designed to help you attract and hire the best talent
            </p>
          </motion.div>

          {/* Honeycomb Feature Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <HoneycombFeature
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.desc}
                index={i}
                variant={feature.variant}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-24 border-t border-border/30">
        <div className="container">
          <motion.div
            className="mx-auto mb-16 max-w-2xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-5xl">
              Build in <GradientText>3 Simple Steps</GradientText>
            </h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              { 
                step: '01', 
                title: 'Design Your Brand', 
                desc: 'Upload your logo, choose colors, and customize your style',
                icon: Palette
              },
              { 
                step: '02', 
                title: 'Add Your Content', 
                desc: 'Drag and drop sections, add jobs, and write compelling copy',
                icon: Layers
              },
              { 
                step: '03', 
                title: 'Publish & Share', 
                desc: 'One click to go live and start attracting candidates',
                icon: Rocket
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative p-8 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm group hover:border-primary/50 transition-all duration-300">
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold shadow-lg">
                    {item.step}
                  </div>
                  <item.icon className="w-10 h-10 text-primary mb-4 mt-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
                
                {/* Connector line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-border/50" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-card to-secondary/20" />
            <div className="absolute inset-0 backdrop-blur-3xl" />
            
            {/* Content */}
            <div className="relative px-8 py-16 text-center md:px-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/25">
                  <Users className="h-8 w-8 text-primary-foreground" />
                </div>
                <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                  Ready to Hire Better?
                </h2>
                <p className="mx-auto mb-8 max-w-md text-muted-foreground">
                  Join thousands of recruiters building amazing careers pages with CareerForge.
                </p>
                <Link to="/register">
                  <Button 
                    size="lg" 
                    className="gap-2 px-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-xl shadow-primary/30"
                  >
                    Get Started Free <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
            </div>
            
            {/* Border glow */}
            <div className="absolute inset-0 rounded-3xl border border-border/50" />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-12">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
                <Briefcase className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground">CareerForge</span>
            </div>
            <div className="flex items-center gap-8">
              <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link>
              <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
              <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
              <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 CareerForge. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
