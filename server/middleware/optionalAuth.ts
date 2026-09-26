import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

/**
 * Like `auth`, but never blocks the request. If a valid token is present it sets
 * req.user; otherwise the request just continues as a guest. Used by endpoints
 * (like chat support) that should work for anyone, but personalize when logged in.
 *
 * Deliberately never sends a 401 here - the client's axios interceptor logs the
 * user out and redirects to /login on any 401, which would be the wrong behavior
 * for an endpoint that's supposed to work for guests too.
 */
const optionalAuth = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET as string) as { id: string };
      req.user = { id: decoded.id };
    } catch {
      // invalid/expired token - treat as a guest instead of failing the request
    }
  }
  next();
};

export default optionalAuth;
