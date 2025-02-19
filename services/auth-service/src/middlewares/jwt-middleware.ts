import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "devsecret";

interface AuthenticationRequest extends Request {
    user?: {
        id: string,
        role: string,
    }
}

export const authenticateJWT = (allowedRoles: string[] = []) => {
    return (req: AuthenticationRequest, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(403).json({ error: "no authorization provided" });
        }

        try {
            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, SECRET_KEY) as { id: string; role: string };

            if (!decoded) {
                return res.status(401).json({ error: "invalid token" });
            }

            req.user = decoded;

            if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ error: "insufficient permissions" });
            }

            next();
        } catch (error) {
            return res.status(401).json({ error: "invalid or expired token" });
        }
    };
};