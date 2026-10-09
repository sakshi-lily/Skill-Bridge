import React from 'react';
import SkillBridgeLogo from './SkillBridgeLogo';
import { Heart, Mail, Globe, MessageCircle } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Platform',
      links: [
        { name: 'Smart Matchmaking', href: '#features' },
        { name: 'Project Workspace', href: '#features' },
        { name: 'Browse Projects', href: '#projects' },
        { name: 'How It Works', href: '#how-it-works' },
        { name: 'Success Stories', href: '#community' },
      ],
    },
    {
      title: 'Community',
      links: [
        { name: 'Student Discord', href: '#community' },
        { name: 'Campus Ambassadors', href: '#community' },
        { name: 'Hackathon Calendar', href: '#projects' },
        { name: 'Peer Mentorship', href: '#community' },
        { name: 'Code of Conduct', href: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: '#' },
        { name: 'Team Contract Templates', href: '#' },
        { name: 'Pitch Deck Guide', href: '#' },
        { name: 'Developer API', href: '#' },
        { name: 'Support & FAQs', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About SkillBridge', href: '#' },
        { name: 'Mission & Story', href: '#' },
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' },
        { name: 'Contact Campus Relations', href: '#' },
      ],
    },
  ];

  return (
    <footer className="bg-white dark:bg-[#0c0a17] border-t border-purple-100 dark:border-[#1e1936] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-12 border-b border-purple-100/80 dark:border-[#1f1938]">
          
          {/* Brand Info (2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            <SkillBridgeLogo />
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed mt-3">
              SkillBridge connects ambitious student developers, designers, and innovators to form complementary teams and build extraordinary software.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-[#1a1435] text-slate-600 dark:text-slate-300 hover:text-[#803BE8] dark:hover:text-[#a872fd] flex items-center justify-center transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-[#1a1435] text-slate-600 dark:text-slate-300 hover:text-[#803BE8] dark:hover:text-[#a872fd] flex items-center justify-center transition-colors"
                aria-label="Twitter / X"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-[#1a1435] text-slate-600 dark:text-slate-300 hover:text-[#803BE8] dark:hover:text-[#a872fd] flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="mailto:contact@skillbridge.edu"
                className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-[#1a1435] text-slate-600 dark:text-slate-300 hover:text-[#803BE8] dark:hover:text-[#a872fd] flex items-center justify-center transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Columns (4 columns) */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 hover:text-[#803BE8] dark:hover:text-[#c084fc] transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-400">
          <p>
            &copy; {currentYear} SkillBridge Platform. Built for student creators worldwide.
          </p>

          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 inline" />
            <span>for student builders</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
