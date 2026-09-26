import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

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
