import Link from 'next/link';
import { reviewRegistry } from '@/features/design-review/registry';
import { cn } from '@/lib/utils';
import { Layout, Component, LayoutTemplate, Palette, ArrowRight, Activity, Zap, CheckCircle2 } from 'lucide-react';

export default function DesignReviewIndex() {
  // Group routes by category
  const groupedRoutes = reviewRegistry.reduce((acc, config) => {
    if (!acc[config.category]) acc[config.category] = [];
    acc[config.category].push(config);
    return acc;
  }, {} as Record<string, typeof reviewRegistry>);

  // Sort categories alphabetically
  const categories = Object.keys(groupedRoutes).sort();

  return (
    <div className="w-full h-full min-h-screen bg-[#0A0A0A] text-white p-8 md:p-12 overflow-y-auto selection:bg-primary/30">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 text-primary mb-2">
              <Palette className="w-6 h-6" />
              <span className="font-mono text-sm tracking-widest uppercase font-bold">Masarak Design System</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent">
              Review Portal
            </h1>
            <p className="text-white/50 max-w-xl text-lg mt-2">
              Isolated development environment for rigorous UI testing, responsive auditing, and interaction validation.
            </p>
          </div>
          
          {/* Quick Stats Widget */}
          <div className="flex items-center gap-6 bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-md">
            <div className="flex flex-col">
              <span className="text-3xl font-black">{reviewRegistry.length}</span>
              <span className="text-xs text-white/50 uppercase tracking-widest font-mono">Components</span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex flex-col">
              <span className="text-3xl font-black text-primary flex items-center gap-2">
                100% <CheckCircle2 className="w-5 h-5 text-primary" />
              </span>
              <span className="text-xs text-white/50 uppercase tracking-widest font-mono">Isolated</span>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="flex flex-col gap-16">
          {categories.map(category => {
            const routes = groupedRoutes[category].sort((a, b) => a.order - b.order);
            
            // Icon mapping
            let CategoryIcon = Layout;
            if (category.toLowerCase().includes('component')) CategoryIcon = Component;
            if (category.toLowerCase().includes('dashboard')) CategoryIcon = LayoutTemplate;
            if (category.toLowerCase().includes('engine')) CategoryIcon = Zap;
            
            return (
              <section key={category} className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <CategoryIcon className="w-5 h-5 text-white/70" />
                  </div>
                  <h2 className="text-2xl font-bold font-heading tracking-tight">{category}</h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent ml-4" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {routes.map(r => (
                    <Link 
                      key={r.path}
                      href={r.path}
                      className="group relative p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all overflow-hidden flex flex-col gap-4"
                    >
                      {/* Hover effect gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      
                      <div className="flex justify-between items-start gap-4 relative z-10">
                        <div className="flex flex-col gap-1">
                          <h3 className="font-bold text-lg text-white/90 group-hover:text-white transition-colors leading-tight">
                            {r.title}
                          </h3>
                          <p className="text-xs font-mono text-white/40 truncate mt-1">
                            {r.path}
                          </p>
                        </div>
                        
                        <div className={cn(
                          "w-2 h-2 rounded-full shrink-0 shadow-lg mt-1.5",
                          r.status === 'Implemented' ? "bg-primary shadow-primary/50" 
                          : r.status === 'WIP' ? "bg-orange-500 shadow-orange-500/50" 
                          : "bg-white/20"
                        )} />
                      </div>

                      <div className="mt-auto pt-4 flex items-center justify-between relative z-10 opacity-60 group-hover:opacity-100 transition-opacity">
                        <span className={cn(
                          "text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md border",
                          r.status === 'Implemented' ? "border-primary/20 text-primary bg-primary/10" 
                          : r.status === 'WIP' ? "border-orange-500/20 text-orange-500 bg-orange-500/10" 
                          : "border-white/10 text-white/50 bg-white/5"
                        )}>
                          {r.status}
                        </span>
                        
                        <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
