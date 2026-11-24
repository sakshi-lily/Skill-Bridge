import mongoose from 'mongoose';
import Skill from '../models/Skill.js';

export const PRESET_SKILLS_DATA = [
  { name: 'React', category: 'Frontend', popular: true, aliases: ['react.js', 'reactjs'] },
  { name: 'Node.js', category: 'Backend', popular: true, aliases: ['node', 'nodejs'] },
  { name: 'Python', category: 'AI & Machine Learning', popular: true, aliases: ['py', 'python3'] },
  { name: 'FastAPI', category: 'Backend', popular: true, aliases: ['fast api'] },
  { name: 'Tailwind CSS', category: 'Frontend', popular: true, aliases: ['tailwind', 'tailwindcss'] },
  { name: 'UI/UX Design', category: 'Design & UI/UX', popular: true, aliases: ['ui/ux', 'ui-ux', 'figma'] },
  { name: 'PostgreSQL', category: 'Backend', popular: true, aliases: ['postgres', 'postgresql'] },
  { name: 'MongoDB', category: 'Backend', popular: true, aliases: ['mongo', 'mongodb'] },
  { name: 'Docker', category: 'DevOps & Cloud', popular: true, aliases: ['docker container'] },
  { name: 'PyTorch', category: 'AI & Machine Learning', popular: true, aliases: ['torch'] },
  { name: 'TypeScript', category: 'Full-Stack', popular: true, aliases: ['ts'] },
  { name: 'Next.js', category: 'Frontend', popular: true, aliases: ['nextjs'] },
];

/**
 * @desc    Get all skills with search and category filters
 * @route   GET /api/skills
 * @access  Public
 */
export const getSkills = async (req, res, next) => {
  try {
    const { category, search, popular } = req.query;

    if (mongoose.connection.readyState !== 1) {
      let list = [...PRESET_SKILLS_DATA];
      if (category && category !== 'All') {
        list = list.filter((s) => s.category.toLowerCase() === category.toLowerCase());
      }
      if (popular === 'true') {
        list = list.filter((s) => s.popular);
      }
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.aliases?.some((a) => a.toLowerCase().includes(q))
        );
      }
      return res.status(200).json({ success: true, count: list.length, skills: list });
    }

    const query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    if (popular === 'true') {
      query.popular = true;
    }
    if (search && search.trim()) {
      const safe = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { name: { $regex: safe, $options: 'i' } },
        { aliases: { $regex: safe, $options: 'i' } },
      ];
    }

    const skills = await Skill.find(query).sort({ popular: -1, name: 1 });
    return res.status(200).json({ success: true, count: skills.length, skills });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new skill
 * @route   POST /api/skills
 * @access  Private (Authenticated users / Admin)
 */
export const createSkill = async (req, res, next) => {
  try {
    const { name, category = 'Other', description = '', aliases = [] } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Skill name is required.' });
    }

    if (mongoose.connection.readyState !== 1) {
      const newSkill = {
        _id: `skill-${Date.now()}`,
        name: name.trim(),
        category,
        description,
        aliases,
        popular: false,
      };
      return res.status(201).json({ success: true, skill: newSkill });
    }

    const existing = await Skill.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Skill already exists.' });
    }

    const skill = await Skill.create({
      name: name.trim(),
      category,
      description,
      aliases: Array.isArray(aliases) ? aliases : [],
    });

    return res.status(201).json({ success: true, skill });
  } catch (error) {
    next(error);
  }
};
