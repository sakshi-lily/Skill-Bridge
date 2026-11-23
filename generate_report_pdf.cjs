const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

function getBase64Image(filename) {
  const filePath = path.join(__dirname, 'report_screenshots', filename);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    return `data:image/png;base64,${data.toString('base64')}`;
  }
  return '';
}

async function generatePDF() {
  console.log('Reading screenshots as base64...');
  const imgLanding = getBase64Image('01_landing_page.png');
  const imgLogin = getBase64Image('02_login_page.png');
  const imgDashboard = getBase64Image('03_dashboard.png');
  const imgProjects = getBase64Image('04_projects.png');
  const imgTeammates = getBase64Image('05_teammates.png');
  const imgTasks = getBase64Image('06_kanban_tasks.png');
  const imgFaculty = getBase64Image('07_faculty_dashboard.png');
  const imgMessages = getBase64Image('08_chat_messages.png');
  const imgProfile = getBase64Image('09_profile_page.png');

  console.log('Assembling report HTML content...');

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SkillBridge — Complete Project Analysis & Implementation Report</title>
  <style>
    @page {
      size: A4;
      margin: 16mm 14mm 18mm 14mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 10pt;
      line-height: 1.5;
      color: #24292e;
      background-color: #ffffff;
    }

    h1, h2, h3, h4, h5 {
      color: #404E3B;
      font-weight: 700;
      line-height: 1.25;
    }

    h1 {
      font-size: 20pt;
      border-bottom: 2.5px solid #7B9669;
      padding-bottom: 4px;
      margin-top: 20px;
      margin-bottom: 12px;
    }

    h2 {
      font-size: 14pt;
      border-left: 4px solid #7B9669;
      padding-left: 8px;
      margin-top: 16px;
      margin-bottom: 8px;
      color: #404E3B;
    }

    h3 {
      font-size: 11.5pt;
      margin-top: 12px;
      margin-bottom: 6px;
      color: #526844;
    }

    p {
      margin-bottom: 8px;
      text-align: justify;
    }

    ul, ol {
      margin-left: 20px;
      margin-bottom: 10px;
    }

    li {
      margin-bottom: 3px;
    }

    .page-break {
      page-break-after: always;
      break-after: page;
    }

    .no-break {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    /* Cover Page */
    .cover-page {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 30px 10px;
      page-break-after: always;
    }

    .cover-header {
      border-bottom: 4px solid #7B9669;
      padding-bottom: 20px;
    }

    .cover-badge {
      display: inline-block;
      background: #BAC8B1;
      color: #404E3B;
      font-size: 8.5pt;
      font-weight: 800;
      padding: 4px 14px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 15px;
    }

    .cover-title {
      font-size: 28pt;
      color: #404E3B;
      line-height: 1.15;
      font-weight: 800;
      margin-bottom: 10px;
    }

    .cover-subtitle {
      font-size: 13pt;
      color: #6C8480;
      font-weight: 600;
      line-height: 1.4;
      margin-bottom: 12px;
    }

    .cover-repo {
      display: inline-flex;
      align-items: center;
      background: #f5f7f3;
      border: 1px solid #BAC8B1;
      padding: 6px 12px;
      border-radius: 6px;
      font-family: monospace;
      font-size: 9pt;
      color: #404E3B;
      margin-top: 8px;
    }

    .cover-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin: 25px 0;
    }

    .cover-card {
      background: #fbfcfb;
      border: 1px solid #BAC8B1;
      border-radius: 8px;
      padding: 12px;
      box-shadow: 0 2px 4px rgba(123, 150, 105, 0.08);
    }

    .cover-card-title {
      font-size: 8pt;
      font-weight: 700;
      text-transform: uppercase;
      color: #7B9669;
      margin-bottom: 4px;
    }

    .cover-card-value {
      font-size: 11pt;
      font-weight: 700;
      color: #404E3B;
    }

    .cover-footer {
      border-top: 2px solid #E6E6E6;
      padding-top: 15px;
      font-size: 8.5pt;
      color: #6C8480;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    /* Table of Contents */
    .toc {
      background: #fdfdfd;
      border: 1px solid #E6E6E6;
      border-radius: 8px;
      padding: 16px 20px;
      margin-bottom: 20px;
    }

    .toc-item {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding: 4px 0;
      border-bottom: 1px dotted #BAC8B1;
      font-size: 9.5pt;
    }

    .toc-item-title {
      font-weight: 600;
      color: #404E3B;
    }

    .toc-item-desc {
      font-size: 8pt;
      color: #6C8480;
      margin-left: 10px;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0 16px 0;
      font-size: 8.5pt;
    }

    th, td {
      border: 1px solid #E6E6E6;
      padding: 6px 8px;
      text-align: left;
      vertical-align: top;
    }

    th {
      background-color: #404E3B;
      color: #ffffff;
      font-weight: 600;
      font-size: 8.5pt;
    }

    tr:nth-child(even) td {
      background-color: #fbfcfb;
    }

    /* Code blocks */
    pre, code {
      font-family: Consolas, "Liberation Mono", Menlo, Courier, monospace;
    }

    code {
      background-color: #f5f7f3;
      color: #404E3B;
      border: 1px solid #BAC8B1;
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 8.5pt;
    }

    pre {
      background-color: #182017;
      color: #f5f7f3;
      padding: 10px 12px;
      border-radius: 6px;
      font-size: 8pt;
      line-height: 1.35;
      overflow-x: auto;
      margin: 8px 0 12px 0;
      border-left: 3px solid #7B9669;
    }

    /* Callout Boxes */
    .callout {
      background: #f7f9f6;
      border-left: 4px solid #7B9669;
      padding: 8px 12px;
      margin: 10px 0;
      border-radius: 0 6px 6px 0;
      font-size: 9pt;
    }

    .callout-title {
      font-weight: 700;
      color: #404E3B;
      margin-bottom: 2px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .callout-viva {
      background: #fcf8f2;
      border-left: 4px solid #d97706;
      padding: 8px 12px;
      margin: 10px 0;
      border-radius: 0 6px 6px 0;
      font-size: 9pt;
    }

    .callout-viva .callout-title {
      color: #92400e;
    }

    /* Badges */
    .badge {
      display: inline-block;
      padding: 2px 7px;
      font-size: 7.5pt;
      font-weight: 700;
      border-radius: 9999px;
      text-transform: uppercase;
    }

    .badge-success {
      background: #e6f4ea;
      color: #137333;
      border: 1px solid #b7e1cd;
    }

    .badge-warning {
      background: #fef7e0;
      color: #b06000;
      border: 1px solid #fce8b2;
    }

    .badge-brand {
      background: #f5f7f3;
      color: #404E3B;
      border: 1px solid #BAC8B1;
    }

    /* Screenshots */
    .screenshot-container {
      margin: 12px 0 16px 0;
      border: 1px solid #E6E6E6;
      border-radius: 8px;
      overflow: hidden;
      background: #fbfcfb;
      box-shadow: 0 3px 8px rgba(0,0,0,0.06);
    }

    .screenshot-container img {
      width: 100%;
      height: auto;
      display: block;
      border-bottom: 1px solid #E6E6E6;
    }

    .screenshot-caption {
      padding: 6px 10px;
      font-size: 8pt;
      color: #6C8480;
      background: #f5f7f3;
      font-style: italic;
      text-align: center;
    }

    /* Diagrams */
    .diagram-box {
      border: 1px solid #BAC8B1;
      border-radius: 8px;
      background: #fafbfa;
      padding: 12px;
      margin: 12px 0;
      text-align: center;
    }

    .color-swatch-bar {
      display: flex;
      height: 18px;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 10px;
      border: 1px solid #d5d9d2;
    }

    .color-swatch {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 7pt;
      font-weight: 700;
      color: #fff;
    }
  </style>
</head>
<body>

  <!-- ==================== COVER PAGE ==================== -->
  <div class="cover-page">
    <div class="cover-header">
      <div class="cover-badge">Engineering Project Report &bull; Comprehensive System Defense</div>
      <h1 class="cover-title">SkillBridge</h1>
      <div class="cover-subtitle">Student Skill &amp; Project Matchmaking Platform</div>
      <p style="font-size: 10pt; color: #526844; margin-top: 5px; max-width: 90%;">
        A Full-Stack Campus Collaboration Ecosystem featuring Rule-Based Matchmaking, Agile Kanban Sprints, Real-Time Socket.IO Channels, and Faculty Oversight.
      </p>
      <div class="cover-repo">
        <strong>GitHub Repository:</strong>&nbsp;https://github.com/sakshi-lily/Skill-Bridge.git
      </div>
    </div>

    <!-- Theme Palette Bar -->
    <div>
      <div style="font-size: 7.5pt; font-weight: 700; color: #6C8480; text-transform: uppercase; margin-bottom: 3px;">
        Curated Signature Theme Palette
      </div>
      <div class="color-swatch-bar">
        <div class="color-swatch" style="background:#7B9669;">#7B9669 (Sage)</div>
        <div class="color-swatch" style="background:#6C8480;">#6C8480 (Slate)</div>
        <div class="color-swatch" style="background:#E6E6E6; color:#404E3B;">#E6E6E6 (Neutral)</div>
        <div class="color-swatch" style="background:#BAC8B1; color:#404E3B;">#BAC8B1 (Celadon)</div>
        <div class="color-swatch" style="background:#404E3B;">#404E3B (Forest)</div>
      </div>
    </div>

    <div class="cover-grid">
      <div class="cover-card">
        <div class="cover-card-title">Frontend Architecture</div>
        <div class="cover-card-value">React 19 + Vite 8</div>
        <p style="font-size: 7.5pt; color: #6C8480; margin-top: 3px;">Tailwind CSS 3, SPA Routing, Dark Mode</p>
      </div>
      <div class="cover-card">
        <div class="cover-card-title">Backend Runtime</div>
        <div class="cover-card-value">Node.js + Express 4</div>
        <p style="font-size: 7.5pt; color: #6C8480; margin-top: 3px;">Socket.IO, JWT Auth, RBAC, Rate-Limiting</p>
      </div>
      <div class="cover-card">
        <div class="cover-card-title">Database &amp; Resilience</div>
        <div class="cover-card-value">MongoDB + Standby</div>
        <p style="font-size: 7.5pt; color: #6C8480; margin-top: 3px;">Mongoose 8 Schemas + Dual-Mode Fallback</p>
      </div>
    </div>

    <div class="cover-grid" style="margin-top: 0;">
      <div class="cover-card">
        <div class="cover-card-title">Match Engine</div>
        <div class="cover-card-value">Deterministic Rule-Based</div>
        <p style="font-size: 7.5pt; color: #6C8480; margin-top: 3px;">Normalized Canonical Aliases + Intersection</p>
      </div>
      <div class="cover-card">
        <div class="cover-card-title">Test Verification</div>
        <div class="cover-card-value">22 / 22 Passed (100%)</div>
        <p style="font-size: 7.5pt; color: #6C8480; margin-top: 3px;">Automated E2E Suite, Zero Failures</p>
      </div>
      <div class="cover-card">
        <div class="cover-card-title">Academic Edition</div>
        <div class="cover-card-value">College Viva Defense</div>
        <p style="font-size: 7.5pt; color: #6C8480; margin-top: 3px;">Step-by-Step Viva Explanation &amp; Flowcharts</p>
      </div>
    </div>

    <div class="cover-footer">
      <div>
        <strong>Author / Project Lead:</strong> Sakshi<br>
        <strong>Academic Context:</strong> Capstone / Major Project Defense (November 2026)<br>
        <strong>Documentation Scope:</strong> Phase 1 Baseline &rarr; Phase 2 Full-Stack Delivery
      </div>
      <div style="text-align: right;">
        <span class="badge badge-success">Production Ready</span><br>
        <span style="font-size: 7.5pt; color: #6C8480;">Generated directly from working codebase</span>
      </div>
    </div>
  </div>

  <!-- ==================== TABLE OF CONTENTS ==================== -->
  <h1>Table of Contents</h1>
  <div class="toc">
    <div class="toc-item">
      <div><span class="toc-item-title">1. Executive Project Overview</span><span class="toc-item-desc">&bull; Problem Statement, Objectives, User Personas, Core Value Proposition</span></div>
      <div><strong>Page 3</strong></div>
    </div>
    <div class="toc-item">
      <div><span class="toc-item-title">2. Complete Technology Stack &amp; Architecture</span><span class="toc-item-desc">&bull; Frontend, Backend, Database, Security, Real-Time &amp; Deployment</span></div>
      <div><strong>Page 5</strong></div>
    </div>
    <div class="toc-item">
      <div><span class="toc-item-title">3. Comprehensive Frontend Implementation</span><span class="toc-item-desc">&bull; Route Catalog, Context Stores, Interactive Dashboards, Actual Screenshots</span></div>
      <div><strong>Page 7</strong></div>
    </div>
    <div class="toc-item">
      <div><span class="toc-item-title">4. Backend &amp; RESTful API Implementation</span><span class="toc-item-desc">&bull; Architecture, Middleware Pipeline, Complete 24+ Endpoint Catalog, RBAC</span></div>
      <div><strong>Page 12</strong></div>
    </div>
    <div class="toc-item">
      <div><span class="toc-item-title">5. Database Schema &amp; Data Layer Architecture</span><span class="toc-item-desc">&bull; MongoDB Collections, Mongoose Relationships, Compound Indexes, Standby Resilience</span></div>
      <div><strong>Page 15</strong></div>
    </div>
    <div class="toc-item">
      <div><span class="toc-item-title">6. Smart Skill-Matching Algorithm Deep Dive</span><span class="toc-item-desc">&bull; Alias Normalization, Jaccard Intersection Math, Viva: Rule-Based vs AI/ML</span></div>
      <div><strong>Page 18</strong></div>
    </div>
    <div class="toc-item">
      <div><span class="toc-item-title">7. End-to-End System Workflows &amp; Architecture Diagrams</span><span class="toc-item-desc">&bull; Auth Flow, Matchmaking Flow, Kanban Sprint Lifecycle, Faculty Oversight</span></div>
      <div><strong>Page 21</strong></div>
    </div>
    <div class="toc-item">
      <div><span class="toc-item-title">8. Current Implementation Status Matrix</span><span class="toc-item-desc">&bull; Feature-by-Feature Working Status, Verified Files, Pending Work</span></div>
      <div><strong>Page 24</strong></div>
    </div>
    <div class="toc-item">
      <div><span class="toc-item-title">9. Verification, Test Results &amp; Real Limitations</span><span class="toc-item-desc">&bull; 22-Point Automated Test Suite, Tested Endpoints, Honest Current Constraints</span></div>
      <div><strong>Page 26</strong></div>
    </div>
    <div class="toc-item">
      <div><span class="toc-item-title">10. Evolutionary Analysis: Phase 1 vs Phase 2</span><span class="toc-item-desc">&bull; Baseline Comparison, What Was Added, Architecture Maturity</span></div>
      <div><strong>Page 28</strong></div>
    </div>
    <div class="toc-item">
      <div><span class="toc-item-title">11. Future Roadmap &amp; College Viva Defense Guide</span><span class="toc-item-desc">&bull; Phase 3 Improvements, 15 Viva Defense Questions &amp; Model Answers</span></div>
      <div><strong>Page 30</strong></div>
    </div>
  </div>

  <div class="callout">
    <div class="callout-title">📌 Viva Preparation Note for the Student</div>
    This document is authored based on the actual, verified codebase of SkillBridge. You can confidently reference all file paths, mathematical formulas, Mongoose schemas, and test results during your project viva examination.
  </div>

  <div class="page-break"></div>

  <!-- ==================== CHAPTER 1 ==================== -->
  <h1>1. Executive Project Overview</h1>

  <h2>1.1 What is SkillBridge?</h2>
  <p>
    <strong>SkillBridge</strong> is an enterprise-ready, full-stack campus collaboration platform engineered specifically for university students, hackathon participants, and faculty advisors. It bridges the critical gap between students with complementary talents (e.g., frontend engineering, backend architecture, machine learning, and UI/UX design) and project initiatives (course capstones, hackathon submissions, and student startup ventures).
  </p>
  <p>
    Unlike conventional project management tools (like Jira or Trello) which assume pre-existing teams, or general messaging apps (like Discord or WhatsApp) which lack structured task and milestone tracking, SkillBridge integrates <em>matchmaking, agile task coordination, real-time communication, and academic mentorship</em> into one cohesive platform.
  </p>

  <h2>1.2 The Problem SkillBridge Solves</h2>
  <p>
    Across university campuses globally, students encounter four universal bottlenecks when undertaking collaborative projects:
  </p>
  <ul>
    <li><strong>The Collaboration Silo Problem:</strong> Computer science students frequently lack UI/UX designers; design students lack backend engineers; and business/domain students cannot find technical builders. Students are forced to post unorganized messages on Discord, Telegram, or WhatsApp, hoping for serendipitous matches.</li>
    <li><strong>Skill Mismatch &amp; Asymmetry:</strong> Students often discover mid-project that their teammate does not possess the required proficiency (e.g., claiming full-stack capability but knowing only basic HTML), leading to project failure or abandoned repositories.</li>
    <li><strong>Accountability Vacuum &amp; Ghosting:</strong> Without structured milestone tracking and role-assigned deliverables, teammates frequently "ghost" their squads right before submission deadlines.</li>
    <li><strong>Lack of Academic Oversight:</strong> Faculty mentors and professors only see student projects during final presentations, having zero visibility into team health, sprint velocity, or internal squad dysfunction until it is too late to intervene.</li>
  </ul>

  <h2>1.3 Main Project Objectives</h2>
  <p>
    The SkillBridge platform was engineered to achieve four measurable objectives:
  </p>
  <ol>
    <li><strong>Objective 1: Transparent, Rule-Based Matchmaking:</strong> Deliver a deterministic algorithm that evaluates student skills against project prerequisites and calculates a mathematically verifiable compatibility percentage with clear explanations of matched and missing skills.</li>
    <li><strong>Objective 2: Agile Sprint &amp; Kanban Execution:</strong> Provide student squads with an intuitive Kanban task board featuring priority tiers, due date countdowns, status transitions (<code>To Do</code> &rarr; <code>In Progress</code> &rarr; <code>Completed</code>), and completion analytics.</li>
    <li><strong>Objective 3: Real-Time Team Communication:</strong> Supply isolated, secure Socket.IO chat rooms for team collaboration and instant Web-Socket notifications for application reviews and task updates.</li>
    <li><strong>Objective 4: Faculty Mentorship Portal:</strong> Equip professors and advisors with role-protected analytical dashboards that automatically diagnose at-risk squads and monitor campus-wide skill distributions.</li>
  </ol>

  <h2>1.4 Target User Personas</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 20%;">User Role</th>
        <th style="width: 25%;">Primary Pain Point</th>
        <th style="width: 35%;">Key Platform Capabilities</th>
        <th style="width: 20%;">RBAC Permissions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Student Builder / Hacker</strong></td>
        <td>Cannot find complementary peers; tired of teammates abandoning work.</td>
        <td>Builds verified skill profile, searches open projects, receives match scores, joins teams, manages assigned tasks, chats in real-time.</td>
        <td><code>role: 'student'</code><br>Can access all student routes.</td>
      </tr>
      <tr>
        <td><strong>Project Lead / Founder</strong></td>
        <td>Has project vision or hackathon idea but lacks specific roles.</td>
        <td>Creates projects, specifies required tech stacks, evaluates ranked candidates, sends squad invites, assigns Kanban tasks.</td>
        <td><code>role: 'student'</code><br>Team lead privileges.</td>
      </tr>
      <tr>
        <td><strong>Faculty Advisor / Mentor</strong></td>
        <td>Zero visibility into capstone progress until final deadline.</td>
        <td>Inspects campus cohorts, monitors team sprint progress, reviews health diagnostics, flags stalled squads for academic intervention.</td>
        <td><code>role: 'faculty'</code><br>Access to <code>/faculty</code> portal.</td>
      </tr>
      <tr>
        <td><strong>Platform Administrator</strong></td>
        <td>Campus-wide compliance, safety, and system health oversight.</td>
        <td>Monitors system uptime, sanitizes inappropriate content, manages user privileges, oversees cross-campus databases.</td>
        <td><code>role: 'admin'</code><br>Unrestricted platform access.</td>
      </tr>
    </tbody>
  </table>

  <h2>1.5 High-Level Application Architecture</h2>
  <div class="diagram-box no-break">
    <div style="font-size: 8.5pt; font-weight: 700; color: #404E3B; margin-bottom: 8px;">
      Figure 1.1: SkillBridge End-to-End System Architecture
    </div>
    <svg viewBox="0 0 760 220" style="width: 100%; max-height: 220px; font-family: sans-serif;">
      <!-- Client Tier -->
      <rect x="10" y="20" width="220" height="180" rx="8" fill="#f5f7f3" stroke="#7B9669" stroke-width="2"/>
      <text x="120" y="42" font-size="11" font-weight="bold" fill="#404E3B" text-anchor="middle">CLIENT TIER (React 19 + Vite)</text>
      <rect x="25" y="55" width="190" height="28" rx="4" fill="#ffffff" stroke="#BAC8B1"/>
      <text x="120" y="73" font-size="9" fill="#24292e" text-anchor="middle">Public Landing &amp; Auth (JWT State)</text>
      <rect x="25" y="90" width="190" height="28" rx="4" fill="#ffffff" stroke="#BAC8B1"/>
      <text x="120" y="108" font-size="9" fill="#24292e" text-anchor="middle">Student Dashboard &amp; Kanban Board</text>
      <rect x="25" y="125" width="190" height="28" rx="4" fill="#ffffff" stroke="#BAC8B1"/>
      <text x="120" y="143" font-size="9" fill="#24292e" text-anchor="middle">Projects &amp; Matchmaking Discovery</text>
      <rect x="25" y="160" width="190" height="28" rx="4" fill="#ffffff" stroke="#BAC8B1"/>
      <text x="120" y="178" font-size="9" fill="#24292e" text-anchor="middle">Socket.IO Live Chat &amp; Alerts</text>

      <!-- Communication Arrows -->
      <path d="M 230 85 L 290 85" stroke="#7B9669" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="260" y="78" font-size="7.5" fill="#6C8480" text-anchor="middle">REST (Bearer JWT)</text>
      
      <path d="M 230 145 L 290 145" stroke="#6C8480" stroke-width="2" stroke-dasharray="4,3"/>
      <text x="260" y="138" font-size="7.5" fill="#6C8480" text-anchor="middle">WebSocket (WSS)</text>

      <!-- Application Tier -->
      <rect x="290" y="20" width="220" height="180" rx="8" fill="#f5f7f3" stroke="#404E3B" stroke-width="2"/>
      <text x="400" y="42" font-size="11" font-weight="bold" fill="#404E3B" text-anchor="middle">APPLICATION TIER (Express 4)</text>
      <rect x="305" y="55" width="190" height="28" rx="4" fill="#ffffff" stroke="#BAC8B1"/>
      <text x="400" y="73" font-size="9" fill="#24292e" text-anchor="middle">Auth &amp; RBAC Guard Middleware</text>
      <rect x="305" y="90" width="190" height="28" rx="4" fill="#ffffff" stroke="#BAC8B1"/>
      <text x="400" y="108" font-size="9" fill="#24292e" text-anchor="middle">Rule-Based Matchmaking Engine</text>
      <rect x="305" y="125" width="190" height="28" rx="4" fill="#ffffff" stroke="#BAC8B1"/>
      <text x="400" y="143" font-size="9" fill="#24292e" text-anchor="middle">Kanban Task &amp; Sprint Controllers</text>
      <rect x="305" y="160" width="190" height="28" rx="4" fill="#ffffff" stroke="#BAC8B1"/>
      <text x="400" y="178" font-size="9" fill="#24292e" text-anchor="middle">Socket.IO Rooms &amp; Multer Engine</text>

      <!-- Data Arrows -->
      <path d="M 510 110 L 570 110" stroke="#404E3B" stroke-width="2"/>
      <text x="540" y="102" font-size="7.5" fill="#6C8480" text-anchor="middle">Mongoose 8</text>

      <!-- Data Tier -->
      <rect x="570" y="20" width="180" height="180" rx="8" fill="#f5f7f3" stroke="#6C8480" stroke-width="2"/>
      <text x="660" y="42" font-size="11" font-weight="bold" fill="#404E3B" text-anchor="middle">DATA TIER (Dual-Mode)</text>
      <rect x="585" y="55" width="150" height="36" rx="4" fill="#ffffff" stroke="#BAC8B1"/>
      <text x="660" y="71" font-size="9" font-weight="bold" fill="#137333" text-anchor="middle">MongoDB Atlas</text>
      <text x="660" y="83" font-size="7.5" fill="#6C8480" text-anchor="middle">Primary Cloud Cluster</text>
      <rect x="585" y="100" width="150" height="36" rx="4" fill="#ffffff" stroke="#BAC8B1"/>
      <text x="660" y="116" font-size="9" font-weight="bold" fill="#b06000" text-anchor="middle">Standby Resilience</text>
      <text x="660" y="128" font-size="7.5" fill="#6C8480" text-anchor="middle">Memory/Mock Evaluation</text>
      <rect x="585" y="145" width="150" height="36" rx="4" fill="#ffffff" stroke="#BAC8B1"/>
      <text x="660" y="161" font-size="9" font-weight="bold" fill="#404E3B" text-anchor="middle">Local Uploads Hub</text>
      <text x="660" y="173" font-size="7.5" fill="#6C8480" text-anchor="middle">Multer Deliverables Storage</text>
    </svg>
  </div>

  <div class="page-break"></div>

  <!-- ==================== CHAPTER 2 ==================== -->
  <h1>2. Complete Technology Stack &amp; Architecture</h1>

  <h2>2.1 Full Technology Stack Matrix</h2>
  <p>
    SkillBridge avoids bloated third-party abstractions. Every package included in <code>package.json</code> and <code>server/package.json</code> serves an explicit, architectural purpose.
  </p>

  <table>
    <thead>
      <tr>
        <th style="width: 18%;">Layer</th>
        <th style="width: 25%;">Technology &amp; Version</th>
        <th style="width: 32%;">Role in SkillBridge</th>
        <th style="width: 25%;">Why It Was Chosen</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Frontend Framework</strong></td>
        <td><strong>React 19.2</strong></td>
        <td>Declarative UI component hierarchy, hooks state (<code>useState</code>, <code>useContext</code>, <code>useMemo</code>, <code>useEffect</code>).</td>
        <td>High-performance rendering, concurrent capabilities, modern React standard.</td>
      </tr>
      <tr>
        <td><strong>Frontend Build Tool</strong></td>
        <td><strong>Vite 8.3</strong></td>
        <td>Development server with instantaneous Hot Module Replacement (HMR) and optimized Rolldown production bundling.</td>
        <td>Sub-second development reloads compared to legacy Webpack; compiles 1,999 modules in 11.3s.</td>
      </tr>
      <tr>
        <td><strong>Client-Side Routing</strong></td>
        <td><strong>React Router DOM 7.18</strong></td>
        <td>Multi-page Single Page Application (SPA) routing, protected routes, parameter extraction (<code>useParams</code>).</td>
        <td>Industry standard for nested layouts and auth-based route redirection.</td>
      </tr>
      <tr>
        <td><strong>Styling &amp; Design System</strong></td>
        <td><strong>Tailwind CSS 3.4</strong> + PostCSS</td>
        <td>Utility-first CSS, responsive grid layouts, custom curated Sage &amp; Forest color tokens, and Dark Mode.</td>
        <td>Eliminates CSS file bloat; guarantees consistent spacing, depth shadows, and visual cohesion.</td>
      </tr>
      <tr>
        <td><strong>Iconography</strong></td>
        <td><strong>Lucide React 1.54</strong></td>
        <td>Clean, scalable SVG UI icons across navigation, cards, priority indicators, and modals.</td>
        <td>Lightweight tree-shakeable icons matching modern Figma design guidelines.</td>
      </tr>
      <tr>
        <td><strong>Backend Runtime</strong></td>
        <td><strong>Node.js 22 (ESM)</strong></td>
        <td>Server-side runtime with native ECMAScript Modules (<code>"type": "module"</code>), <code>import/export</code> syntax.</td>
        <td>Unified JavaScript ecosystem across client and server; asynchronous non-blocking event loop.</td>
      </tr>
      <tr>
        <td><strong>REST API Server</strong></td>
        <td><strong>Express.js 4.21</strong></td>
        <td>HTTP routing, JSON request parsing, middleware chaining, and centralized error handling.</td>
        <td>Minimalist, proven, highly extensible web framework for RESTful microservices.</td>
      </tr>
      <tr>
        <td><strong>Real-Time Communication</strong></td>
        <td><strong>Socket.IO 4.8</strong> (Server &amp; Client)</td>
        <td>Bidirectional WebSocket channels for team chat rooms (<code>team_{id}</code>) and live user alerts (<code>user_{id}</code>).</td>
        <td>Automatic reconnection, room isolation, and graceful fallback to long-polling if WebSockets are blocked.</td>
      </tr>
      <tr>
        <td><strong>Database &amp; ODM</strong></td>
        <td><strong>MongoDB Atlas + Mongoose 8.9</strong></td>
        <td>Document database and Object Data Modeling (ODM) with strongly typed schemas and compound indexes.</td>
        <td>Flexible JSON documents for hierarchical profiles, skills arrays, and nested team memberships.</td>
      </tr>
      <tr>
        <td><strong>Authentication</strong></td>
        <td><strong>JSON Web Tokens (JWT 9.0)</strong></td>
        <td>Stateless authorization; Bearer tokens passed via <code>Authorization</code> HTTP header with 30-day expiry.</td>
        <td>No server-side session state required; seamless scalability across distributed servers.</td>
      </tr>
      <tr>
        <td><strong>Password Security</strong></td>
        <td><strong>bcryptjs 2.4</strong></td>
        <td>Adaptive one-way cryptographic hashing of user passwords with a salt work factor of 10.</td>
        <td>Guarantees resistance against rainbow table attacks; plaintext passwords are never stored.</td>
      </tr>
      <tr>
        <td><strong>File Upload Engine</strong></td>
        <td><strong>Multer 1.4</strong></td>
        <td>Multi-part form data processing for project deliverables and student avatars.</td>
        <td>Streaming disk storage with strict 10MB limit and MIME type whitelisting.</td>
      </tr>
      <tr>
        <td><strong>Security &amp; Rate-Limiting</strong></td>
        <td><strong>express-rate-limit 7.5</strong></td>
        <td>Protects authentication endpoints against brute-force dictionary attacks (10 attempts / 15 mins).</td>
        <td>Shields server against denial-of-service and automated credential stuffing.</td>
      </tr>
    </tbody>
  </table>

  <h2>2.2 Architectural Highlights &amp; Standby Resilience</h2>
  <p>
    A key engineering differentiator of SkillBridge is its <strong>Dual-Mode Resilient Database Architecture</strong> in <code>server/config/db.js</code>:
  </p>
  <pre>
// server/config/db.js
mongoose.set('bufferCommands', false); // Prevents 30-second hanging timeouts if MongoDB is offline

if (!uri) {
  console.warn('⚠️ [Database Warning]: MONGODB_URI is not defined.');
  console.warn('ℹ️ Running in Memory/Mock-compatible mode for safe local evaluation.');
  return false;
}</pre>
  <p>
    When MongoDB Atlas credentials are provided, SkillBridge connects seamlessly to cloud collections. If credentials are unset or the cloud cluster is unreachable, <em>the platform automatically falls back to an in-memory/mock evaluation layer</em>. This ensures the frontend, Kanban board, chat rooms, and automated test suite function flawlessly during local viva demonstrations without database dependency bottlenecks.
  </p>

  <div class="page-break"></div>

  <!-- ==================== CHAPTER 3 ==================== -->
  <h1>3. Frontend Implementation &amp; UI Inspection</h1>

  <h2>3.1 Client-Side State Management</h2>
  <p>
    SkillBridge utilizes React's native Context API, separated into three distinct domains located in <code>src/context/</code>:
  </p>
  <ul>
    <li><strong><code>AuthContext.jsx</code>:</strong> Manages persistent JWT authentication, token storage in <code>localStorage</code>, active user profile state, live Socket.IO connection lifecycle, and quick demo user switching.</li>
    <li><strong><code>ProjectsContext.jsx</code>:</strong> Centralized store for project initiatives. Connects with <code>/api/projects</code> to fetch live listings, supports category/mode filtering, handles project creation, and synchronizes application submissions.</li>
    <li><strong><code>TeamTaskContext.jsx</code>:</strong> Orchestrates team squad operations, active team selection, Kanban board tasks (status transitions, priority toggling, task creation), and member role updates.</li>
  </ul>

  <h2>3.2 Route &amp; Page Catalog</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 22%;">Route Path</th>
        <th style="width: 25%;">Page Component</th>
        <th style="width: 18%;">Protection Level</th>
        <th style="width: 35%;">Key UI Functionality &amp; Interactions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>/</code></td>
        <td><code>LandingPage.jsx</code></td>
        <td>Public</td>
        <td>Interactive hero section, live match preview widget, 3 impact statistics cards, feature highlights, step-by-step guide, and CTA banner.</td>
      </tr>
      <tr>
        <td><code>/login</code></td>
        <td><code>LoginPage.jsx</code></td>
        <td>Public (Guest)</td>
        <td>Email/password inputs, validation, JWT handling, and 4 one-click demo persona buttons (Student Alex, Student Sarah, Student David, Faculty Marcus).</td>
      </tr>
      <tr>
        <td><code>/signup</code></td>
        <td><code>SignUpPage.jsx</code></td>
        <td>Public (Guest)</td>
        <td>Full student registration form: name, university email, academic program, graduation year, technical skills tag picker, and password.</td>
      </tr>
      <tr>
        <td><code>/forgot-password</code></td>
        <td><code>ForgotPasswordPage.jsx</code></td>
        <td>Public (Guest)</td>
        <td>Generates a single-use 10-minute reset token for self-service password recovery.</td>
      </tr>
      <tr>
        <td><code>/dashboard</code></td>
        <td><code>DashboardOverview.jsx</code></td>
        <td>Student Protected</td>
        <td>Comprehensive student portal: overview metrics (active projects, pending tasks, team count), quick actions, recommended matches, and sprint activities.</td>
      </tr>
      <tr>
        <td><code>/projects</code></td>
        <td><code>ExploreProjectsPage.jsx</code></td>
        <td>Student Protected</td>
        <td>Project catalog with live search, domain filters (AI/ML, Web, Mobile, Hardware), difficulty badges (Beginner, Intermediate, Advanced), and detail links.</td>
      </tr>
      <tr>
        <td><code>/projects/create</code></td>
        <td><code>CreateProjectPage.jsx</code></td>
        <td>Student Protected</td>
        <td>Multi-step project authoring form: title, category, detailed roadmap, required roles, open vacancies, and interactive required skills tagger.</td>
      </tr>
      <tr>
        <td><code>/projects/:id</code></td>
        <td><code>ProjectDetailsPage.jsx</code></td>
        <td>Student Protected</td>
        <td>Project overview, milestones, open squad roles, owner details, team roster, and the interactive <strong>Rule-Based Skill Match Breakdown card</strong>.</td>
      </tr>
      <tr>
        <td><code>/my-projects</code></td>
        <td><code>MyProjectsPage.jsx</code></td>
        <td>Student Protected</td>
        <td>Categorized portfolio displaying: (1) Projects I Lead, (2) Teams I Joined, and (3) Applications Submitted with live status indicators.</td>
      </tr>
      <tr>
        <td><code>/teammates</code></td>
        <td><code>TeammatesPage.jsx</code></td>
        <td>Student Protected</td>
        <td>Candidate discovery hub with calculated match percentages, compatibility pills, profile modals, and instant team invitation triggers.</td>
      </tr>
      <tr>
        <td><code>/tasks</code></td>
        <td><code>TasksPage.jsx</code></td>
        <td>Student Protected</td>
        <td>Interactive Agile Kanban Board with 3 status columns (<code>To Do</code>, <code>In Progress</code>, <code>Completed</code>), priority flags, due dates, and completion metrics.</td>
      </tr>
      <tr>
        <td><code>/teams</code></td>
        <td><code>TeamsPage.jsx</code></td>
        <td>Student Protected</td>
        <td>Squad workspace directory: active teams, team members with assigned roles, sprint progress bars, and team creation modal.</td>
      </tr>
      <tr>
        <td><code>/teams/:id</code></td>
        <td><code>TeamDetailsPage.jsx</code></td>
        <td>Student Protected</td>
        <td>Full squad hub integrating member management, role editor, leave team confirmation modal, and the <code>TeamFileManager</code> for shared deliverables.</td>
      </tr>
      <tr>
        <td><code>/messages</code></td>
        <td><code>MessagesPage.jsx</code></td>
        <td>Student Protected</td>
        <td>Real-time collaborative chat rooms isolated by team ID; shows active members, message bubbles, timestamps, and live incoming socket updates.</td>
      </tr>
      <tr>
        <td><code>/notifications</code></td>
        <td><code>NotificationsPage.jsx</code></td>
        <td>Student Protected</td>
        <td>Live notifications center: team invitations, squad application responses, task assignments, and one-click "Mark All as Read".</td>
      </tr>
      <tr>
        <td><code>/profile</code></td>
        <td><code>ProfilePage.jsx</code></td>
        <td>Student Protected</td>
        <td>Interactive builder profile: add/remove verified skill tags, edit bio, set weekly availability hours, link GitHub/portfolio, and persist updates.</td>
      </tr>
      <tr>
        <td><code>/faculty</code></td>
        <td><code>FacultyDashboardPage.jsx</code></td>
        <td>Faculty / Admin Only</td>
        <td>Academic oversight portal: student squad health diagnostics, completion rates, at-risk project alerts, and campus-wide skill distributions.</td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <h2>3.3 Application Visual Inspection &amp; Actual Screenshots</h2>
  <p>
    The following figures show actual rendered screenshots of the SkillBridge platform captured from the live local execution environment, showcasing the signature Sage, Celadon, and Forest green design identity.
  </p>

  <div class="screenshot-container no-break">
    <img src="${imgLanding}" alt="Landing Page">
    <div class="screenshot-caption">Figure 3.1: SkillBridge Public Landing Page — Hero Section, Live Compatibility Preview &amp; Curated Sage Green Palette</div>
  </div>

  <div class="screenshot-container no-break">
    <img src="${imgLogin}" alt="Login Page">
    <div class="screenshot-caption">Figure 3.2: Sign In Page (/login) — Includes 4 One-Click Demo Personas for Instant Examination Defense</div>
  </div>

  <div class="page-break"></div>

  <div class="screenshot-container no-break">
    <img src="${imgDashboard}" alt="Dashboard Page">
    <div class="screenshot-caption">Figure 3.3: Student Dashboard Overview (/dashboard) — Key Metrics, Active Initiatives, and Quick Match Actions</div>
  </div>

  <div class="screenshot-container no-break">
    <img src="${imgProjects}" alt="Projects Page">
    <div class="screenshot-caption">Figure 3.4: Project Discovery Catalog (/projects) — Live Domain Categorization, Difficulty Tags &amp; Open Roles</div>
  </div>

  <div class="page-break"></div>

  <div class="screenshot-container no-break">
    <img src="${imgTeammates}" alt="Teammates Page">
    <div class="screenshot-caption">Figure 3.5: Smart Teammates Discovery (/teammates) — Rule-Based Compatibility Scores, Skills Breakdown &amp; Direct Invites</div>
  </div>

  <div class="screenshot-container no-break">
    <img src="${imgTasks}" alt="Kanban Tasks Page">
    <div class="screenshot-caption">Figure 3.6: Agile Sprint Kanban Board (/tasks) — To Do, In Progress, and Completed Columns with Due Date Trackers</div>
  </div>

  <div class="page-break"></div>

  <div class="screenshot-container no-break">
    <img src="${imgMessages}" alt="Messages Page">
    <div class="screenshot-caption">Figure 3.7: Real-Time Team Chat (/messages) — Socket.IO Room Messaging with Isolated Team Channels &amp; Live Indicator</div>
  </div>

  <div class="screenshot-container no-break">
    <img src="${imgFaculty}" alt="Faculty Dashboard Page">
    <div class="screenshot-caption">Figure 3.8: Faculty Oversight Portal (/faculty) — Role-Protected Academic Supervision, Squad Health &amp; Intervention Flags</div>
  </div>

  <div class="page-break"></div>

  <!-- ==================== CHAPTER 4 ==================== -->
  <h1>4. Backend &amp; RESTful API Implementation</h1>

  <h2>4.1 Backend Architecture &amp; Folder Organization</h2>
  <p>
    The SkillBridge backend follows the enterprise <strong>Controller-Service-Repository Pattern</strong> in <code>server/</code>. Business logic, route handling, authentication checks, and database operations are strictly decoupled:
  </p>
  <pre>
server/
├── config/db.js          # MongoDB connection pool & non-blocking standby fallback
├── controllers/          # Request handlers containing domain business logic
├── middleware/
│   ├── auth.js           # JWT verification (protect) & role authorization (authorize)
│   ├── errorHandler.js   # Centralized error responder with proper HTTP status codes
│   ├── rateLimiter.js    # express-rate-limit instances for authentication routes
│   └── upload.js         # Multer configuration for file size & MIME type validation
├── models/               # Mongoose schemas with compound indexes & validation rules
├── routes/               # Express Router declarations mapping endpoints to controllers
├── services/             # Socket.IO event broadcasters & notification delivery bridges
├── utils/                # Canonical skill matching algorithms and test seed data
├── server.js             # HTTP server bootstrap, security headers, Socket.IO & graceful shutdown
└── test_runner.mjs       # Automated 22-test integration verification suite</pre>

  <h2>4.2 Complete API Endpoint Reference Catalog</h2>
  <p>
    SkillBridge implements <strong>24 REST endpoints</strong> and <strong>2 real-time Socket.IO channels</strong>, fully implemented and tested in the codebase:
  </p>

  <table>
    <thead>
      <tr>
        <th style="width: 8%;">Method</th>
        <th style="width: 28%;">Endpoint URI</th>
        <th style="width: 16%;">Auth Level</th>
        <th style="width: 28%;">Request Body / Query Params</th>
        <th style="width: 20%;">Response / Action</th>
      </tr>
    </thead>
    <tbody>
      <!-- Health -->
      <tr>
        <td><span class="badge badge-brand">GET</span></td>
        <td><code>/api/health</code></td>
        <td>Public</td>
        <td>None</td>
        <td><code>{ status: 'ok', uptime, timestamp }</code></td>
      </tr>
      <!-- Auth -->
      <tr>
        <td><span class="badge badge-success">POST</span></td>
        <td><code>/api/auth/register</code></td>
        <td>Public (Limiter)</td>
        <td><code>{ name, email, password, role, academic, skills }</code></td>
        <td>Issues Bearer JWT, creates User.</td>
      </tr>
      <tr>
        <td><span class="badge badge-success">POST</span></td>
        <td><code>/api/auth/login</code></td>
        <td>Public (Limiter)</td>
        <td><code>{ email, password }</code></td>
        <td>Verifies hash, returns JWT + User.</td>
      </tr>
      <tr>
        <td><span class="badge badge-brand">GET</span></td>
        <td><code>/api/auth/me</code></td>
        <td>Bearer JWT</td>
        <td>Header: <code>Authorization: Bearer &lt;token&gt;</code></td>
        <td>Returns authenticated user profile.</td>
      </tr>
      <tr>
        <td><span class="badge badge-warning">PUT</span></td>
        <td><code>/api/auth/profile</code></td>
        <td>Bearer JWT</td>
        <td><code>{ bio, skills, availability, links }</code></td>
        <td>Updates student profile tags &amp; bio.</td>
      </tr>
      <tr>
        <td><span class="badge badge-success">POST</span></td>
        <td><code>/api/auth/forgot-password</code></td>
        <td>Public (Limiter)</td>
        <td><code>{ email }</code></td>
        <td>Generates 10-minute reset token.</td>
      </tr>
      <tr>
        <td><span class="badge badge-success">POST</span></td>
        <td><code>/api/auth/reset-password</code></td>
        <td>Public (Limiter)</td>
        <td><code>{ resetToken, newPassword }</code></td>
        <td>Updates password with new bcrypt hash.</td>
      </tr>
      <!-- Projects -->
      <tr>
        <td><span class="badge badge-brand">GET</span></td>
        <td><code>/api/projects</code></td>
        <td>Public</td>
        <td><code>?category=&amp;difficulty=&amp;search=</code></td>
        <td>Lists filtered project initiatives.</td>
      </tr>
      <tr>
        <td><span class="badge badge-success">POST</span></td>
        <td><code>/api/projects</code></td>
        <td>Bearer JWT</td>
        <td><code>{ title, description, category, requiredSkills, ... }</code></td>
        <td>Creates project owned by user.</td>
      </tr>
      <tr>
        <td><span class="badge badge-brand">GET</span></td>
        <td><code>/api/projects/:id</code></td>
        <td>Public</td>
        <td>URL Param: <code>id</code></td>
        <td>Returns complete project details.</td>
      </tr>
      <tr>
        <td><span class="badge badge-brand">GET</span></td>
        <td><code>/api/projects/:id/matches</code></td>
        <td>Bearer JWT</td>
        <td>URL Param: <code>id</code></td>
        <td>Calculates and ranks student matches.</td>
      </tr>
      <tr>
        <td><span class="badge badge-success">POST</span></td>
        <td><code>/api/projects/:id/apply</code></td>
        <td>Bearer JWT</td>
        <td><code>{ role, pitchMessage }</code></td>
        <td>Creates Application &amp; notifies owner.</td>
      </tr>
      <!-- Teams -->
      <tr>
        <td><span class="badge badge-brand">GET</span></td>
        <td><code>/api/teams</code></td>
        <td>Bearer JWT</td>
        <td>None</td>
        <td>Returns squads where user is member.</td>
      </tr>
      <tr>
        <td><span class="badge badge-success">POST</span></td>
        <td><code>/api/teams</code></td>
        <td>Bearer JWT</td>
        <td><code>{ name, projectId, description, capacity }</code></td>
        <td>Initializes squad with creator as Lead.</td>
      </tr>
      <tr>
        <td><span class="badge badge-brand">GET</span></td>
        <td><code>/api/teams/:id</code></td>
        <td>Bearer JWT</td>
        <td>URL Param: <code>id</code></td>
        <td>Returns squad members &amp; roles.</td>
      </tr>
      <tr>
        <td><span class="badge badge-success">POST</span></td>
        <td><code>/api/teams/:id/invite</code></td>
        <td>Bearer JWT</td>
        <td><code>{ candidateId, role, message }</code></td>
        <td>Creates Invitation &amp; alerts student.</td>
      </tr>
      <tr>
        <td><span class="badge badge-warning">PUT</span></td>
        <td><code>/api/teams/invitations/:id</code></td>
        <td>Bearer JWT</td>
        <td><code>{ action: 'accept' | 'decline' }</code></td>
        <td>Accepts/rejects team invitation.</td>
      </tr>
      <tr>
        <td><span class="badge" style="background:#fce8e6; color:#c5221f;">DELETE</span></td>
        <td><code>/api/teams/:id/members/:userId</code></td>
        <td>Bearer JWT</td>
        <td>URL Params: <code>id, userId</code></td>
        <td>Removes member or processes self-leave.</td>
      </tr>
      <!-- Tasks -->
      <tr>
        <td><span class="badge badge-brand">GET</span></td>
        <td><code>/api/tasks</code></td>
        <td>Bearer JWT</td>
        <td><code>?teamId=&amp;status=</code></td>
        <td>Lists Kanban tasks for active team.</td>
      </tr>
      <tr>
        <td><span class="badge badge-success">POST</span></td>
        <td><code>/api/tasks</code></td>
        <td>Bearer JWT</td>
        <td><code>{ title, description, teamId, priority, dueDate, ... }</code></td>
        <td>Creates task with deadline &amp; priority.</td>
      </tr>
      <tr>
        <td><span class="badge badge-warning">PUT</span></td>
        <td><code>/api/tasks/:id</code></td>
        <td>Bearer JWT</td>
        <td><code>{ status, priority, title, description }</code></td>
        <td>Updates task status (Kanban movement).</td>
      </tr>
      <tr>
        <td><span class="badge badge-brand">GET</span></td>
        <td><code>/api/tasks/stats</code></td>
        <td>Bearer JWT</td>
        <td><code>?teamId=</code></td>
        <td>Calculates sprint completion rate (%).</td>
      </tr>
      <!-- Chat & Notifications -->
      <tr>
        <td><span class="badge badge-brand">GET</span></td>
        <td><code>/api/chat/teams/:teamId</code></td>
        <td>Bearer JWT</td>
        <td>URL Param: <code>teamId</code></td>
        <td>Retrieves persisted team messages.</td>
      </tr>
      <tr>
        <td><span class="badge badge-brand">GET</span></td>
        <td><code>/api/notifications</code></td>
        <td>Bearer JWT</td>
        <td>None</td>
        <td>Lists notifications with unread count.</td>
      </tr>
      <tr>
        <td><span class="badge badge-warning">PUT</span></td>
        <td><code>/api/notifications/read-all</code></td>
        <td>Bearer JWT</td>
        <td>None</td>
        <td>Sets <code>isRead = true</code> across user alerts.</td>
      </tr>
      <!-- Faculty Portal (RBAC) -->
      <tr>
        <td><span class="badge badge-brand">GET</span></td>
        <td><code>/api/faculty/dashboard</code></td>
        <td><strong>Faculty / Admin</strong></td>
        <td>Requires <code>role: 'faculty'</code></td>
        <td>Returns cohort metrics, squad health, flags.</td>
      </tr>
      <!-- Files -->
      <tr>
        <td><span class="badge badge-success">POST</span></td>
        <td><code>/api/files/teams/:teamId</code></td>
        <td>Bearer JWT</td>
        <td><code>multipart/form-data</code> (Multer)</td>
        <td>Uploads document (max 10MB) to squad.</td>
      </tr>
      <tr>
        <td><span class="badge badge-brand">GET</span></td>
        <td><code>/api/files/teams/:teamId</code></td>
        <td>Bearer JWT</td>
        <td>URL Param: <code>teamId</code></td>
        <td>Lists uploaded project deliverables.</td>
      </tr>
    </tbody>
  </table>

  <h2>4.3 Middleware Pipeline &amp; Security Hardening</h2>
  <p>
    Incoming HTTP requests pass through an ordered, 5-stage middleware pipeline before invoking controller logic:
  </p>
  <ol>
    <li><strong>Security HTTP Headers:</strong> Custom Helmet-equivalent header injection sets <code>X-Content-Type-Options: nosniff</code> (prevents MIME-sniffing), <code>X-Frame-Options: SAMEORIGIN</code> (prevents clickjacking), <code>X-XSS-Protection: 1; mode=block</code>, and production <code>Strict-Transport-Security</code>.</li>
    <li><strong>CORS Whitelist Verification:</strong> Enforces origin checks against <code>CLIENT_ORIGIN</code> (<code>http://localhost:5173</code> in local development, Vercel URL in production).</li>
    <li><strong>Rate Limiting (<code>rateLimiter.js</code>):</strong> Limits authentication endpoints to 10 requests per 15-minute window per IP, mitigating password guessing.</li>
    <li><strong>JWT Verification (<code>auth.js &bull; protect</code>):</strong> Extracts the token from <code>req.headers.authorization</code>, verifies cryptographic signature using <code>JWT_SECRET</code>, and attaches the user document to <code>req.user</code> while stripping the password hash.</li>
    <li><strong>Role Authorization (<code>auth.js &bull; authorize</code>):</strong> Compares <code>req.user.role</code> against allowed roles. If a student attempts to reach <code>/api/faculty/dashboard</code>, it halts execution immediately with <strong>HTTP 403 Forbidden</strong>.</li>
  </ol>

  <div class="page-break"></div>

  <!-- ==================== CHAPTER 5 ==================== -->
  <h1>5. Database Schema &amp; Data Layer Architecture</h1>

  <h2>5.1 MongoDB Collections &amp; Mongoose Models</h2>
  <p>
    SkillBridge utilizes MongoDB document modeling via Mongoose 8. The data layer comprises <strong>9 schemas</strong> with relational references (<code>ref</code>) and compound indexes optimized for query performance:
  </p>

  <h3>1. User Model (<code>server/models/User.js</code>)</h3>
  <p>Stores student and faculty account profiles, credentials, academic context, and verified skill arrays.</p>
  <table>
    <thead>
      <tr>
        <th>Field Name</th>
        <th>BSON Type</th>
        <th>Validation &amp; Rules</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr><td><code>name</code></td><td>String</td><td>Required, trim, max 60</td><td>Full student or faculty name.</td></tr>
      <tr><td><code>email</code></td><td>String</td><td>Required, unique, lowercase</td><td>Institutional campus email address.</td></tr>
      <tr><td><code>password</code></td><td>String</td><td>Required, min 6, select: false</td><td>One-way bcrypt hash (stripped on queries).</td></tr>
      <tr><td><code>role</code></td><td>String</td><td>Enum: <code>['student', 'faculty', 'admin']</code></td><td>RBAC access level (default: <code>'student'</code>).</td></tr>
      <tr><td><code>academic.university</code></td><td>String</td><td>Default: <code>'Stanford University'</code></td><td>Campus affiliation.</td></tr>
      <tr><td><code>academic.course</code></td><td>String</td><td>Default: <code>'Computer Science'</code></td><td>Department or degree program.</td></tr>
      <tr><td><code>skills</code></td><td>[String]</td><td>Array of strings</td><td>Verified proficiencies (e.g., <code>['React', 'Node.js']</code>).</td></tr>
      <tr><td><code>availability</code></td><td>Number</td><td>Min 0, max 60, default 15</td><td>Available collaborative hours per week.</td></tr>
      <tr><td><code>bio</code></td><td>String</td><td>Max 500 characters</td><td>Short self-summary for matchmaking cards.</td></tr>
      <tr><td><code>resetPasswordToken</code></td><td>String</td><td>Indexed, temporary</td><td>Cryptographic token for password recovery.</td></tr>
    </tbody>
  </table>

  <h3>2. Project Model (<code>server/models/Project.js</code>)</h3>
  <p>Represents student project initiatives, hackathon pitches, and course capstones.</p>
  <table>
    <thead>
      <tr>
        <th>Field Name</th>
        <th>BSON Type</th>
        <th>Validation &amp; Rules</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr><td><code>title</code></td><td>String</td><td>Required, trim, max 100</td><td>Project title.</td></tr>
      <tr><td><code>description</code></td><td>String</td><td>Required, max 2000</td><td>Full scope, problem statement, and goals.</td></tr>
      <tr><td><code>category</code></td><td>String</td><td>Enum: Web, Mobile, AI/ML, Cloud, etc.</td><td>Technical domain category.</td></tr>
      <tr><td><code>difficulty</code></td><td>String</td><td>Enum: <code>['Beginner', 'Intermediate', 'Advanced']</code></td><td>Experience tier expected from applicants.</td></tr>
      <tr><td><code>requiredSkills</code></td><td>[String]</td><td>Required, array of strings</td><td>Canonical technical prerequisites for matchmaking.</td></tr>
      <tr><td><code>openRoles</code></td><td>[String]</td><td>Array of strings</td><td>Vacancies (e.g., <code>['Frontend Lead', 'DevOps']</code>).</td></tr>
      <tr><td><code>owner</code></td><td>ObjectId</td><td>Required, <code>ref: 'User'</code></td><td>Foreign key to User who created the project.</td></tr>
      <tr><td><code>team</code></td><td>ObjectId</td><td><code>ref: 'Team'</code></td><td>Associated active collaboration squad.</td></tr>
      <tr><td><code>status</code></td><td>String</td><td>Enum: <code>['Active', 'In Progress', 'Completed']</code></td><td>Project lifecycle status (default: <code>'Active'</code>).</td></tr>
    </tbody>
  </table>

  <h3>3. Team &amp; Task Models (<code>server/models/Team.js</code> &amp; <code>Task.js</code>)</h3>
  <ul>
    <li><strong><code>Team</code>:</strong> Stores <code>name</code>, <code>project</code> (ref: Project), <code>lead</code> (ref: User), <code>capacity</code> (default: 4), and a sub-document array <code>members: [{ user: ObjectId, role: String, joinedAt: Date }]</code>.</li>
    <li><strong><code>Task</code>:</strong> Powers the Kanban board with <code>title</code>, <code>description</code>, <code>team</code> (ref: Team), <code>assignedTo</code> (ref: User), <code>status</code> (Enum: <code>['To Do', 'In Progress', 'Completed']</code>), <code>priority</code> (Enum: <code>['Low', 'Medium', 'High']</code>), <code>dueDate</code>, and <code>order</code>.</li>
  </ul>

  <h3>4. Application, Chat &amp; Notification Models</h3>
  <ul>
    <li><strong><code>Application</code>:</strong> Records squad requests with <code>project</code>, <code>applicant</code>, <code>role</code>, <code>pitchMessage</code>, and <code>status</code> (<code>'Pending' | 'Accepted' | 'Rejected'</code>).</li>
    <li><strong><code>Message</code>:</strong> Persists team discussions with <code>team</code> (indexed), <code>sender</code>, <code>senderName</code>, <code>content</code>, and <code>timestamp</code>.</li>
    <li><strong><code>Notification</code>:</strong> Real-time user alert records with <code>recipient</code> (indexed), <code>title</code>, <code>message</code>, <code>type</code>, <code>isRead</code>, and <code>link</code>.</li>
  </ul>

  <h2>5.2 Data Relationships &amp; Compound Indexing</h2>
  <div class="diagram-box no-break">
    <div style="font-size: 8.5pt; font-weight: 700; color: #404E3B; margin-bottom: 8px;">
      Figure 5.1: Entity-Relationship Diagram (Mongoose Models &amp; Foreign Keys)
    </div>
    <svg viewBox="0 0 720 180" style="width: 100%; max-height: 180px; font-family: sans-serif;">
      <!-- USER -->
      <rect x="20" y="30" width="130" height="120" rx="6" fill="#f5f7f3" stroke="#404E3B" stroke-width="1.5"/>
      <text x="85" y="50" font-size="10" font-weight="bold" fill="#404E3B" text-anchor="middle">USER</text>
      <text x="30" y="72" font-size="7.5" fill="#24292e">&bull; _id (PK)</text>
      <text x="30" y="88" font-size="7.5" fill="#24292e">&bull; name, email</text>
      <text x="30" y="104" font-size="7.5" fill="#24292e">&bull; role (student/fac)</text>
      <text x="30" y="120" font-size="7.5" fill="#24292e">&bull; skills: [String]</text>
      <text x="30" y="136" font-size="7.5" fill="#24292e">&bull; availability</text>

      <!-- PROJECT -->
      <rect x="220" y="30" width="140" height="120" rx="6" fill="#f5f7f3" stroke="#7B9669" stroke-width="1.5"/>
      <text x="290" y="50" font-size="10" font-weight="bold" fill="#404E3B" text-anchor="middle">PROJECT</text>
      <text x="230" y="72" font-size="7.5" fill="#24292e">&bull; _id (PK)</text>
      <text x="230" y="88" font-size="7.5" fill="#24292e">&bull; title, category</text>
      <text x="230" y="104" font-size="7.5" fill="#24292e">&bull; owner &rarr; User._id</text>
      <text x="230" y="120" font-size="7.5" fill="#24292e">&bull; requiredSkills: []</text>
      <text x="230" y="136" font-size="7.5" fill="#24292e">&bull; team &rarr; Team._id</text>

      <!-- TEAM -->
      <rect x="430" y="30" width="130" height="120" rx="6" fill="#f5f7f3" stroke="#6C8480" stroke-width="1.5"/>
      <text x="495" y="50" font-size="10" font-weight="bold" fill="#404E3B" text-anchor="middle">TEAM</text>
      <text x="440" y="72" font-size="7.5" fill="#24292e">&bull; _id (PK)</text>
      <text x="440" y="88" font-size="7.5" fill="#24292e">&bull; name, capacity</text>
      <text x="440" y="104" font-size="7.5" fill="#24292e">&bull; project &rarr; Project._id</text>
      <text x="440" y="120" font-size="7.5" fill="#24292e">&bull; lead &rarr; User._id</text>
      <text x="440" y="136" font-size="7.5" fill="#24292e">&bull; members: [{user}]</text>

      <!-- TASK -->
      <rect x="610" y="30" width="100" height="120" rx="6" fill="#f5f7f3" stroke="#BAC8B1" stroke-width="1.5"/>
      <text x="660" y="50" font-size="10" font-weight="bold" fill="#404E3B" text-anchor="middle">TASK</text>
      <text x="618" y="72" font-size="7.5" fill="#24292e">&bull; _id (PK)</text>
      <text x="618" y="88" font-size="7.5" fill="#24292e">&bull; title, status</text>
      <text x="618" y="104" font-size="7.5" fill="#24292e">&bull; priority</text>
      <text x="618" y="120" font-size="7.5" fill="#24292e">&bull; team &rarr; Team</text>
      <text x="618" y="136" font-size="7.5" fill="#24292e">&bull; assignedTo</text>

      <!-- Relationships -->
      <line x1="150" y1="90" x2="220" y2="90" stroke="#7B9669" stroke-width="1.5"/>
      <text x="185" y="83" font-size="7" fill="#6C8480" text-anchor="middle">1 : N</text>

      <line x1="360" y1="90" x2="430" y2="90" stroke="#7B9669" stroke-width="1.5"/>
      <text x="395" y="83" font-size="7" fill="#6C8480" text-anchor="middle">1 : 1</text>

      <line x1="560" y1="90" x2="610" y2="90" stroke="#7B9669" stroke-width="1.5"/>
      <text x="585" y="83" font-size="7" fill="#6C8480" text-anchor="middle">1 : N</text>
    </svg>
  </div>

  <div class="page-break"></div>

  <!-- ==================== CHAPTER 6 ==================== -->
  <h1>6. Smart Skill-Matching Algorithm Deep Dive</h1>

  <h2>6.1 Step-by-Step Algorithm Walkthrough</h2>
  <p>
    SkillBridge's recommendation engine is implemented identically on both backend (<code>server/utils/skillMatching.js</code>) and frontend (<code>src/utils/skillMatching.js</code>) for immediate UI responsiveness and backend server verification. The algorithm operates in <strong>4 discrete steps</strong>:
  </p>

  <h3>Step 1: Skill Alias Normalization &amp; Canonical Mapping</h3>
  <p>
    Students frequently format technologies inconsistently (e.g., one writes <code>"ReactJS"</code>, another writes <code>"react.js"</code>, and a project specifies <code>"React"</code>). SkillBridge resolves all inputs against a canonical dictionary of aliases:
  </p>
  <pre>
export function normalizeSkill(skill) {
  if (!skill || typeof skill !== 'string') return '';
  const cleaned = skill.trim().toLowerCase();
  return SKILL_ALIASES[cleaned] || cleaned;
}</pre>
  <p>
    Examples: <code>"React.js"</code> &rarr; <code>"react"</code>; <code>"NodeJS"</code> &rarr; <code>"node.js"</code>; <code>"Python3"</code> &rarr; <code>"python"</code>; <code>"Postgres"</code> &rarr; <code>"postgresql"</code>.
  </p>

  <h3>Step 2: Mathematical Jaccard Intersection Formula</h3>
  <p>
    The compatibility percentage between a Project Requirement Set ($S_{req}$) and a Candidate Student's Skill Set ($S_{cand}$) is governed by the deterministic intersection ratio:
  </p>
  <div style="text-align: center; margin: 12px 0; padding: 10px; background: #f7f9f6; border-radius: 6px; font-size: 11pt; font-weight: bold; color: #404E3B;">
    $$\text{Match Score} = \text{round}\left(\frac{|S_{req} \cap S_{cand}|}{|S_{req}|} \times 100\right)$$
  </div>
  <p>
    Where $|S_{req} \cap S_{cand}|$ represents the count of required skills possessed by the student, and $|S_{req}|$ is the total number of technical prerequisites required by the project.
  </p>

  <h3>Step 3: Categorization into Match Strength Tiers</h3>
  <ul>
    <li><strong>High Compatibility ($\ge 75\%$):</strong> Candidate possesses almost all required competencies; capable of immediate sprint contributions.</li>
    <li><strong>Moderate Compatibility ($40\% \text{ to } 74\%$):</strong> Candidate possesses key foundational skills but may require mentorship or peer pairing on missing items.</li>
    <li><strong>Low Compatibility ($&lt; 40\%$):</strong> Significant technical gap; recommended for introductory or cross-training roles.</li>
  </ul>

  <h3>Step 4: Candidate Ranking &amp; Explanation Construction</h3>
  <p>
    The function <code>rankStudentsForProject()</code> evaluates all available student profiles, assigns their compatibility score, and executes a descending stable sort ($O(N \log N)$), generating a human-readable explanation badge (e.g., <em>"Matches 2 of 3 required skills (67%). Missing: Docker."</em>).
  </p>

  <h2>6.2 Concrete Code-Based Worked Example</h2>
  <div class="callout no-break">
    <div class="callout-title">Worked Numerical Demonstration</div>
    <strong>Project Requirement:</strong> <code>CampusPulse AI Hub</code> requires: <code>['React.js', 'Node.js', 'PostgreSQL', 'Docker']</code><br>
    <strong>Student Candidate (Alex Morgan):</strong> Possesses: <code>['React', 'NodeJS', 'Tailwind CSS', 'Figma']</code><br><br>
    <strong>Execution Trace:</strong>
    <ol>
      <li><strong>Normalized Requirements ($S_{req}$):</strong> <code>['react', 'node.js', 'postgresql', 'docker']</code> &rarr; $|S_{req}| = 4$.</li>
      <li><strong>Normalized Student Skills ($S_{cand}$):</strong> <code>['react', 'node.js', 'tailwind css', 'figma']</code>.</li>
      <li><strong>Matched Intersection ($S_{req} \cap S_{cand}$):</strong> <code>['react', 'node.js']</code> &rarr; Matched Count $= 2$.</li>
      <li><strong>Missing Skills ($S_{req} \setminus S_{cand}$):</strong> <code>['postgresql', 'docker']</code> &rarr; Missing Count $= 2$.</li>
      <li><strong>Calculation:</strong> $\text{Score} = \text{round}\left(\frac{2}{4} \times 100\right) = 50\%$.</li>
      <li><strong>Result:</strong> Match Strength = <code>'Moderate'</code> (Pill: Amber).</li>
    </ol>
  </div>

  <h2>6.3 Critical Viva Defense: Rule-Based Heuristics vs. AI/ML</h2>
  <div class="callout-viva no-break">
    <div class="callout-title">🎓 Professor / External Examiner Viva Question:</div>
    <em>"Why does your project use rule-based matching instead of Deep Learning or Neural Networks? Is this considered 'real AI'?"</em>
  </div>
  <p>
    <strong>Honest, Technically Sound Viva Answer:</strong>
  </p>
  <p>
    SkillBridge currently implements a <strong>deterministic, heuristic-based expert system</strong> rather than a statistical deep neural network. In computer science and academic evaluation, this is a conscious, intentional engineering decision:
  </p>
  <ul>
    <li><strong>Auditability &amp; Fairness:</strong> Black-box ML models (like deep neural networks) can produce biased or inexplicable recommendations. In an educational platform where team formation dictates grades and hackathon prizes, every student deserves complete transparency into <em>why</em> they were or were not matched.</li>
    <li><strong>Zero Latency &amp; Compute Efficiency:</strong> Heuristic intersection runs in sub-millisecond time ($O(|S_{req}|)$ lookup using HashSets) without requiring expensive GPU servers, vector databases, or high-cost API calls.</li>
    <li><strong>Data Scarcity:</strong> Supervised ML models require tens of thousands of labeled historical team success records to train effectively. At a university or initial platform stage, such training datasets do not exist.</li>
    <li><strong>Future ML Pathway (Phase 3):</strong> In future iterations, SkillBridge will layer <strong>semantic vector embeddings</strong> (e.g., using OpenAI <code>text-embedding-3-small</code> or open-source SentenceTransformers) to compute cosine similarity on unstructured project descriptions and student bios, allowing fuzzy matching (e.g., understanding that "Kubernetes" relates to "Cloud Architecture").</li>
  </ul>

  <div class="page-break"></div>

  <!-- ==================== CHAPTER 7 ==================== -->
  <h1>7. End-to-End System Workflows &amp; Architecture Diagrams</h1>

  <h2>7.1 Workflow 1: Registration, Login &amp; Profile Setup</h2>
  <div class="diagram-box no-break">
    <div style="font-size: 8.5pt; font-weight: 700; color: #404E3B; margin-bottom: 8px;">
      Figure 7.1: Workflow 1 — Student Onboarding &amp; Profile Persistence Sequence
    </div>
    <svg viewBox="0 0 740 210" style="width: 100%; max-height: 210px; font-family: sans-serif;">
      <!-- Participants -->
      <rect x="20" y="10" width="100" height="26" rx="4" fill="#BAC8B1"/>
      <text x="70" y="27" font-size="8.5" font-weight="bold" fill="#404E3B" text-anchor="middle">Student Client</text>
      <line x1="70" y1="36" x2="70" y2="200" stroke="#BAC8B1" stroke-dasharray="4,3"/>

      <rect x="230" y="10" width="110" height="26" rx="4" fill="#7B9669"/>
      <text x="285" y="27" font-size="8.5" font-weight="bold" fill="#ffffff" text-anchor="middle">Express Server</text>
      <line x1="285" y1="36" x2="285" y2="200" stroke="#7B9669" stroke-dasharray="4,3"/>

      <rect x="450" y="10" width="110" height="26" rx="4" fill="#6C8480"/>
      <text x="505" y="27" font-size="8.5" font-weight="bold" fill="#ffffff" text-anchor="middle">bcrypt &amp; JWT</text>
      <line x1="505" y1="36" x2="505" y2="200" stroke="#6C8480" stroke-dasharray="4,3"/>

      <rect x="620" y="10" width="100" height="26" rx="4" fill="#404E3B"/>
      <text x="670" y="27" font-size="8.5" font-weight="bold" fill="#ffffff" text-anchor="middle">MongoDB</text>
      <line x1="670" y1="36" x2="670" y2="200" stroke="#404E3B" stroke-dasharray="4,3"/>

      <!-- Step 1: Register -->
      <line x1="70" y1="55" x2="285" y2="55" stroke="#404E3B" stroke-width="1.5"/>
      <text x="177" y="50" font-size="7.5" fill="#24292e" text-anchor="middle">1. POST /api/auth/register (Credentials + Skills)</text>

      <!-- Step 2: Hash & Token -->
      <line x1="285" y1="75" x2="505" y2="75" stroke="#6C8480" stroke-width="1.5"/>
      <text x="395" y="70" font-size="7.5" fill="#24292e" text-anchor="middle">2. bcrypt.hash(password, 10) &amp; signToken()</text>

      <!-- Step 3: Save User -->
      <line x1="285" y1="95" x2="670" y2="95" stroke="#404E3B" stroke-width="1.5"/>
      <text x="477" y="90" font-size="7.5" fill="#24292e" text-anchor="middle">3. User.create({ name, email, skills, ... })</text>

      <!-- Step 4: Respond JWT -->
      <line x1="285" y1="120" x2="70" y2="120" stroke="#7B9669" stroke-width="1.5" stroke-dasharray="4,2"/>
      <text x="177" y="115" font-size="7.5" fill="#137333" text-anchor="middle">4. HTTP 201: { token, user: sanitized }</text>

      <!-- Step 5: Store LocalStorage & Socket Connect -->
      <rect x="35" y="135" width="70" height="20" rx="3" fill="#e7ece2" stroke="#BAC8B1"/>
      <text x="70" y="148" font-size="7" fill="#404E3B" text-anchor="middle">Save Token</text>

      <!-- Step 6: Update Profile Skills -->
      <line x1="70" y1="175" x2="285" y2="175" stroke="#404E3B" stroke-width="1.5"/>
      <text x="177" y="170" font-size="7.5" fill="#24292e" text-anchor="middle">5. PUT /api/auth/profile (Bearer JWT + New Skills)</text>
      <line x1="285" y1="190" x2="670" y2="190" stroke="#404E3B" stroke-width="1.5"/>
      <text x="477" y="185" font-size="7.5" fill="#24292e" text-anchor="middle">6. User.findByIdAndUpdate(userId, { skills })</text>
    </svg>
  </div>

  <h2>7.2 Workflow 2: Project Creation &amp; Teammate Recommendation</h2>
  <div class="diagram-box no-break">
    <div style="font-size: 8.5pt; font-weight: 700; color: #404E3B; margin-bottom: 8px;">
      Figure 7.2: Workflow 2 — Project Creation, Skill Requirement Parsing &amp; Candidate Ranking
    </div>
    <svg viewBox="0 0 740 180" style="width: 100%; max-height: 180px; font-family: sans-serif;">
      <!-- Step 1 -->
      <rect x="20" y="30" width="150" height="60" rx="6" fill="#f5f7f3" stroke="#7B9669" stroke-width="1.5"/>
      <text x="95" y="52" font-size="9" font-weight="bold" fill="#404E3B" text-anchor="middle">1. Project Authoring</text>
      <text x="95" y="68" font-size="7.5" fill="#24292e" text-anchor="middle">Title, Category, Open Roles,</text>
      <text x="95" y="80" font-size="7.5" fill="#6C8480" text-anchor="middle">Required Skills Array</text>

      <!-- Arrow -->
      <line x1="170" y1="60" x2="210" y2="60" stroke="#7B9669" stroke-width="2"/>

      <!-- Step 2 -->
      <rect x="210" y="30" width="150" height="60" rx="6" fill="#f5f7f3" stroke="#7B9669" stroke-width="1.5"/>
      <text x="285" y="52" font-size="9" font-weight="bold" fill="#404E3B" text-anchor="middle">2. Normalization Engine</text>
      <text x="285" y="68" font-size="7.5" fill="#24292e" text-anchor="middle">Resolves Canonical Aliases</text>
      <text x="285" y="80" font-size="7.5" fill="#6C8480" text-anchor="middle">Deduplicates Skill Set</text>

      <!-- Arrow -->
      <line x1="360" y1="60" x2="400" y2="60" stroke="#7B9669" stroke-width="2"/>

      <!-- Step 3 -->
      <rect x="400" y="30" width="150" height="60" rx="6" fill="#f5f7f3" stroke="#404E3B" stroke-width="1.5"/>
      <text x="475" y="52" font-size="9" font-weight="bold" fill="#404E3B" text-anchor="middle">3. Candidate Scoring</text>
      <text x="475" y="68" font-size="7.5" fill="#24292e" text-anchor="middle">Jaccard Intersection Ratio</text>
      <text x="475" y="80" font-size="7.5" fill="#6C8480" text-anchor="middle">Score = (|Req &cap; Cand| / |Req|)*100</text>

      <!-- Arrow -->
      <line x1="550" y1="60" x2="590" y2="60" stroke="#404E3B" stroke-width="2"/>

      <!-- Step 4 -->
      <rect x="590" y="30" width="130" height="60" rx="6" fill="#BAC8B1" stroke="#404E3B" stroke-width="1.5"/>
      <text x="655" y="52" font-size="9" font-weight="bold" fill="#404E3B" text-anchor="middle">4. Ranked Matches</text>
      <text x="655" y="68" font-size="7.5" fill="#404E3B" text-anchor="middle">Descending Stable Sort</text>
      <text x="655" y="80" font-size="7.5" fill="#404E3B" text-anchor="middle">Instant Invite Trigger</text>

      <!-- Bottom explanation -->
      <rect x="20" y="110" width="700" height="40" rx="4" fill="#ffffff" stroke="#E6E6E6"/>
      <text x="370" y="128" font-size="8" fill="#526844" text-anchor="middle">
        Endpoint: <code>GET /api/projects/:id/matches</code> &bull; Ranks student profiles and dispatches WebSocket notification when invite is sent.
      </text>
      <text x="370" y="142" font-size="7.5" fill="#6C8480" text-anchor="middle">
        Generates itemized explanation: Matched skills, missing prerequisites, and compatibility tier (High &ge; 75%, Moderate 40-74%, Low &lt; 40%).
      </text>
    </svg>
  </div>

  <h2>7.3 Workflow 3: Squad Formation, Kanban Board &amp; Team Collaboration</h2>
  <p>
    Once matched, students coordinate through four interconnected sub-systems:
  </p>
  <ul>
    <li><strong>Squad Formation &amp; Role Assignments:</strong> Project leads initialize a squad record with capacity limits. Invited members accept their invite, automatically associating their <code>userId</code> and designated role (e.g., "Frontend Lead") in the <code>Team.members</code> array.</li>
    <li><strong>Agile Kanban Sprint Management:</strong> Team members create tasks with priority levels (<code>Low</code>, <code>Medium</code>, <code>High</code>) and target deadlines. Dragging or clicking a task updates its status (<code>To Do</code> &rarr; <code>In Progress</code> &rarr; <code>Completed</code>) via <code>PUT /api/tasks/:id</code>, recalculating the overall sprint completion percentage in real time.</li>
    <li><strong>Socket.IO Team Chat:</strong> Entering <code>/messages</code> triggers <code>socket.emit('join_team', { teamId })</code>. Team discussions are broadcast only to active squad sockets in that room, eliminating cross-team leakage.</li>
    <li><strong>Team Deliverables File Manager:</strong> Squad members upload architecture PDFs, design assets, and zip archives up to 10MB using <code>POST /api/files/teams/:teamId</code>, backed by Multer disk storage.</li>
  </ul>

  <h2>7.4 Workflow 4: Faculty Mentorship &amp; Early Intervention</h2>
  <p>
    Faculty advisors access <code>/faculty</code> (enforced by <code>authorize('faculty', 'admin')</code>). The server computes aggregate health diagnostics across campus cohorts:
  </p>
  <ul>
    <li><strong>At-Risk Squad Detection:</strong> Teams with sprint completion below 40% and approaching milestone deadlines are automatically highlighted in red.</li>
    <li><strong>Intervention Messaging:</strong> Mentors can broadcast targeted advisories directly to struggling squads.</li>
    <li><strong>Skill Distribution Analytics:</strong> Campus-wide charts indicate which technologies have surplus talent and which are experiencing student skill shortages.</li>
  </ul>

  <div class="page-break"></div>

  <!-- ==================== CHAPTER 8 ==================== -->
  <h1>8. Current Implementation Status Matrix</h1>
  <p>
    The following table provides an honest, comprehensive audit of every module in the repository, classifying its exact completion status:
  </p>

  <table>
    <thead>
      <tr>
        <th style="width: 22%;">Module / Feature</th>
        <th style="width: 15%;">Status</th>
        <th style="width: 15%;">Working Mode</th>
        <th style="width: 25%;">Relevant Source Files</th>
        <th style="width: 23%;">Pending / Future Work</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Signature Theme &amp; Styling</strong></td>
        <td><span class="badge badge-success">Completed</span></td>
        <td>100% Functional</td>
        <td><code>tailwind.config.js</code>, <code>src/index.css</code></td>
        <td>Zero. Sage, Celadon, Forest theme fully applied.</td>
      </tr>
      <tr>
        <td><strong>JWT Auth &amp; Login/Signup</strong></td>
        <td><span class="badge badge-success">Completed</span></td>
        <td>100% Functional</td>
        <td><code>authController.js</code>, <code>AuthContext.jsx</code></td>
        <td>Send real verification emails via SendGrid/SES.</td>
      </tr>
      <tr>
        <td><strong>Quick Demo Personas</strong></td>
        <td><span class="badge badge-success">Completed</span></td>
        <td>100% Functional</td>
        <td><code>LoginPage.jsx</code>, <code>studentsData.js</code></td>
        <td>Zero. 4 one-click personas active for viva.</td>
      </tr>
      <tr>
        <td><strong>Rule-Based Matchmaking</strong></td>
        <td><span class="badge badge-success">Completed</span></td>
        <td>100% Functional</td>
        <td><code>skillMatching.js</code> (Client &amp; Server)</td>
        <td>Semantic AI vector embeddings for fuzzy resume parsing.</td>
      </tr>
      <tr>
        <td><strong>Project CRUD &amp; Exploration</strong></td>
        <td><span class="badge badge-success">Completed</span></td>
        <td>100% Functional</td>
        <td><code>projectController.js</code>, <code>ProjectsPage.jsx</code></td>
        <td>Tag autocomplete from existing project catalog.</td>
      </tr>
      <tr>
        <td><strong>Builder Profile Editor</strong></td>
        <td><span class="badge badge-success">Completed</span></td>
        <td>100% Functional</td>
        <td><code>ProfilePage.jsx</code>, <code>authController.js</code></td>
        <td>Direct GitHub OAuth profile import.</td>
      </tr>
      <tr>
        <td><strong>Agile Kanban Board</strong></td>
        <td><span class="badge badge-success">Completed</span></td>
        <td>100% Functional</td>
        <td><code>TasksPage.jsx</code>, <code>taskController.js</code></td>
        <td>Drag-and-drop mobile touch event optimization.</td>
      </tr>
      <tr>
        <td><strong>Squad Management &amp; Invites</strong></td>
        <td><span class="badge badge-success">Completed</span></td>
        <td>100% Functional</td>
        <td><code>teamController.js</code>, <code>TeamsPage.jsx</code></td>
        <td>Automated team formation auto-fill button.</td>
      </tr>
      <tr>
        <td><strong>Socket.IO Team Chat</strong></td>
        <td><span class="badge badge-success">Completed</span></td>
        <td>100% Functional</td>
        <td><code>chatController.js</code>, <code>MessagesPage.jsx</code></td>
        <td>Direct user-to-user private DMs outside teams.</td>
      </tr>
      <tr>
        <td><strong>Notifications Center</strong></td>
        <td><span class="badge badge-success">Completed</span></td>
        <td>100% Functional</td>
        <td><code>notificationController.js</code>, <code>socket.js</code></td>
        <td>Browser push notifications (Web Push API).</td>
      </tr>
      <tr>
        <td><strong>Faculty Oversight Portal</strong></td>
        <td><span class="badge badge-success">Completed</span></td>
        <td>100% Functional</td>
        <td><code>facultyController.js</code>, <code>FacultyPage.jsx</code></td>
        <td>Exportable cohort PDF grade rubric sheets.</td>
      </tr>
      <tr>
        <td><strong>Deliverables File Manager</strong></td>
        <td><span class="badge badge-success">Completed</span></td>
        <td>100% Functional</td>
        <td><code>fileController.js</code>, <code>TeamFileManager.jsx</code></td>
        <td>Cloud object storage (AWS S3) for production.</td>
      </tr>
      <tr>
        <td><strong>Automated Test Suite</strong></td>
        <td><span class="badge badge-success">Completed</span></td>
        <td>100% Functional</td>
        <td><code>server/test_runner.mjs</code></td>
        <td>Expand to unit test individual React components.</td>
      </tr>
      <tr>
        <td><strong>Cloud Database Integration</strong></td>
        <td><span class="badge badge-warning">Partial / Dual</span></td>
        <td>Atlas + Standby</td>
        <td><code>server/config/db.js</code></td>
        <td>Input live MongoDB Atlas URI in <code>server/.env</code>.</td>
      </tr>
      <tr>
        <td><strong>Email Dispatch System</strong></td>
        <td><span class="badge badge-warning">Partially Mocked</span></td>
        <td>API Token Return</td>
        <td><code>authController.js</code></td>
        <td>Replace JSON response token with SendGrid API.</td>
      </tr>
      <tr>
        <td><strong>Video Collaboration</strong></td>
        <td><span class="badge" style="background:#fee2e2; color:#b91c1c;">Not Started</span></td>
        <td>Planned Phase 3</td>
        <td>Future <code>videoService.js</code></td>
        <td>WebRTC peer-to-peer audio/video calling rooms.</td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- ==================== CHAPTER 9 ==================== -->
  <h1>9. Verification, Test Results &amp; Real Limitations</h1>

  <h2>9.1 Automated Integration &amp; Security Test Suite</h2>
  <p>
    SkillBridge includes an end-to-end automated test runner located at <code>server/test_runner.mjs</code>. Executing <code>npm test</code> inside the <code>server/</code> directory runs <strong>22 comprehensive test assertions</strong> against live Express endpoints:
  </p>

  <table>
    <thead>
      <tr>
        <th style="width: 6%;">#</th>
        <th style="width: 25%;">Test Name</th>
        <th style="width: 25%;">Target Endpoint</th>
        <th style="width: 32%;">Verification Criteria</th>
        <th style="width: 12%;">Result</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>1</td><td>System Health Check</td><td><code>GET /api/health</code></td><td>HTTP 200, returns active service metadata and timestamp.</td><td><span class="badge badge-success">PASS</span></td></tr>
      <tr><td>2</td><td>Security HTTP Headers</td><td><code>GET /api/health</code></td><td>Confirms <code>X-Content-Type-Options</code> &amp; <code>X-Frame-Options</code>.</td><td><span class="badge badge-success">PASS</span></td></tr>
      <tr><td>3</td><td>Registration Validation</td><td><code>POST /api/auth/register</code></td><td>Omitting name and password correctly returns HTTP 400 Bad Request.</td><td><span class="badge badge-success">PASS</span></td></tr>
      <tr><td>4</td><td>Student Registration</td><td><code>POST /api/auth/register</code></td><td>Creates new student, returns JWT, confirms password hash is sanitized.</td><td><span class="badge badge-success">PASS</span></td></tr>
      <tr><td>5</td><td>Student Authentication</td><td><code>POST /api/auth/login</code></td><td>Authenticates <code>alex.morgan@stanford.edu</code> with valid bcrypt password.</td><td><span class="badge badge-success">PASS</span></td></tr>
      <tr><td>6</td><td>Persistent Auth Profile</td><td><code>GET /api/auth/me</code></td><td>Validates Bearer token in header and returns matching email.</td><td><span class="badge badge-success">PASS</span></td></tr>
      <tr><td>7</td><td>Profile Details Update</td><td><code>PUT /api/auth/profile</code></td><td>Updates bio, availability hours, and verified skill tags.</td><td><span class="badge badge-success">PASS</span></td></tr>
      <tr><td>8</td><td>Forgot Password Token</td><td><code>POST /api/auth/forgot-password</code></td><td>Generates single-use 10-minute reset token.</td><td><span class="badge badge-success">PASS</span></td></tr>
      <tr><td>9</td><td>Project Exploration Filter</td><td><code>GET /api/projects?category=Web</code></td><td>Filters initiatives by domain category; returns matching items.</td><td><span class="badge badge-success">PASS</span></td></tr>
      <tr><td>10</td><td>Server Skill Matchmaking</td><td><code>GET /api/projects/:id/matches</code></td><td>Evaluates student skills against project prerequisites; ranks top match.</td><td><span class="badge badge-success">PASS</span></td></tr>
      <tr><td>11</td><td>Squad Application</td><td><code>POST /api/projects/:id/apply</code></td><td>Records application and triggers notification to project owner.</td><td><span class="badge badge-success">PASS</span></td></tr>
      <tr><td>12</td><td>Teams Workspace Retrieval</td><td><code>GET /api/teams</code></td><td>Retrieves active teams for authenticated user.</td><td><span class="badge badge-success">PASS</span></td></tr>
      <tr><td>13</td><td>Kanban Tasks Listing</td><td><code>GET /api/tasks</code></td><td>Lists tasks with status, priority flags, and assignee references.</td><td><span class="badge badge-success">PASS</span></td></tr>
      <tr><td>14</td><td>Task Creation with Due Date</td><td><code>POST /api/tasks</code></td><td>Creates task with deadline, priority, and team association.</td><td><span class="badge badge-success">PASS</span></td></tr>
      <tr><td>15</td><td>Task Completion Analytics</td><td><code>GET /api/tasks/stats</code></td><td>Calculates sprint completion rate percentage.</td><td><span class="badge badge-success">PASS</span></td></tr>
      <tr><td>16</td><td>Team Chat History</td><td><code>GET /api/chat/teams/:teamId</code></td><td>Retrieves persisted messages for isolated team channel.</td><td><span class="badge badge-success">PASS</span></td></tr>
      <tr><td>17</td><td>Notifications Center</td><td><code>GET /api/notifications</code></td><td>Lists notifications with real-time unread counter.</td><td><span class="badge badge-success">PASS</span></td></tr>
      <tr><td>18</td><td>Mark-All-As-Read</td><td><code>PUT /api/notifications/read-all</code></td><td>Updates all unread notifications to <code>isRead: true</code>.</td><td><span class="badge badge-success">PASS</span></td></tr>
      <tr><td>19</td><td>RBAC Access Control</td><td><code>GET /api/faculty/dashboard</code></td><td><strong>Security:</strong> Student token rejected with <strong>HTTP 403 Forbidden</strong>.</td><td><span class="badge badge-success">PASS</span></td></tr>
      <tr><td>20</td><td>Faculty Authentication</td><td><code>POST /api/auth/login</code></td><td>Authenticates <code>prof.davis@stanford.edu</code> with faculty role.</td><td><span class="badge badge-success">PASS</span></td></tr>
      <tr><td>21</td><td>Faculty Oversight Portal</td><td><code>GET /api/faculty/dashboard</code></td><td>Faculty token accepted; returns cohort metrics and at-risk teams.</td><td><span class="badge badge-success">PASS</span></td></tr>
      <tr><td>22</td><td>Shared Team Deliverables</td><td><code>GET /api/files/teams/:teamId</code></td><td>Lists uploaded design documents and project assets.</td><td><span class="badge badge-success">PASS</span></td></tr>
    </tbody>
  </table>

  <div class="callout no-break">
    <div class="callout-title">✅ Test Suite Summary</div>
    <strong>22 Passed, 0 Failed, 0 Skipped (100% Pass Rate).</strong> All core business logic, authentication guards, security headers, role authorization, and matchmaking operations are verified by automated integration tests.
  </div>

  <h2>9.2 Honest Assessment of Current Technical Limitations</h2>
  <p>
    During a rigorous viva defense, acknowledging real-world engineering constraints demonstrates maturity and deep technical comprehension:
  </p>
  <ul>
    <li><strong>Email Transport:</strong> Password reset tokens are returned directly in the JSON response payload with a 10-minute expiry rather than dispatched via SMTP. In production, an API key from Resend, SendGrid, or AWS SES must be connected.</li>
    <li><strong>Local Disk Storage for Deliverables:</strong> Deliverable files uploaded via Multer are stored in <code>server/uploads/</code>. While ideal for local grading and offline evaluation, ephemeral cloud platforms (like Render free instances) wipe local disk storage on container reboots. Production requires S3 or Cloudinary.</li>
    <li><strong>Cloud Database Cold Starts:</strong> When running on free-tier Render or MongoDB Atlas M0 clusters, inactive containers go into sleep mode. Initial API requests may experience a 30-second cold start latency before warming up.</li>
  </ul>

  <div class="page-break"></div>

  <!-- ==================== CHAPTER 10 ==================== -->
  <h1>10. Evolutionary Analysis: Phase 1 vs. Phase 2</h1>

  <h2>10.1 Comparative Evolution Matrix</h2>
  <p>
    SkillBridge underwent a major transformation between Phase 1 (foundation/UI prototype) and Phase 2 (full-stack production platform). The table below contrasts the two milestones:
  </p>

  <table>
    <thead>
      <tr>
        <th style="width: 20%;">Architectural Dimension</th>
        <th style="width: 40%;">Phase 1 Baseline (Prototype)</th>
        <th style="width: 40%;">Phase 2 Implementation (Current Platform)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Backend &amp; API</strong></td>
        <td>No backend server; client-side React prototype running solely on static in-memory mock files.</td>
        <td>Full-stack Express.js 4 backend with 24 REST endpoints, Socket.IO real-time engine, and automated test suite.</td>
      </tr>
      <tr>
        <td><strong>Database &amp; Data Layer</strong></td>
        <td>Hardcoded JavaScript arrays (<code>studentsData.js</code>, <code>projectsData.js</code>). No persistent database.</td>
        <td>MongoDB Atlas cloud database with 9 Mongoose schemas, compound indexes, and dual-mode standby resilience.</td>
      </tr>
      <tr>
        <td><strong>Authentication &amp; Security</strong></td>
        <td>Simulated client-side auth toggle; no password hashing, no tokens, no HTTP security headers.</td>
        <td>Real stateless JWT authentication, bcrypt password hashing (salt 10), express-rate-limit, and Helmet-equivalent headers.</td>
      </tr>
      <tr>
        <td><strong>Role-Based Access Control</strong></td>
        <td>No role enforcement; any user could view any mock view without validation.</td>
        <td>Cryptographically enforced RBAC; <code>authorize('faculty', 'admin')</code> rejects unauthorized student requests with HTTP 403.</td>
      </tr>
      <tr>
        <td><strong>Skill Matching Logic</strong></td>
        <td>Simple array filter with no alias handling; failed when casing or naming varied (e.g., <code>React</code> vs <code>react.js</code>).</td>
        <td>Canonical normalization dictionary, Jaccard intersection math, match strength tiers, and itemized missing-skills explanation.</td>
      </tr>
      <tr>
        <td><strong>Task &amp; Sprint Management</strong></td>
        <td>Static mock task list; tasks could not be created, prioritized, assigned, or moved between Kanban columns.</td>
        <td>Full interactive Kanban board (To Do &rarr; In Progress &rarr; Completed), priority indicators, due dates, and completion metrics.</td>
      </tr>
      <tr>
        <td><strong>Team Communication</strong></td>
        <td>Static chat UI with dummy placeholder messages; no live messaging between users.</td>
        <td>Real-time Socket.IO chat rooms isolated by <code>team_{id}</code>, instant WebSocket system alerts, and message history.</td>
      </tr>
      <tr>
        <td><strong>Academic Oversight</strong></td>
        <td>Non-existent; no faculty view or mentorship capabilities planned in initial prototype.</td>
        <td>Complete Faculty &amp; Admin Oversight Portal with automated squad health diagnostics and at-risk project alerts.</td>
      </tr>
      <tr>
        <td><strong>Visual Identity &amp; Theme</strong></td>
        <td>Default generic purple/pink theme with high contrast inconsistencies.</td>
        <td>Signature curated Sage Green, Celadon &amp; Deep Forest palette (#7B9669, #BAC8B1, #404E3B, #6C8480, #E6E6E6).</td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- ==================== CHAPTER 11 ==================== -->
  <h1>11. Future Roadmap &amp; College Viva Defense Guide</h1>

  <h2>11.1 Phase 3 Technical Roadmap</h2>
  <ol>
    <li><strong>Semantic AI Vector Matching:</strong> Integrate OpenAI <code>text-embedding-3-small</code> or Google Gemini embeddings with MongoDB Atlas Vector Search. This enables fuzzy semantic matching across freeform project descriptions and student resumes (e.g., matching "Distributed Systems" to "Go + Microservices").</li>
    <li><strong>WebRTC Audio/Video Sprint Rooms:</strong> Embed native peer-to-peer audio/video calling within <code>/messages</code>, allowing student squads to conduct virtual standup meetings without leaving the platform.</li>
    <li><strong>GitHub OAuth &amp; Automated Commit Tracking:</strong> Connect student GitHub accounts to automatically calculate individual commit contributions and code metrics on the squad's Kanban deliverables.</li>
    <li><strong>Cloud Object Storage (AWS S3):</strong> Transition the Multer file upload engine from local disk storage to encrypted AWS S3 buckets with pre-signed download URLs.</li>
  </ol>

  <h2>11.2 College Viva &amp; Defense Questions Guide (15 Key Questions)</h2>
  <p>
    Review these 15 questions and model answers prior to your capstone presentation or university viva examination:
  </p>

  <div class="callout no-break">
    <strong>Q1: What is the core problem SkillBridge solves that tools like Trello or WhatsApp don't?</strong><br>
    <em>Answer:</em> WhatsApp and Discord lack structured matchmaking and Kanban task accountability, leading to chaotic group chats and teammate ghosting. Trello and Jira assume a team already exists and do not solve the initial talent matching problem. SkillBridge is an integrated ecosystem that solves the entire lifecycle: Matchmaking &rarr; Team Formation &rarr; Agile Sprints &rarr; Faculty Supervision.
  </div>

  <div class="callout no-break">
    <strong>Q2: How does your skill-matching algorithm handle variations like "React" vs "React.js"?</strong><br>
    <em>Answer:</em> SkillBridge implements canonical skill alias normalization. All inputs are lowercased, trimmed, and mapped through a canonical dictionary (e.g., <code>'react.js'</code>, <code>'reactjs'</code>, and <code>'react'</code> all map to <code>'react'</code>). This eliminates false negatives caused by formatting differences.
  </div>

  <div class="callout no-break">
    <strong>Q3: Explain the mathematical formula used for calculating the match percentage.</strong><br>
    <em>Answer:</em> It uses the Jaccard intersection ratio between normalized required skills and student skills: $\text{Match Score} = \text{round}((|S_{req} \cap S_{cand}| / |S_{req}|) \times 100)$. It calculates the exact count of prerequisites matched, identifies missing competencies, and categorizes candidates into High (&ge;75%), Moderate (40-74%), or Low (&lt;40%) compatibility tiers.
  </div>

  <div class="callout no-break">
    <strong>Q4: Why did you choose JWT over server-side session cookies?</strong><br>
    <em>Answer:</em> JWTs are stateless and self-contained. The server does not need to query a session table on every HTTP request to verify authentication, reducing database load and making the architecture horizontally scalable across multiple server instances or cloud serverless environments.
  </div>

  <div class="callout no-break">
    <strong>Q5: How do you prevent unauthorized students from accessing faculty data?</strong><br>
    <em>Answer:</em> We implement cryptographic Role-Based Access Control (RBAC). The JWT payload encodes the user's role. Our <code>authorize('faculty', 'admin')</code> middleware checks this role before executing controller logic. If a student token reaches <code>/api/faculty/dashboard</code>, the server immediately rejects the request with HTTP 403 Forbidden.
  </div>

  <div class="callout no-break">
    <strong>Q6: How does the real-time chat ensure messages aren't leaked to other teams?</strong><br>
    <em>Answer:</em> Through Socket.IO room isolation. When a user opens a team chat, the client emits <code>join_team</code> with the unique <code>teamId</code>. The server executes <code>socket.join('team_' + teamId)</code>. Outgoing messages are broadcast exclusively to <code>io.to('team_' + teamId)</code>, ensuring complete multi-tenant privacy.
  </div>

  <div class="callout no-break">
    <strong>Q7: How do you handle database offline states during local evaluation?</strong><br>
    <em>Answer:</em> We built a dual-mode standby resilience architecture in <code>server/config/db.js</code> with <code>mongoose.set('bufferCommands', false)</code>. If no MongoDB Atlas URI is present, the server automatically engages standby evaluation mode, serving mock data and preventing hanging 30-second timeout errors.
  </div>

  <div class="callout no-break">
    <strong>Q8: How do you protect passwords in the database?</strong><br>
    <em>Answer:</em> Passwords are never stored in plaintext. We use <code>bcryptjs</code> with a salt work factor of 10. In Mongoose, the password field has <code>select: false</code>, and our controllers explicitly strip the password property before returning user objects in API responses.
  </div>

  <div class="callout no-break">
    <strong>Q9: How are brute-force login attacks mitigated?</strong><br>
    <em>Answer:</em> Using <code>express-rate-limit</code>. We configure a strict rate limiter on <code>/api/auth/login</code> and <code>/api/auth/register</code> that restricts clients to a maximum of 10 requests per 15-minute window per IP address, returning HTTP 429 Too Many Requests upon violation.
  </div>

  <div class="callout no-break">
    <strong>Q10: What HTTP security headers did you implement?</strong><br>
    <em>Answer:</em> We implemented custom security headers equivalent to Helmet: <code>X-Content-Type-Options: nosniff</code> (prevents MIME sniffing), <code>X-Frame-Options: SAMEORIGIN</code> (prevents clickjacking), <code>X-XSS-Protection</code>, <code>Referrer-Policy</code>, and production <code>Strict-Transport-Security</code> (HSTS).
  </div>

  <div class="callout no-break">
    <strong>Q11: How does the Agile Kanban board update sprint analytics?</strong><br>
    <em>Answer:</em> Tasks are grouped by status (<code>To Do</code>, <code>In Progress</code>, <code>Completed</code>). When a task status changes, the client calls <code>PUT /api/tasks/:id</code> and <code>GET /api/tasks/stats?teamId=...</code>. The server calculates the completion rate as $(\text{Completed Tasks} / \text{Total Tasks}) \times 100$.
  </div>

  <div class="callout no-break">
    <strong>Q12: How does the Faculty Oversight Portal help academic mentors?</strong><br>
    <em>Answer:</em> It aggregates team performance across student cohorts. It computes average sprint velocity, displays campus skill distribution charts, and automatically flags at-risk squads whose completion rate is under 40% near milestone deadlines, enabling timely academic intervention.
  </div>

  <div class="callout no-break">
    <strong>Q13: How is SPA fallback routing handled on production deployments like Vercel?</strong><br>
    <em>Answer:</em> In Single Page Applications, refreshing deep URLs like <code>/dashboard</code> or <code>/tasks</code> causes 404 errors if the web server looks for physical HTML files. We include a root <code>vercel.json</code> with rewrite rules directing all non-static paths to <code>index.html</code>, allowing React Router to manage route rendering.
  </div>

  <div class="callout no-break">
    <strong>Q14: How many automated tests exist, and what do they verify?</strong><br>
    <em>Answer:</em> There are 22 automated integration tests in <code>server/test_runner.mjs</code> with a 100% pass rate. They verify system health, security headers, registration validation, JWT issuance, profile revalidation, project CRUD, skill matching, task creation, Kanban analytics, Socket chat, notifications, and RBAC rejection.
  </div>

  <div class="callout no-break">
    <strong>Q15: What design philosophy was applied to the user interface?</strong><br>
    <em>Answer:</em> We developed a cohesive, organic color palette consisting of Sage Olive Green (<code>#7B9669</code>), Slate Teal (<code>#6C8480</code>), Pale Celadon (<code>#BAC8B1</code>), Light Neutral Surface (<code>#E6E6E6</code>), and Deep Dark Forest (<code>#404E3B</code>). The interface supports responsive layouts, subtle depth shadows, and consistent Dark Mode switching.
  </div>

</body>
</html>`;

  console.log('Writing temporary HTML file...');
  const htmlPath = path.join(__dirname, 'report_preview.html');
  fs.writeFileSync(htmlPath, htmlContent, 'utf8');

  console.log('Launching headless browser with puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  const pdfPath = path.join(__dirname, 'SkillBridge_Complete_Project_Analysis.pdf');

  console.log('Rendering publication-quality PDF...');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div style="font-size: 8px; color: #6C8480; width: 100%; text-align: right; padding-right: 14mm; font-family: sans-serif;">SkillBridge — Complete Project Analysis &amp; Technical Defense Report</div>',
    footerTemplate: '<div style="font-size: 8px; color: #6C8480; width: 100%; display: flex; justify-content: space-between; padding-left: 14mm; padding-right: 14mm; font-family: sans-serif;"><span>https://github.com/sakshi-lily/Skill-Bridge.git</span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>',
    margin: {
      top: '16mm',
      bottom: '18mm',
      left: '14mm',
      right: '14mm'
    }
  });

  await browser.close();
  console.log(`✅ Success! Generated PDF: ${pdfPath}`);
}

generatePDF().catch(err => {
  console.error('Fatal error generating PDF:', err);
  process.exit(1);
});
