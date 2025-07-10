import express, { Application, Request, Response } from 'express';
import connectDB from './config/database'; // Import database connection function
import dotenv from 'dotenv'; // To load .env variables for PORT
import path from 'path';
import { createServer, Server } from 'http';
import { setupWebSocket } from './config/websocket';

// Load environment variables
dotenv.config(); // If .env is not in root, specify path

// Connect to Database
connectDB();

const app: Application = express();
const PORT: number | string = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Basic Route (can be removed or kept for health check)
app.get('/', (req: Request, res: Response) => {
  res.send('My Belongings Hub Backend API is running!');
});

// API Routes
// Add item routes
import itemRoutes from './routes/itemRoutes';
import serviceHistoryRoutes from './routes/serviceHistoryRoutes';
app.use('/api/items', itemRoutes);
app.use('/api/items/:itemId/history', serviceHistoryRoutes);

// Add auth routes
import authRoutes from './routes/authRoutes';
app.use('/api/auth', authRoutes);

// Add upload routes
import uploadRoutes from './routes/uploads';
app.use('/api/uploads', uploadRoutes);

// Add reminder routes
import reminderRoutes from './routes/reminderRoutes';
app.use('/api/reminders', reminderRoutes);

// Add diagnostic routes
import diagnosticRoutes from './routes/diagnosticRoutes';
app.use('/api/diagnostics', diagnosticRoutes);

// Add technician routes
import technicianRoutes from './routes/technicianRoutes';
app.use('/api/technicians', technicianRoutes);

// Add push notification routes
import pushNotificationRoutes from './routes/pushNotificationRoutes';
app.use('/api/notifications', pushNotificationRoutes);

// Add chat routes
import chatRoutes from './routes/chatRoutes';
app.use('/api/chat', chatRoutes);

// Add group routes
import groupRoutes from './routes/groupRoutes';
app.use('/api/groups', groupRoutes);

// Add forum routes
import forumRoutes from './routes/forumRoutes';
app.use('/api/forums', forumRoutes);

// Add notification routes
import notificationRoutes from './routes/notificationRoutes';
app.use('/api/notifications', notificationRoutes);

// Add review routes
import reviewRoutes from './routes/reviewRoutes';
app.use('/api/reviews', reviewRoutes);

// Add report routes
import reportRoutes from './routes/reportRoutes';
app.use('/api/reports', reportRoutes);

// Add gamification routes
import gamificationRoutes from './routes/gamificationRoutes';
app.use('/api/gamification', gamificationRoutes);

// Add badge routes
import badgeRoutes from './routes/badgeRoutes';
app.use('/api/badges', badgeRoutes);

// Add leaderboard routes
import leaderboardRoutes from './routes/leaderboardRoutes';
app.use('/api/leaderboard', leaderboardRoutes);

// Add listing routes
import listingRoutes from './routes/listingRoutes';
app.use('/api/listings', listingRoutes);

// Add payment routes
import paymentRoutes from './routes/paymentRoutes';
app.use('/api/payments', paymentRoutes);

// Add order routes
import orderRoutes from './routes/orderRoutes';
app.use('/api/orders', orderRoutes);

// Add dispute routes
import disputeRoutes from './routes/disputeRoutes';
app.use('/api/disputes', disputeRoutes);

// Add referral routes
import referralRoutes from './routes/referralRoutes';
app.use('/api/referrals', referralRoutes);

// Add NPS routes
import npsRoutes from './routes/npsRoutes';
app.use('/api/nps', npsRoutes);

// Add feature flag routes
import featureFlagRoutes from './routes/featureFlagRoutes';
app.use('/api/feature-flags', featureFlagRoutes);

// TODO: Add other general user routes if needed (e.g., /api/users for profile updates not covered by /auth/me)

const server: Server = createServer(app);

setupWebSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
