// backend/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken, AuthTokenPayload } from '../utils/jwtUtils';
import * as userService from '../services/userService'; // To fetch user details if needed

// Extend Express Request type to include the user payload
declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload & { id: string }; // id is same as userId from AuthTokenPayload but often referred to as id
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      if (!token) {
        res.status(401).json({ message: 'Not authorized, no token provided after Bearer scheme' });
        return;
      }

      const decoded = verifyToken(token); // Verifies and decodes the token

      // Attach user information to the request object
      // The payload from verifyToken is AuthTokenPayload { userId: string, email: string }
      // We can rename userId to id for consistency if other parts of app expect req.user.id
      req.user = {
        id: decoded.userId, // Map userId to id
        userId: decoded.userId,
        email: decoded.email
      };

      // Optional: You could fetch the full user object from the database here if needed for further checks
      // const fullUser = await userService.findUserById(decoded.userId);
      // if (!fullUser) {
      //   res.status(401).json({ message: 'Not authorized, user not found' });
      //   return;
      // }
      // req.user = fullUser; // If you attach the full user object

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error('Token verification failed:', error);
      // Handle specific JWT errors if necessary (e.g., TokenExpiredError)
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        res.status(401).json({ message: 'Not authorized, token expired' });
      } else if (error instanceof Error && error.name === 'JsonWebTokenError') {
        res.status(401).json({ message: 'Not authorized, token invalid' });
      } else {
        res.status(401).json({ message: 'Not authorized, token verification failed' });
      }
      return;
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token in headers or wrong scheme' });
  }
};
