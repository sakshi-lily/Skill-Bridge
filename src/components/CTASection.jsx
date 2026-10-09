import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export default function CTASection() {
  return (
    <section id="get-started" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#803BE8] via-[#7329db] to-[#be185d] p-8 sm:p-12 md:p-16 text-center text-white shadow-2xl">
          {/* Background decorative circles */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-pink-400/20 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-semibold text-white mb-6">
              <Sparkles className="w-3.5 h-3.5 text-pink-200" />
              <span>Join 12,000+ Student Creators</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Ready to Turn Your Ideas Into Real Projects?
            </h2>

            <p className="mt-4 text-base sm:text-lg text-purple-100 max-w-xl mx-auto leading-relaxed">
              Create your profile today, discover complement skills across universities, and build your next hackathon winner or portfolio capstone.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#803BE8] hover:bg-purple-50 text-base font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5 text-[#803BE8]" />
              </Link>

              <a
                href="#projects"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/30 text-base font-semibold backdrop-blur-md transition-all duration-200"
              >
                <span>Explore Open Projects</span>
              </a>
            </div>

            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-purple-200">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-pink-300" />
                100% Free for Students
              </span>
              <span>&bull;</span>
              <span>No Credit Card Required</span>
              <span>&bull;</span>
              <span>Verified Campus Communities</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
