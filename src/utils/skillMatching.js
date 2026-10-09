/**
 * SkillBridge Smart Skill-Matching Algorithm
 * Rule-based, normalized skill comparison between project requirements and student profiles.
 */

// Skill aliases mapping to canonical names for accurate matching
const SKILL_ALIASES = {
  'react.js': 'react',
  'reactjs': 'react',
  'node.js': 'node.js',
  'nodejs': 'node.js',
  'node': 'node.js',
  'tailwind': 'tailwind css',
  'tailwindcss': 'tailwind css',
  'python3': 'python',
  'ml': 'machine learning',
  'ai': 'artificial intelligence',
  'ai/ml': 'machine learning',
  'ui/ux': 'ui/ux design',
  'ui-ux': 'ui/ux design',
  'ui/ux prototyping': 'ui/ux design',
  'ui/ux & product design': 'ui/ux design',
  'fastapi': 'fastapi',
  'fast api': 'fastapi',
  'next.js': 'next.js',
  'nextjs': 'next.js',
  'react native': 'react native',
  'react-native': 'react native',
  'postgres': 'postgresql',
  'postgres sql': 'postgresql',
  'postgresql': 'postgresql',
  'mongo': 'mongodb',
  'mongodb': 'mongodb',
  'docker': 'docker',
  'pytorch': 'pytorch',
  'tensorflow': 'tensorflow',
  'flutter': 'flutter',
  'figma': 'figma',
  'typescript': 'typescript',
  'ts': 'typescript',
  'javascript': 'javascript',
  'js': 'javascript',
  'langchain': 'langchain',
  'sql': 'sql',
};

/**
 * Normalizes a skill string: lowercases, trims, and resolves common aliases.
 * @param {string} skill 
 * @returns {string} normalized skill
 */
export function normalizeSkill(skill) {
  if (!skill || typeof skill !== 'string') return '';
  const cleaned = skill.trim().toLowerCase();
  return SKILL_ALIASES[cleaned] || cleaned;
}

/**
 * Deduplicates and normalizes an array of skills.
 * @param {string[]} skills 
 * @returns {string[]} unique normalized skills
 */
export function normalizeSkillsList(skills = []) {
  if (!Array.isArray(skills)) return [];
  const set = new Set();
  skills.forEach(s => {
    const normalized = normalizeSkill(s);
    if (normalized) set.add(normalized);
  });
  return Array.from(set);
}

/**
 * Calculates a genuine rule-based skill match score between project requirements and student skills.
 * 
 * Formula:
 * Match Score = (Number of matched required skills / Total required skills) * 100
 * 
 * @param {string[]} requiredSkills - List of skills required by project
 * @param {string[]} studentSkills - List of skills possessed by student
 * @returns {object} Matching calculation result
 */
export function calculateSkillMatch(requiredSkills = [], studentSkills = []) {
  const normRequired = normalizeSkillsList(requiredSkills);
  const normStudent = normalizeSkillsList(studentSkills);

  const totalRequired = normRequired.length;

  // Handle projects with no required skills appropriately without dividing by zero
  if (totalRequired === 0) {
    return {
      score: 100,
      matchedCount: 0,
      totalRequired: 0,
      matchedSkills: [],
      missingSkills: [],
      matchStrength: 'High',
      explanation: 'This project has no specific technical prerequisites. All students are eligible.',
    };
  }

  // Find matches and missing skills
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
  // Match Score = (matchedCount / totalRequired) * 100
  const rawScore = (matchedCount / totalRequired) * 100;
  const score = Math.round(rawScore);

  // Clear visual strength categorization (score itself remains unadulterated)
  let matchStrength = 'Low';
  if (score >= 75) {
    matchStrength = 'High';
  } else if (score >= 40) {
    matchStrength = 'Moderate';
  }

  // Formulate a transparent, human-readable explanation
  let explanation = '';
  if (matchedCount === totalRequired) {
    explanation = `Perfect match! Student possesses all ${totalRequired} required skills: ${matchedSkills.join(', ')}.`;
  } else if (matchedCount === 0) {
    explanation = `No required skills matched. Project requires: ${normRequired.join(', ')}.`;
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
 * Ranks an array of students for a project according to their calculated skill-match score.
 * Sorted by match score descending.
 * 
 * @param {object} project - Project object containing requiredSkills
 * @param {object[]} students - Array of student profiles
 * @returns {object[]} Ranked students with match details attached
 */
export function rankStudentsForProject(projectOrSkills, students = []) {
  const requiredSkills = Array.isArray(projectOrSkills)
    ? projectOrSkills
    : (projectOrSkills?.requiredSkills || []);

  const evaluated = students.map(student => {
    const match = calculateSkillMatch(requiredSkills, student.skills || []);
    return {
      ...student,
      student,
      match,
      matchDetails: match,
      calculatedScore: match.score,
    };
  });

  // Sort by calculated match score, highest first
  return evaluated.sort((a, b) => b.calculatedScore - a.calculatedScore);
}

