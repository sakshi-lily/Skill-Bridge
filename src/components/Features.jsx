import React from 'react';
import { 
  Cpu, 
  Kanban, 
  Users2, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  GitBranch, 
  Layers, 
  MessageSquare,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function Features() {
  const features = [
    {
      id: 'skill-matching',
      title: 'Smart Skill Matching',
      badge: 'Core Feature',
      badgeColor: 'bg-purple-100 text-[#803BE8] dark:bg-purple-950/60 dark:text-purple-300',
      description:
        'Our algorithm evaluates technical proficiencies, role preferences, and course requirements to automatically match you with teammates whose skills complement your own.',
      icon: Cpu,
      accentBorder: 'border-purple-200 dark:border-purple-800/60',
      highlights: [
        'Complementary skill gap analysis',
        'Multi-stack pairing (Frontend + Backend + UI/UX)',
        'Compatibility score based on availability & goals',
      ],
      previewSnippet: {
        tag: 'Match Algorithm',
        title: 'Complementary Synergy Score',
        skills: ['React + Node', 'Figma + System Design', 'DevOps + Docker'],
      },
    },
    {
      id: 'project-management',
      title: 'Project Management',
      badge: 'Productivity',
      badgeColor: 'bg-pink-100 text-pink-600 dark:bg-pink-950/60 dark:text-pink-300',
      description:
        'Keep hackathons and capstone projects organized with intuitive milestone tracking, sprint goals, and task boards designed specifically for student teams.',
      icon: Kanban,
      accentBorder: 'border-pink-200 dark:border-pink-800/60',
      highlights: [
        'Milestone & sprint timeline tracking',
        'Role-assigned task workflows',
        'Repository & demo submission checklist',
      ],
      previewSnippet: {
        tag: 'Milestone Tracker',
        title: 'MVP Sprint 1 &bull; 85% Complete',
        skills: ['Sprint Backlog', 'Live API Hookup', 'Demo Polish'],
      },
    },
    {
      id: 'team-collaboration',
      title: 'Team Collaboration',
      badge: 'Communication',
      badgeColor: 'bg-violet-100 text-violet-600 dark:bg-violet-950/60 dark:text-violet-300',
      description:
        'Foster seamless teamwork with verified student identities, direct matchmaking invites, role definitions, and synchronized team workspace channels.',
      icon: Users2,
      accentBorder: 'border-violet-200 dark:border-violet-800/60',
      highlights: [
        'Instant student matchmaking requests',
        'Clearly defined team roles & permissions',
        'Vetted student profiles with campus badges',
      ],
      previewSnippet: {
        tag: 'Team Sync Hub',
        title: 'Active Team Workspace (4 Members)',
        skills: ['Role Clarity', 'Direct Chats', 'Peer Endorsements'],
      },
    },
  ];

  return (
    <section id="features" className="py-20 sm:py-28 relative">
      {/* Background ambient accents */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-purple-200/30 dark:bg-purple-950/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-pink-200/30 dark:bg-pink-950/20 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-[#1a1435] border border-purple-200 dark:border-purple-800/60 text-xs font-semibold text-[#803BE8] dark:text-purple-300 mb-4">
            <Zap className="w-3.5 h-3.5 text-pink-500" />
            <span>Built Specifically For Students</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Everything You Need to Form a Winning Team
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Eliminate awkward Discord searches and incomplete hackathon squads. SkillBridge gives you end-to-end tooling to match, organize, and execute.
          </p>
        </div>

        {/* Feature Cards Grid (3 Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="group relative rounded-3xl bg-white dark:bg-[#151226] border border-purple-100/90 dark:border-[#262045] p-7 sm:p-8 shadow-card hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Icon & Category Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-13 h-13 p-3.5 rounded-2xl bg-purple-50 dark:bg-[#201a40] text-[#803BE8] dark:text-purple-300 border border-purple-100 dark:border-purple-800/40 group-hover:scale-110 transition-transform duration-200">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${feature.badgeColor}`}>
                      {feature.badge}
                    </span>
                  </div>

                  {/* Feature Title */}
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[#803BE8] dark:group-hover:text-[#a872fd] transition-colors">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Bullet Highlights */}
                  <div className="mt-6 space-y-2.5">
                    {feature.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#803BE8] dark:text-pink-400 mt-0.5 shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Interactive/Visual Preview Widget */}
                <div className="mt-8 pt-6 border-t border-purple-100/80 dark:border-purple-950/70">
                  <div className="rounded-xl p-3.5 bg-slate-50/80 dark:bg-[#1a1532]/80 border border-purple-100/60 dark:border-purple-900/30">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 dark:text-slate-400 mb-2">
                      <span className="uppercase tracking-wider">{feature.previewSnippet.tag}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                        <Sparkles className="w-3 h-3" /> Live
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                      {feature.previewSnippet.title}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {feature.previewSnippet.skills.map((s, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white dark:bg-[#251e47] text-slate-700 dark:text-slate-300 border border-purple-100 dark:border-purple-900/40"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
