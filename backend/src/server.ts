import express, { Application, Request, Response } from 'express';

const app: Application = express();
const PORT: number | string = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Route
app.get('/', (req: Request, res: Response) => {
  res.send('My Belongings Hub Backend is running!');
});

// TODO: Add other routes (e.g., itemRoutes, userRoutes)
// Example:
// import itemRoutes from './routes/itemRoutes';
// app.use('/api/items', itemRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
