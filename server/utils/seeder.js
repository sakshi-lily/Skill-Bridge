import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import User from '../models/User.js';
import Project from '../models/Project.js';
import Team from '../models/Team.js';
import Task from '../models/Task.js';
import Notification from '../models/Notification.js';

dotenv.config();

export const seedData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('ℹ️ Database already contains data. Skipping initial seeding.');
      return;
    }

    console.log('🌱 Seeding initial database records...');

    // Hash default password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);
    const adminPasswordHash = await bcrypt.hash('admin123', salt);

    // 1. Create Users
    const alex = await User.create({
      name: 'Alex Morgan',
      email: 'alex.morgan@stanford.edu',
      password: passwordHash,
      role: 'student',
      university: 'Stanford University',
      major: 'Computer Science',
      academicYear: 'Year 3',
      courseAndYear: 'CS Junior • Year 3',
      bio: 'Full-stack builder passionate about developer tooling, real-time collaboration, and accessible design systems.',
      skills: ['React', 'Python', 'FastAPI', 'Tailwind CSS', 'PostgreSQL', 'UI/UX Design'],
      experienceLevel: 'Intermediate',
      availability: '10-15 hrs/week',
      preferredRoles: ['Full-Stack Developer', 'Frontend Lead'],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    });

    const sarah = await User.create({
      name: 'Sarah Patel',
      email: 'sarah.patel@mit.edu',
      password: passwordHash,
      role: 'student',
      university: 'MIT',
      major: 'Design Engineering',
      academicYear: 'Year 4',
      courseAndYear: 'Design Senior • Year 4',
      bio: 'Product and interaction designer with 3 hackathon wins. Love prototyping interactive design systems.',
      skills: ['Figma', 'UI/UX Design', 'Tailwind CSS', 'React', 'User Research'],
      experienceLevel: 'Advanced',
      availability: '15-20 hrs/week',
      preferredRoles: ['UI/UX Designer', 'Product Lead'],
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    });

    const david = await User.create({
      name: 'David Chen',
      email: 'david.chen@berkeley.edu',
      password: passwordHash,
      role: 'student',
      university: 'UC Berkeley',
      major: 'Electrical Engineering & CS',
      academicYear: 'Year 2',
      courseAndYear: 'EECS Sophomore • Year 2',
      bio: 'Systems and backend programmer specializing in high-throughput APIs and distributed consensus.',
      skills: ['Python', 'FastAPI', 'PyTorch', 'Docker', 'PostgreSQL', 'C++'],
      experienceLevel: 'Advanced',
      availability: '10-15 hrs/week',
      preferredRoles: ['Backend Developer', 'ML Engineer'],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    });

    const facultyUser = await User.create({
      name: 'Prof. Eleanor Davis',
      email: 'prof.davis@stanford.edu',
      password: passwordHash,
      role: 'faculty',
      university: 'Stanford University',
      major: 'Computer Science Faculty',
      academicYear: 'Faculty Advisor',
      courseAndYear: 'CS Department Faculty',
      bio: 'Faculty advisor overseeing collegiate project matchmaking, capstone initiatives, and interdisciplinary research.',
      skills: ['Project Oversight', 'Machine Learning Research', 'Curriculum Design'],
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    });

    const adminUser = await User.create({
      name: 'SkillBridge Admin',
      email: 'admin@skillbridge.edu',
      password: adminPasswordHash,
      role: 'admin',
      university: 'SkillBridge Network',
      major: 'Platform Administration',
      academicYear: 'Staff',
      courseAndYear: 'System Administration',
      bio: 'Campus-wide administrator for platform governance, security compliance, and user verification.',
      skills: ['System Architecture', 'Governance', 'Security'],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    });

    // 2. Create Projects
    const projectPulse = await Project.create({
      title: 'CampusPulse AI — Smart Student Sentiment & Resource Hub',
      shortDescription: 'AI-driven student feedback aggregation platform helping universities detect student burnout and allocate campus mental health resources.',
      detailedDescription: 'CampusPulse AI aggregates open survey responses, course forum feedback, and campus activity logs using NLP sentiment analysis to provide proactive recommendations for academic support and mental health counselors.',
      problemStatement: 'Universities struggle to identify early signs of academic fatigue and student distress across distributed departments.',
      objectives: ['Implement sentiment analysis pipeline', 'Design student privacy-preserving dashboard', 'Build secure API gateways'],
      requiredSkills: ['React', 'Python', 'FastAPI', 'UI/UX Design', 'Tailwind CSS'],
      category: 'AI & Machine Learning',
      difficulty: 'Intermediate',
      teamSize: 4,
      openPositionsCount: 1,
      availableRoles: ['ML Engineer', 'Full-Stack Developer'],
      mode: 'Hybrid',
      weeklyCommitment: '8-10 hrs/week',
      deadline: 'Dec 15, 2026',
      status: 'Active',
      owner: alex._id,
      milestones: [
        { title: 'Project Kickoff & Design System', targetDate: 'Oct 20, 2026', completed: true },
        { title: 'FastAPI Analytics Pipeline', targetDate: 'Nov 05, 2026', completed: false },
        { title: 'Campus Testing & Presentation', targetDate: 'Dec 10, 2026', completed: false },
      ],
      members: [
        { user: alex._id, name: alex.name, role: 'Team Lead', avatar: alex.avatar },
        { user: sarah._id, name: sarah.name, role: 'UI/UX Designer', avatar: sarah.avatar },
        { user: david._id, name: david.name, role: 'Backend Lead', avatar: david.avatar },
      ],
    });

    // 3. Create Teams
    const teamPulse = await Team.create({
      name: 'PulseEngineers',
      description: 'Core engineering squad delivering CampusPulse AI for the Spring 2026 showcase.',
      project: projectPulse._id,
      projectName: projectPulse.title,
      owner: alex._id,
      ownerName: alex.name,
      maxMembers: 4,
      members: [
        { user: alex._id, name: alex.name, role: 'Team Lead', avatar: alex.avatar, isOwner: true },
        { user: sarah._id, name: sarah.name, role: 'UI/UX Designer', avatar: sarah.avatar, isOwner: false },
        { user: david._id, name: david.name, role: 'Backend Lead', avatar: david.avatar, isOwner: false },
      ],
    });

    // 4. Create Tasks
    await Task.create([
      {
        title: 'Design responsive student navigation bar',
        description: 'Implement desktop and mobile drawer navigation with theme support and route badges.',
        project: projectPulse._id,
        projectName: projectPulse.title,
        team: teamPulse._id,
        teamName: teamPulse.name,
        assignedTo: { user: sarah._id, name: sarah.name, avatar: sarah.avatar },
        creator: alex._id,
        priority: 'Medium',
        status: 'Completed',
        dueDate: '2026-10-05',
        isOverdue: false,
      },
      {
        title: 'Setup FastAPI route validation & JWT auth',
        description: 'Build Bearer token middleware and role authorization guards.',
        project: projectPulse._id,
        projectName: projectPulse.title,
        team: teamPulse._id,
        teamName: teamPulse.name,
        assignedTo: { user: david._id, name: david.name, avatar: david.avatar },
        creator: alex._id,
        priority: 'High',
        status: 'In Progress',
        dueDate: '2026-10-18',
        isOverdue: false,
      },
      {
        title: 'Finalize OpenAI sentiment prompt templates',
        description: 'Benchmark prompt outputs against anonymous campus survey datasets.',
        project: projectPulse._id,
        projectName: projectPulse.title,
        team: teamPulse._id,
        teamName: teamPulse.name,
        assignedTo: { user: alex._id, name: alex.name, avatar: alex.avatar },
        creator: alex._id,
        priority: 'High',
        status: 'To Do',
        dueDate: '2026-10-08',
        isOverdue: true,
      },
    ]);

    // 5. Create Initial Notification
    await Notification.create({
      recipient: alex._id,
      sender: sarah._id,
      senderName: sarah.name,
      senderAvatar: sarah.avatar,
      type: 'milestone',
      title: 'Milestone 1 Completed',
      message: `${sarah.name} completed the design system specification for CampusPulse AI.`,
      relatedProject: projectPulse._id,
      relatedTeam: teamPulse._id,
      isRead: false,
    });

    console.log('✅ [Database Seeding Complete]: Default demo users, projects, teams, tasks, and notifications created.');
  } catch (err) {
    console.error('❌ [Database Seeding Error]:', err.message);
  }
};
