import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import ExploreProjects from '../components/ExploreProjects';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf8ff] dark:bg-[#0c0a17] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* 1. Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 2, 3, 4. Hero Section with Heading, Description, Two Buttons, & Interactive Preview */}
        <Hero />

        {/* 5. Three Statistic Cards */}
        <Stats />

        {/* 6. Features Section: Smart Skill Matching, Project Management, Team Collaboration */}
        <Features />

        {/* 7. How It Works Section */}
        <HowItWorks />

        {/* Community & Projects Spotlight */}
        <ExploreProjects />

        {/* Call to action */}
        <CTASection />
      </main>

      {/* 8. Footer */}
      <Footer />
    </div>
  );
}
