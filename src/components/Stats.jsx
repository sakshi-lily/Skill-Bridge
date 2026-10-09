import React from 'react';
import { Users, Rocket, Trophy, Award, Sparkles, University } from 'lucide-react';

export default function Stats() {
  const stats = [
    {
      id: 1,
      value: '12,500+',
      label: 'Active Student Builders',
      sublabel: 'Across 120+ top engineering & design campuses',
      demoTag: 'Demo Metric',
      icon: Users,
      badgeColor: 'bg-purple-100 dark:bg-purple-950/60 text-[#803BE8] dark:text-purple-300',
      gradient: 'from-purple-500/10 to-indigo-500/5',
    },
    {
      id: 2,
      value: '3,400+',
      label: 'Projects Built & Launched',
      sublabel: 'Hackathons, course capstones & student startups',
      demoTag: 'Demo Metric',
      icon: Rocket,
      badgeColor: 'bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300',
      gradient: 'from-pink-500/10 to-purple-500/5',
    },
    {
      id: 3,
      value: '98%',
      label: 'Match Success Rate',
      sublabel: 'Verified teams with complete complementary skill sets',
      demoTag: 'Demo Metric',
      icon: Trophy,
      badgeColor: 'bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-300',
      gradient: 'from-violet-500/10 to-pink-500/5',
    },
  ];

  return (
    <section className="py-12 sm:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Demo Label */}
        <div className="flex flex-col items-center justify-center mb-10 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-[#1a1435] border border-purple-200/70 dark:border-purple-800/50 text-xs font-semibold text-[#803BE8] dark:text-purple-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>Platform Impact &bull; Live Demo Analytics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Empowering the Next Generation of Builders
          </h2>
        </div>

        {/* 3 Statistic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="group relative rounded-2xl bg-white dark:bg-[#151226] border border-purple-100 dark:border-purple-900/40 p-7 sm:p-8 shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                {/* Subtle top accent gradient line */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#803BE8] to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

                <div className="flex items-center justify-between mb-5">
                  <div className={`p-3 rounded-2xl ${stat.badgeColor} shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#1f193d] text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-purple-900/30">
                    {stat.demoTag}
                  </span>
                </div>

                <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-[#803BE8] dark:group-hover:text-[#a872fd] transition-colors">
                  {stat.value}
                </div>

                <div className="mt-2 text-base font-bold text-slate-800 dark:text-slate-200">
                  {stat.label}
                </div>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {stat.sublabel}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
