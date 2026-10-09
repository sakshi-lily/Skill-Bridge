// SkillBridge Comprehensive End-to-End Automated Test Suite (Step 9 & 10 Verification)
import http from 'http';

async function runTestSuite() {
  const baseURL = 'http://localhost:5000/api';
  console.log('===============================================================');
  console.log('🚀 SKILLBRIDGE AUTOMATED END-TO-END TEST & SECURITY SUITE');
  console.log(`📡 Target API: ${baseURL}`);
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`✅ [PASS] ${testName} ${details ? '— ' + details : ''}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName} ${details ? '— ' + details : ''}`);
      failed++;
    }
  }

  let studentToken = '';
  let facultyToken = '';

  // 1. Health Check & Security Headers
  try {
    const res = await fetch(`${baseURL}/health`);
    const data = await res.json();
    const nosniff = res.headers.get('x-content-type-options');
    const frameOptions = res.headers.get('x-frame-options');

    assert(res.status === 200 && data.status === 'ok', '1. System Health Check', `Service: ${data.service}`);
    assert(nosniff === 'nosniff' && frameOptions === 'SAMEORIGIN', '2. Security HTTP Headers', `X-Content-Type-Options: ${nosniff}, X-Frame-Options: ${frameOptions}`);
  } catch (err) {
    assert(false, '1 & 2. System Health & Headers', err.message);
  }

  // 3. User Registration Validation (Input validation check)
  try {
    const res = await fetch(`${baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'bad@test.edu' }), // missing name and password
    });
    assert(res.status === 400, '3. Registration Field Validation', 'Missing name and password rejected with 400');
  } catch (err) {
    assert(false, '3. Registration Field Validation', err.message);
  }

  // 4. Successful Registration & Password Sanitization
  try {
    const res = await fetch(`${baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Jamie Taylor',
        email: `jamie.${Date.now()}@stanford.edu`,
        password: 'password123',
        role: 'student',
        university: 'Stanford University',
        major: 'Computer Science',
        skills: ['React', 'Node.js', 'Tailwind CSS'],
      }),
    });
    const data = await res.json();
    assert(res.status === 201 && data.token && !data.user.password, '4. Student Registration', 'JWT issued, password hash sanitized');
  } catch (err) {
    assert(false, '4. Student Registration', err.message);
  }

  // 5. Student Login (Alex Morgan)
  try {
    const res = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'alex.morgan@stanford.edu',
        password: 'password123',
      }),
    });
    const data = await res.json();
    if (res.status === 200 && data.token) {
      studentToken = data.token;
      assert(true, '5. Student Authentication', `Logged in as ${data.user.name} (${data.user.role})`);
    } else {
      assert(false, '5. Student Authentication', data.message);
    }
  } catch (err) {
    assert(false, '5. Student Authentication', err.message);
  }

  // 6. Persistent Auth Profile Revalidation (/api/auth/me)
  try {
    const res = await fetch(`${baseURL}/auth/me`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const data = await res.json();
    assert(res.status === 200 && data.user.email === 'alex.morgan@stanford.edu', '6. Persistent Auth Profile (/api/auth/me)', `Verified email: ${data.user.email}`);
  } catch (err) {
    assert(false, '6. Persistent Auth Profile', err.message);
  }

  // 7. Update Student Profile
  try {
    const res = await fetch(`${baseURL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        bio: 'Updated bio for automated end-to-end verification test.',
        availability: '15-20 hrs/week',
      }),
    });
    const data = await res.json();
    assert(res.status === 200 && data.success, '7. Update Student Profile', 'Profile details updated');
  } catch (err) {
    assert(false, '7. Update Student Profile', err.message);
  }

  // 8. Password Reset Token Generation
  try {
    const res = await fetch(`${baseURL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'alex.morgan@stanford.edu' }),
    });
    const data = await res.json();
    assert(res.status === 200 && data.success, '8. Forgot Password Reset Token', data.message);
  } catch (err) {
    assert(false, '8. Forgot Password Reset Token', err.message);
  }

  // 9. Explore Projects Listing & Filters
  try {
    const res = await fetch(`${baseURL}/projects?category=Web+Development`);
    const data = await res.json();
    assert(res.status === 200 && Array.isArray(data.projects), '9. Explore Projects with Category Filter', `Loaded ${data.projects.length} matching projects`);
  } catch (err) {
    assert(false, '9. Explore Projects with Category Filter', err.message);
  }

  // 10. Server-Side Rule-Based Skill Matchmaking
  try {
    const res = await fetch(`${baseURL}/projects/career-guidance/matches`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const data = await res.json();
    const hasRankings = data.matches && data.matches.length > 0 && typeof data.matches[0].match.score === 'number';
    assert(res.status === 200 && hasRankings, '10. Server-Side Skill Matchmaking', `Evaluated candidates. Top score: ${data.matches[0].match.score}% for ${data.matches[0].student.name}`);
  } catch (err) {
    assert(false, '10. Server-Side Skill Matchmaking', err.message);
  }

  // 11. Project Squad Application Submission
  try {
    const res = await fetch(`${baseURL}/projects/career-guidance/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        role: 'Frontend Lead',
        note: 'Excited to contribute React & Tailwind UI components.',
      }),
    });
    const data = await res.json();
    assert(res.status === 200 || res.status === 201, '11. Project Squad Application', 'Application recorded');
  } catch (err) {
    assert(false, '11. Project Squad Application', err.message);
  }

  // 12. Teams Retrieval
  try {
    const res = await fetch(`${baseURL}/teams`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const data = await res.json();
    assert(res.status === 200 && Array.isArray(data.teams), '12. Teams Workspace Retrieval', `Loaded ${data.teams.length} active teams`);
  } catch (err) {
    assert(false, '12. Teams Workspace Retrieval', err.message);
  }

  // 13. Kanban Tasks Listing & Filtering
  try {
    const res = await fetch(`${baseURL}/tasks`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const data = await res.json();
    assert(res.status === 200 && Array.isArray(data.tasks), '13. Kanban Tasks Retrieval', `Loaded ${data.tasks.length} tasks`);
  } catch (err) {
    assert(false, '13. Kanban Tasks Retrieval', err.message);
  }

  // 14. Kanban Task Creation
  try {
    const res = await fetch(`${baseURL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        title: 'Run Automated E2E Regression Verification',
        description: 'Verify all backend endpoints, Socket.IO channels, and UI flows before deployment.',
        teamId: 'team-campuspulse',
        priority: 'High',
        status: 'In Progress',
        dueDate: '2026-10-18',
      }),
    });
    const data = await res.json();
    assert(res.status === 201 && data.task.title.includes('Regression'), '14. Task Creation with Due Date & Priority', `Task ID: ${data.task._id || data.task.id}`);
  } catch (err) {
    assert(false, '14. Task Creation', err.message);
  }

  // 15. Task Statistics Endpoint
  try {
    const res = await fetch(`${baseURL}/tasks/stats`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const data = await res.json();
    assert(res.status === 200 && data.stats.total !== undefined, '15. Task Analytics & Completion Rate', `Completion: ${data.stats.completionRate}%, Total: ${data.stats.total}`);
  } catch (err) {
    assert(false, '15. Task Analytics', err.message);
  }

  // 16. Chat History Retrieval
  try {
    const res = await fetch(`${baseURL}/chat/teams/team-campuspulse`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const data = await res.json();
    assert(res.status === 200 && Array.isArray(data.messages), '16. Team Chat History Retrieval', `Retrieved ${data.messages.length} messages`);
  } catch (err) {
    assert(false, '16. Team Chat History', err.message);
  }

  // 17. User Notifications & Unread Counter
  try {
    const res = await fetch(`${baseURL}/notifications`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const data = await res.json();
    assert(res.status === 200 && typeof data.unreadCount === 'number', '17. Notifications Center', `Unread count: ${data.unreadCount}`);
  } catch (err) {
    assert(false, '17. Notifications Center', err.message);
  }

  // 18. Notifications Mark-All-As-Read
  try {
    const res = await fetch(`${baseURL}/notifications/read-all`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const data = await res.json();
    assert(res.status === 200 && data.success, '18. Notifications Mark-All-As-Read', data.message);
  } catch (err) {
    assert(false, '18. Notifications Mark-All-As-Read', err.message);
  }

  // 19. Role Authorization: Reject Student from Faculty Portal
  try {
    const res = await fetch(`${baseURL}/faculty/dashboard`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert(res.status === 403, '19. Role-Based Access Control (RBAC)', 'Student correctly blocked from Faculty Portal with 403 Forbidden');
  } catch (err) {
    assert(false, '19. Role-Based Access Control', err.message);
  }

  // 20. Faculty Login (Prof. Davis)
  try {
    const res = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'prof.davis@stanford.edu',
        password: 'password123',
      }),
    });
    const data = await res.json();
    if (res.status === 200 && data.token) {
      facultyToken = data.token;
      assert(true, '20. Faculty Authentication', `Logged in as ${data.user.name} (${data.user.role})`);
    } else {
      assert(false, '20. Faculty Authentication', data.message);
    }
  } catch (err) {
    assert(false, '20. Faculty Authentication', err.message);
  }

  // 21. Faculty Oversight Dashboard Access
  try {
    const res = await fetch(`${baseURL}/faculty/dashboard`, {
      headers: { Authorization: `Bearer ${facultyToken}` },
    });
    const data = await res.json();
    assert(res.status === 200 && data.metrics && Array.isArray(data.teamsHealth), '21. Faculty Oversight Portal', `Teams analyzed: ${data.teamsHealth.length}, Completion: ${data.metrics.completionRate}%`);
  } catch (err) {
    assert(false, '21. Faculty Oversight Portal', err.message);
  }

  // 22. Shared Team Files Listing
  try {
    const res = await fetch(`${baseURL}/files/teams/team-campuspulse`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const data = await res.json();
    assert(res.status === 200 && Array.isArray(data.files), '22. Shared Team Deliverables Listing', `Loaded ${data.files.length} team documents`);
  } catch (err) {
    assert(false, '22. Shared Team Deliverables', err.message);
  }

  console.log('\n===============================================================');
  console.log(`📊 TEST SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED (Total: ${passed + failed})`);
  console.log('===============================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTestSuite();
