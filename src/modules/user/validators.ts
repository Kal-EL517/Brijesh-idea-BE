import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const userSchema = Joi.object({
  code: Joi.string().min(3).required(),
});

export const verifyUserCode = (req: Request, res: Response, next: NextFunction) => {
  const { error } = userSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ statusCode: 400, status: false, message: error.details.map(d => d.message) });
  }
  next();
};
