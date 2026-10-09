import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Database & Config
import { connectDB, getDBStatus } from './config/db.js';

// Middleware
import { errorHandler } from './middleware/errorHandler.js';

// Route Handlers
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import facultyRoutes from './routes/facultyRoutes.js';
import fileRoutes from './routes/fileRoutes.js';

// Real-time Service Bridges
import { setIO } from './services/notificationService.js';
import { setChatIO } from './controllers/chatController.js';

// Models
import Team from './models/Team.js';
import Message from './models/Message.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express & HTTP server
const app = express();
const server = http.createServer(app);

// Allowed CORS origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  process.env.CLIENT_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev to avoid CORS blocking
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Bridge io instance to services
setIO(io);
setChatIO(io);

// Socket.IO Authentication Middleware
io.use((socket, next) => {
  const token =
    socket.handshake.auth?.token ||
    socket.handshake.headers?.authorization?.split(' ')[1];

  if (!token) {
    // Allow anonymous socket with fallback identifier
    socket.userId = `anon_${socket.id}`;
    return next();
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'skillbridge_secure_jwt_secret_key_2026'
    );
    socket.userId = decoded.id;
    socket.userRole = decoded.role;
    next();
  } catch (err) {
    // If token is invalid, continue as anon rather than crashing
    socket.userId = `anon_${socket.id}`;
    next();
  }
});

// Socket.IO Real-Time Events
io.on('connection', (socket) => {
  // Join private room for user-targeted notifications
  if (socket.userId && !socket.userId.startsWith('anon_')) {
    socket.join(`user_${socket.userId}`);
  }

  // Join Team Room
  socket.on('join_team', (data) => {
    try {
      const targetTeamId = typeof data === 'string' ? data : data?.teamId;
      if (!targetTeamId) return;
      socket.join(`team_${targetTeamId}`);
    } catch (err) {
      console.error('Error joining team room:', err.message);
    }
  });

  // Leave Team Room
  socket.on('leave_team', (data) => {
    const targetTeamId = typeof data === 'string' ? data : data?.teamId;
    if (targetTeamId) {
      socket.leave(`team_${targetTeamId}`);
    }
  });

  // Socket-level message broadcast with standby fallback
  const handleMessage = async (data) => {
    try {
      const teamId = typeof data === 'string' ? null : (data.teamId || data.team);
      const { senderName, senderAvatar, content, attachments } = data;
      if (!teamId || !content?.trim()) return;

      let message;
      if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(teamId)) {
        message = await Message.create({
          team: teamId,
          sender: socket.userId?.startsWith('anon_') ? null : socket.userId,
          senderName: senderName || 'Student',
          senderAvatar: senderAvatar || '',
          content: content.trim(),
          attachments: attachments || [],
        });
      } else {
        message = {
          _id: `msg_${Date.now()}`,
          id: `msg_${Date.now()}`,
          team: teamId,
          sender: socket.userId?.startsWith('anon_') ? null : socket.userId,
          senderName: senderName || 'Alex Morgan',
          senderAvatar: senderAvatar || '',
          content: content.trim(),
          attachments: attachments || [],
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }

      io.to(`team_${teamId}`).emit('team_message', message);
      io.to(`team_${teamId}`).emit('new_message', message);
    } catch (err) {
      console.error('Socket message error:', err.message);
    }
  };

  socket.on('send_team_message', handleMessage);
  socket.on('send_message', handleMessage);

  socket.on('disconnect', () => {
    // Clean up if needed
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = getDBStatus();
  res.status(200).json({
    status: 'ok',
    service: 'SkillBridge API & Real-Time Engine',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: {
      connected: dbStatus.connected,
      state: dbStatus.readyState === 1 ? 'Connected' : 'Disconnected / Standby',
    },
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/files', fileRoutes);

// Centralized error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

server.listen(PORT, () => {
  console.log(`🚀 [SkillBridge Server]: Running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`📡 [Health Check]: http://localhost:${PORT}/api/health`);
});

export { app, server, io };
