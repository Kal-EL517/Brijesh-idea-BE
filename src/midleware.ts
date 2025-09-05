import { NextFunction } from "express";
import { Codes, Message } from "./utils/message.utils";
import { JwtUtil } from "./utils/jwt.utility";
import { Utils } from "./utils/utils";

export class MiddleWare {
    public async authMiddleware(
        req: any,
        res: any,
        next: NextFunction
    ) {
        try {
            const authHeader = req.headers['authorization'];

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(Codes.UNAUTHORIZED).json(
                    {
                        statusCode: Codes.UNAUTHORIZED,
                        status: false,
                        message: Message.NOT_AUTHORIZED
                    }
                )
            }

            const token = authHeader.split(" ")[1];
            // Verify token
            const decoded = JwtUtil.verify(token);
            // Attach decoded payload to request object
            (req as any).user = decoded;
            req['userId'] = Utils.mongoID(decoded._id);
            next(); 
        } 
        catch (error) {
            return res.status(Codes.UNAUTHORIZED).json(
                {
                    statusCode: Codes.UNAUTHORIZED,
                    status: false,
                    message: Message.NOT_AUTHORIZED
                }
            )
        }
    }
}