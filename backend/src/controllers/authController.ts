// backend/src/controllers/authController.ts
import { Request, Response } from 'express';
import * as userService from '../services/userService'; // To be created
import { User, comparePassword } from '../models/User';
import { generateToken } from '../utils/jwtUtils';
// Basic validation, can be replaced with a library like express-validator
import { validationResult, body } from 'express-validator'; // Example, not fully implemented yet


// Placeholder for actual validation rules
// export const registerValidationRules = () => [
//   body('email').isEmail().withMessage('Please enter a valid email'),
//   body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
//   // Add firstName, lastName validation if needed
// ];

// export const loginValidationRules = () => [
//   body('email').isEmail().withMessage('Please enter a valid email'),
//   body('password').exists().withMessage('Password is required'),
// ];


// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  // Basic validation example (can be expanded with express-validator)
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: 'Please provide email and password' });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ message: 'Password must be at least 6 characters long' });
    return;
  }
  // A more robust email validation regex could be used here or a library.
  if (!/\S+@\S+\.\S+/.test(email)) {
      res.status(400).json({ message: 'Please provide a valid email address' });
      return;
  }


  try {
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    const newUser = await userService.createUser({ email, password, firstName, lastName });

    const token = generateToken({ id: newUser.id, email: newUser.email });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
    });
  } catch (error) {
    console.error('Error registering user:', error);
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error during registration', error: 'Unknown error' });
    }
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Please provide email and password' });
    return;
  }

  try {
    const user = await userService.findUserByEmail(email);
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials (user not found)' }); // Generic message
      return;
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials (password mismatch)' }); // Generic message
      return;
    }

    const token = generateToken({ id: user.id, email: user.email });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error during login', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error during login', error: 'Unknown error' });
    }
  }
};

// @desc    Get current authenticated user's profile
// @route   GET /api/auth/me
// @access  Private (will be protected by authMiddleware)
export const getMe = async (req: Request, res: Response): Promise<void> => {
  // This controller is hit AFTER authMiddleware has successfully run and attached `req.user`.
  const userId = req.user!.id; // Non-null assertion: req.user is guaranteed by 'protect' middleware

  try {
    const user = await userService.findUserById(userId);

    if (!user) {
      // This case should ideally not be hit if authMiddleware correctly validates
      // the token and the user still exists in DB.
      // Could indicate a desync or a deleted user whose token is still valid until expiry.
      res.status(404).json({ message: 'User not found for the authenticated token.' });
      return;
    }

    // Return non-sensitive user information
    res.status(200).json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Error fetching user profile (/me):', error);
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error fetching profile', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error fetching profile', error: 'Unknown error' });
    }
  }
};
