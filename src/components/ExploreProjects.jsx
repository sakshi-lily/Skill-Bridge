import React from 'react';
import { Sparkles, Users, Calendar, ArrowRight, Tag } from 'lucide-react';

export default function ExploreProjects() {
  const sampleProjects = [
    {
      id: 1,
      title: 'DevMentor — AI Code Reviewer for CS Undergrads',
      category: 'Hackathon &bull; MIT Hack2026',
      description:
        'Building an intelligent assistant that analyzes student pull requests and provides polite, educational feedback and style tips.',
      openRoles: ['Frontend (React)', 'Prompt Engineer'],
      membersCount: '3/4 members',
      deadline: 'Hackathon in 5 days',
      accentColor: 'from-purple-500/10 to-indigo-500/10',
    },
    {
      id: 2,
      title: 'DormBazaar — Campus Secondhand Marketplace',
      category: 'Semester Capstone Project',
      description:
        'A verified student marketplace with college email authentication, safe pickup spots on campus, and micro-escrow payments.',
      openRoles: ['UI/UX Designer', 'Mobile (React Native)'],
      membersCount: '2/4 members',
      deadline: 'Spring Term Project',
      accentColor: 'from-pink-500/10 to-rose-500/10',
    },
    {
      id: 3,
      title: 'BioSync — Lab Equipment Booking & Sharing',
      category: 'Research Collaboration',
      description:
        'A cross-department portal for biology and chemistry researchers to share centrifuge and microscope slots smoothly.',
      openRoles: ['Backend (Python/FastAPI)', 'Data Analyst'],
      membersCount: '2/3 members',
      deadline: 'Starting this week',
      accentColor: 'from-violet-500/10 to-pink-500/10',
    },
  ];

  return (
    <section id="projects" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800/40 text-xs font-semibold text-pink-600 dark:text-pink-300 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Actively Recruiting Teams</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Trending Projects Looking for Teammates
            </h2>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
              Browse exciting ideas submitted by fellow students and apply with your skills.
            </p>
          </div>

          <a
            href="#get-started"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#803BE8] dark:text-[#a872fd] hover:text-[#6c27cf] transition-colors self-start md:self-auto"
          >
            <span>View All 180+ Open Projects</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {sampleProjects.map((project) => (
            <div
              key={project.id}
              className="group rounded-3xl bg-white dark:bg-[#151226] border border-purple-100 dark:border-purple-900/40 p-6 sm:p-7 shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-400 mb-3">
                  <span
                    dangerouslySetInnerHTML={{ __html: project.category }}
                    className="font-medium text-purple-600 dark:text-purple-300"
                  />
                  <span className="flex items-center gap-1 text-[11px] bg-slate-100 dark:bg-[#1f193d] px-2 py-0.5 rounded-full">
                    <Users className="w-3 h-3" /> {project.membersCount}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#803BE8] dark:group-hover:text-purple-300 transition-colors">
                  {project.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {project.description}
                </p>

                {/* Needed Roles */}
                <div className="mt-5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                    Roles Needed:
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {project.openRoles.map((role, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 dark:bg-[#211a43] text-[#803BE8] dark:text-pink-300 border border-purple-100 dark:border-purple-800/40"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Card CTA */}
              <div className="mt-6 pt-4 border-t border-purple-100/70 dark:border-purple-950/60 flex items-center justify-between">
                <span className="text-xs text-slate-400 dark:text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {project.deadline}
                </span>

                <button
                  type="button"
                  className="text-xs font-bold text-[#803BE8] dark:text-purple-300 hover:text-pink-600 dark:hover:text-pink-300 flex items-center gap-1"
                >
                  Join Team &rarr;
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
