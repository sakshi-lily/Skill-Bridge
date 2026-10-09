import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Sparkles, CheckCircle2, Users, Code2, Palette, BrainCircuit } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28">
      {/* Background soft lavender & light pink ambient gradient orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none -z-10 overflow-hidden">
        {/* Soft Lavender blur circle */}
        <div className="absolute -top-16 left-1/4 w-96 h-96 sm:w-[540px] sm:h-[540px] bg-purple-200/50 dark:bg-purple-900/20 rounded-full blur-3xl opacity-70"></div>
        {/* Soft Pink blur circle */}
        <div className="absolute top-12 right-1/4 w-80 h-80 sm:w-[480px] sm:h-[480px] bg-pink-200/45 dark:bg-pink-900/15 rounded-full blur-3xl opacity-70"></div>
        {/* Center radial overlay */}
        <div className="absolute inset-0 bg-hero-radial"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Center Hero Content */}
        <div className="text-center max-w-3xl mx-auto">
          
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 dark:bg-[#1a1435]/90 border border-purple-200 dark:border-purple-800/60 shadow-sm text-xs sm:text-sm font-semibold text-[#803BE8] dark:text-purple-300 mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-pink-500 animate-pulse"></span>
            <Sparkles className="w-3.5 h-3.5 text-[#803BE8] dark:text-pink-400" />
            <span>Connect &bull; Collaborate &bull; Create</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] sm:leading-[1.12]">
            Find Your Perfect Team.{' '}
            <span className="text-gradient-purple-pink block sm:inline">
              Build Something Amazing.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            SkillBridge matches ambitious students with complementary skills, course requirements, and hackathon visions. Stop searching blindly — assemble your dream team and start shipping today.
          </p>

          {/* Two Action Buttons */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#803BE8] hover:bg-[#6c27cf] text-white text-base font-semibold shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href="#projects"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-white/90 dark:bg-[#17132e] hover:bg-purple-50/80 dark:hover:bg-[#201a40] text-slate-800 dark:text-slate-100 border border-purple-200 dark:border-purple-800/70 text-base font-semibold shadow-sm hover:shadow transition-all duration-200"
            >
              <Compass className="w-5 h-5 text-[#803BE8] dark:text-purple-300" />
              <span>Explore Projects</span>
            </a>
          </div>

        </div>

        {/* Hero Interactive Showcase Card (Team Match Demo) */}
        <div className="mt-14 max-w-4xl mx-auto">
          <div className="relative rounded-3xl p-1 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 dark:from-purple-900/50 dark:via-pink-900/30 dark:to-purple-900/50 shadow-card">
            <div className="rounded-[22px] bg-white/95 dark:bg-[#131024]/95 backdrop-blur-xl p-5 sm:p-8">
              
              {/* Match Header Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-purple-100 dark:border-purple-950/80 gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-[#803BE8] dark:text-purple-300 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#803BE8] dark:text-pink-400">
                        Live Match Preview
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
                        98% Match Compatibility
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                      Hackathon Project: "CampusPulse — AI Study &amp; Notes Hub"
                    </h3>
                  </div>
                </div>

                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-[#1c1736] px-3 py-1.5 rounded-full">
                  2/3 Roles Filled
                </span>
              </div>

              {/* Matched Teammates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                
                {/* Teammate 1 */}
                <div className="rounded-2xl p-4 bg-purple-50/50 dark:bg-[#1a1533]/60 border border-purple-100 dark:border-purple-900/40 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow">
                        AL
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Alex Lin</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">CS Junior &bull; Stanford</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#803BE8] dark:text-purple-300 mb-2">
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Full Stack Developer</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-white dark:bg-[#251e47] text-slate-700 dark:text-slate-200 border border-purple-100 dark:border-purple-900/50 font-medium">React</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-white dark:bg-[#251e47] text-slate-700 dark:text-slate-200 border border-purple-100 dark:border-purple-900/50 font-medium">FastAPI</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-white dark:bg-[#251e47] text-slate-700 dark:text-slate-200 border border-purple-100 dark:border-purple-900/50 font-medium">PostgreSQL</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-purple-100/80 dark:border-purple-900/30 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Project Founder</span>
                  </div>
                </div>

                {/* Teammate 2 */}
                <div className="rounded-2xl p-4 bg-pink-50/50 dark:bg-[#1d1430]/60 border border-pink-100 dark:border-pink-900/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 text-white font-bold flex items-center justify-center text-sm shadow">
                        SP
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Sarah Patel</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Design Senior &bull; MIT</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-pink-600 dark:text-pink-400 mb-2">
                      <Palette className="w-3.5 h-3.5" />
                      <span>UI/UX &amp; Product Lead</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-white dark:bg-[#281a3e] text-slate-700 dark:text-slate-200 border border-pink-100 dark:border-pink-900/40 font-medium">Figma</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-white dark:bg-[#281a3e] text-slate-700 dark:text-slate-200 border border-pink-100 dark:border-pink-900/40 font-medium">Design Systems</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-white dark:bg-[#281a3e] text-slate-700 dark:text-slate-200 border border-pink-100 dark:border-pink-900/40 font-medium">User Testing</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-pink-100/80 dark:border-pink-900/30 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Matched 2 hours ago</span>
                  </div>
                </div>

                {/* Looking For: Role 3 */}
                <div className="rounded-2xl p-4 bg-white dark:bg-[#16122a] border-2 border-dashed border-purple-300 dark:border-purple-700/60 flex flex-col justify-between items-center text-center py-6">
                  <div className="w-10 h-10 rounded-full bg-purple-100/80 dark:bg-purple-900/40 text-[#803BE8] dark:text-purple-300 flex items-center justify-center mx-auto mb-2">
                    <BrainCircuit className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#803BE8] dark:text-purple-300 uppercase tracking-wide">
                      Spot Available
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      AI / NLP Engineer
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[190px]">
                      Looking for student with LangChain or HuggingFace experience
                    </p>
                  </div>
                  <button
                    type="button"
                    className="mt-4 px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/50 hover:bg-[#803BE8] hover:text-white dark:hover:bg-[#803BE8] text-[#803BE8] dark:text-purple-200 text-xs font-semibold transition-all"
                  >
                    Apply to Join
                  </button>
                </div>

              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
