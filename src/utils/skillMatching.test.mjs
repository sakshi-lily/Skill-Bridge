import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeSkill,
  normalizeSkillsList,
  calculateSkillMatch,
  rankStudentsForProject,
} from './skillMatching.js';

describe('SkillBridge Skill-Matching Algorithm (Phase B & E Unit Tests)', () => {
  describe('normalizeSkill()', () => {
    it('should lower-case and trim string skills', () => {
      assert.equal(normalizeSkill('  Python  '), 'python');
      assert.equal(normalizeSkill('DOCKER'), 'docker');
    });

    it('should resolve framework and library aliases to canonical names', () => {
      assert.equal(normalizeSkill('react.js'), 'react');
      assert.equal(normalizeSkill('ReactJS'), 'react');
      assert.equal(normalizeSkill('nodejs'), 'node.js');
      assert.equal(normalizeSkill('node'), 'node.js');
      assert.equal(normalizeSkill('tailwind'), 'tailwind css');
      assert.equal(normalizeSkill('tailwindcss'), 'tailwind css');
      assert.equal(normalizeSkill('fast api'), 'fastapi');
      assert.equal(normalizeSkill('postgres'), 'postgresql');
      assert.equal(normalizeSkill('postgres sql'), 'postgresql');
      assert.equal(normalizeSkill('ml'), 'machine learning');
      assert.equal(normalizeSkill('ai'), 'artificial intelligence');
      assert.equal(normalizeSkill('ui/ux'), 'ui/ux design');
      assert.equal(normalizeSkill('ts'), 'typescript');
      assert.equal(normalizeSkill('js'), 'javascript');
    });

    it('should return empty string for non-string or falsy input', () => {
      assert.equal(normalizeSkill(null), '');
      assert.equal(normalizeSkill(undefined), '');
      assert.equal(normalizeSkill(''), '');
      assert.equal(normalizeSkill(123), '');
    });
  });

  describe('normalizeSkillsList()', () => {
    it('should deduplicate synonyms and aliases into canonical set', () => {
      const input = ['React', 'react.js', 'REACTJS', 'Node.js', 'nodejs'];
      const normalized = normalizeSkillsList(input);
      assert.deepEqual(normalized, ['react', 'node.js']);
    });

    it('should handle empty arrays or non-arrays gracefully', () => {
      assert.deepEqual(normalizeSkillsList([]), []);
      assert.deepEqual(normalizeSkillsList(null), []);
      assert.deepEqual(normalizeSkillsList(undefined), []);
    });
  });

  describe('calculateSkillMatch()', () => {
    it('should calculate 100% match score when student possesses all required skills', () => {
      const required = ['React', 'Node.js', 'Tailwind CSS'];
      const student = ['react.js', 'nodejs', 'TailwindCSS', 'MongoDB'];
      const result = calculateSkillMatch(required, student);

      assert.equal(result.score, 100);
      assert.equal(result.matchedCount, 3);
      assert.equal(result.totalRequired, 3);
      assert.equal(result.matchStrength, 'High');
      assert.equal(result.missingSkills.length, 0);
      assert.ok(result.explanation.includes('Perfect match'));
    });

    it('should calculate partial score with aliases (e.g., 2 of 4 = 50%)', () => {
      const required = ['React', 'Node.js', 'Docker', 'PostgreSQL'];
      const student = ['React', 'NodeJS', 'Python'];
      const result = calculateSkillMatch(required, student);

      assert.equal(result.score, 50);
      assert.equal(result.matchedCount, 2);
      assert.equal(result.totalRequired, 4);
      assert.equal(result.matchStrength, 'Moderate');
      assert.ok(result.matchedSkills.includes('react'));
      assert.ok(result.matchedSkills.includes('node.js'));
      assert.ok(result.missingSkills.includes('docker'));
      assert.ok(result.missingSkills.includes('postgresql'));
      assert.ok(result.explanation.includes('Matches 2 of 4'));
    });

    it('should calculate low score when fewer skills match (e.g. 1 of 5 = 20%)', () => {
      const required = ['Python', 'PyTorch', 'FastAPI', 'Docker', 'Kubernetes'];
      const student = ['python', 'JavaScript', 'HTML'];
      const result = calculateSkillMatch(required, student);

      assert.equal(result.score, 20);
      assert.equal(result.matchedCount, 1);
      assert.equal(result.totalRequired, 5);
      assert.equal(result.matchStrength, 'Low');
      assert.equal(result.missingSkills.length, 4);
    });

    it('should return 0% score when no required skills are possessed', () => {
      const required = ['Rust', 'WebAssembly'];
      const student = ['Figma', 'UI/UX Design'];
      const result = calculateSkillMatch(required, student);

      assert.equal(result.score, 0);
      assert.equal(result.matchedCount, 0);
      assert.equal(result.matchStrength, 'Low');
      assert.deepEqual(result.missingSkills, ['rust', 'webassembly']);
      assert.ok(result.explanation.includes('No required skills matched'));
    });

    it('should handle zero required skills safely without dividing by zero', () => {
      const required = [];
      const student = ['React', 'Python'];
      const result = calculateSkillMatch(required, student);

      assert.equal(result.score, 100);
      assert.equal(result.totalRequired, 0);
      assert.equal(result.matchStrength, 'High');
      assert.ok(result.explanation.includes('no specific technical prerequisites'));
    });
  });

  describe('rankStudentsForProject()', () => {
    it('should rank student candidates in strict descending order of match score', () => {
      const project = {
        title: 'AI Study Assistant',
        requiredSkills: ['Python', 'PyTorch', 'FastAPI', 'Docker'],
      };

      const students = [
        { id: '1', name: 'Low Match Student', skills: ['Python'] }, // 1/4 = 25%
        { id: '2', name: 'Perfect Match Student', skills: ['Python', 'pytorch', 'fast api', 'docker'] }, // 4/4 = 100%
        { id: '3', name: 'Moderate Match Student', skills: ['Python', 'fastapi'] }, // 2/4 = 50%
      ];

      const ranked = rankStudentsForProject(project, students);

      assert.equal(ranked[0].id, '2');
      assert.equal(ranked[0].calculatedScore, 100);

      assert.equal(ranked[1].id, '3');
      assert.equal(ranked[1].calculatedScore, 50);

      assert.equal(ranked[2].id, '1');
      assert.equal(ranked[2].calculatedScore, 25);
    });
  });
});
