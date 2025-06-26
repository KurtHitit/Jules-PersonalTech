import express, { Application, Request, Response } from 'express';
import connectDB from './config/database'; // Import database connection function
import dotenv from 'dotenv'; // To load .env variables for PORT

// Load environment variables
dotenv.config(); // If .env is not in root, specify path

// Connect to Database
connectDB();

const app: Application = express();
const PORT: number | string = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Basic Route (can be removed or kept for health check)
app.get('/', (req: Request, res: Response) => {
  res.send('My Belongings Hub Backend API is running!');
});

// API Routes
// Add item routes
import itemRoutes from './routes/itemRoutes';
app.use('/api/items', itemRoutes);

// Add auth routes
import authRoutes from './routes/authRoutes';
app.use('/api/auth', authRoutes);

// TODO: Add other general user routes if needed (e.g., /api/users for profile updates not covered by /auth/me)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
