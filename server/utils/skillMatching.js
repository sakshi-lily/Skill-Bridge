/**
 * Canonical dictionary of skill aliases to ensure consistent matching.
 */
export const SKILL_ALIASES = {
  'js': 'javascript',
  'javascript': 'javascript',
  'ts': 'typescript',
  'typescript': 'typescript',
  'py': 'python',
  'python': 'python',
  'react': 'react',
  'react.js': 'react',
  'reactjs': 'react',
  'react native': 'react native',
  'node': 'node.js',
  'nodejs': 'node.js',
  'node.js': 'node.js',
  'express': 'express.js',
  'express.js': 'express.js',
  'expressjs': 'express.js',
  'mongo': 'mongodb',
  'mongodb': 'mongodb',
  'postgres': 'postgresql',
  'postgresql': 'postgresql',
  'tailwind': 'tailwind css',
  'tailwindcss': 'tailwind css',
  'tailwind css': 'tailwind css',
  'ui/ux': 'ui/ux design',
  'ui/ux design': 'ui/ux design',
  'figma': 'figma',
  'fastapi': 'fastapi',
  'pytorch': 'pytorch',
  'tensorflow': 'tensorflow',
  'docker': 'docker',
  'graphql': 'graphql',
  'nextjs': 'next.js',
  'next.js': 'next.js',
};

/**
 * Normalizes a raw skill string: trims whitespace, converts to lowercase,
 * and maps known aliases to a canonical representation.
 */
export function normalizeSkill(skill) {
  if (!skill || typeof skill !== 'string') return '';
  const trimmed = skill.trim().toLowerCase();
  return SKILL_ALIASES[trimmed] || trimmed;
}

/**
 * Normalizes an array of skills and removes duplicates.
 */
export function normalizeSkillsList(skills = []) {
  if (!Array.isArray(skills)) return [];
  const normalized = skills
    .map(normalizeSkill)
    .filter(Boolean);
  return Array.from(new Set(normalized));
}

/**
 * Calculates a genuine, rule-based skill-match percentage.
 * Formula: Match Score = (Number of matched required skills / Total required skills) * 100
 */
export function calculateSkillMatch(requiredSkills = [], studentSkills = []) {
  const normRequired = normalizeSkillsList(requiredSkills);
  const normStudent = normalizeSkillsList(studentSkills);

  const totalRequired = normRequired.length;

  if (totalRequired === 0) {
    return {
      score: 100,
      matchedCount: 0,
      totalRequired: 0,
      matchedSkills: [],
      missingSkills: [],
      matchStrength: 'High',
      explanation: 'This project has no specific technical prerequisites. All candidates are eligible.',
    };
  }

  const studentSkillSet = new Set(normStudent);
  const matchedSkills = [];
  const missingSkills = [];

  normRequired.forEach(req => {
    if (studentSkillSet.has(req)) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  });

  const matchedCount = matchedSkills.length;
  const rawScore = (matchedCount / totalRequired) * 100;
  const score = Math.round(rawScore);

  let matchStrength = 'Low';
  if (score >= 75) {
    matchStrength = 'High';
  } else if (score >= 40) {
    matchStrength = 'Moderate';
  }

  let explanation = '';
  if (matchedCount === totalRequired) {
    explanation = `Perfect match! Possesses all ${totalRequired} required skills (${matchedSkills.join(', ')}).`;
  } else if (matchedCount === 0) {
    explanation = `No required skills matched. Project requirements: ${normRequired.join(', ')}.`;
  } else {
    explanation = `Matches ${matchedCount} of ${totalRequired} required skills (${score}%). Missing: ${missingSkills.join(', ')}.`;
  }

  return {
    score,
    matchedCount,
    totalRequired,
    matchedSkills,
    missingSkills,
    matchStrength,
    explanation,
  };
}

/**
 * Ranks candidates for a project by calculated skill-match score descending.
 */
export function rankStudentsForProject(projectOrSkills, students = []) {
  const requiredSkills = Array.isArray(projectOrSkills)
    ? projectOrSkills
    : (projectOrSkills?.requiredSkills || []);

  const evaluated = students.map(student => {
    const skills = student.skills || [];
    const match = calculateSkillMatch(requiredSkills, skills);
    return {
      student,
      match,
      calculatedScore: match.score,
    };
  });

  return evaluated.sort((a, b) => b.calculatedScore - a.calculatedScore);
}
