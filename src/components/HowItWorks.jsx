import React from 'react';
import { UserCheck, Compass, Users, Rocket, Sparkles, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Create Profile & Tag Skills',
      description:
        'Set up your student profile in under 2 minutes. Highlight your tech stack, design tools, preferred roles, and courses you are taking.',
      icon: UserCheck,
      details: ['Skill proficiency levels', 'University verification', 'Project portfolio links'],
    },
    {
      number: '02',
      title: 'Browse or Pitch an Idea',
      description:
        'Explore active projects needing your specific superpowers, or post your own startup / hackathon idea specifying the roles you need.',
      icon: Compass,
      details: ['Filter by framework & role', 'Hackathon specific filters', 'Open team vacancies'],
    },
    {
      number: '03',
      title: 'Smart Match & Form Team',
      description:
        'Our algorithm identifies students with complementary skills and mutual project goals. Send instant match invites with one click.',
      icon: Users,
      details: ['Synergy compatibility score', 'Mutual interest confirmation', 'Verified peer feedback'],
    },
    {
      number: '04',
      title: 'Collaborate & Ship Together',
      description:
        'Use project milestones, unified chat, and sprint checklists to keep momentum high from kickoff to the final project presentation.',
      icon: Rocket,
      details: ['Built-in milestone boards', 'Submission checklist', 'Showcase in Hall of Fame'],
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 relative bg-purple-50/40 dark:bg-[#100d20]/50 border-y border-purple-100/60 dark:border-purple-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#1b1536] border border-purple-200 dark:border-purple-800/60 text-xs font-semibold text-[#803BE8] dark:text-purple-300 mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>Step-by-Step Matchmaking</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            How SkillBridge Works
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            From solo idea to an unstoppable team in four straightforward steps.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="group relative rounded-3xl bg-white dark:bg-[#16122a] border border-purple-100 dark:border-purple-900/40 p-6 sm:p-7 shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  {/* Top: Step Number & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-purple-200 dark:text-purple-900/80 group-hover:text-[#803BE8] dark:group-hover:text-purple-400 transition-colors">
                      {step.number}
                    </span>
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#803BE8]/10 to-pink-500/10 dark:from-purple-900/30 dark:to-pink-900/20 text-[#803BE8] dark:text-pink-300 flex items-center justify-center border border-purple-100 dark:border-purple-900/40 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#803BE8] dark:group-hover:text-purple-300 transition-colors">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Details list */}
                <div className="mt-6 pt-4 border-t border-purple-50 dark:border-purple-950/60 space-y-1.5">
                  {step.details.map((detail, dIdx) => (
                    <div key={dIdx} className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
