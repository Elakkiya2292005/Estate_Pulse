/**
 * Role-Based Access Control (RBAC) Middleware
 * Verifies role permissions for Admin, Agent, and Customer routes
 */
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authMiddleware.js';

export const authorizeRoles = (...allowedRoles: Array<'admin' | 'agent' | 'customer'>) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: Authentication required.',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Role [${req.user.role}] does not have permission to perform this action. Required: ${allowedRoles.join(' or ')}.`,
      });
      return;
    }

    next();
  };
};
