import { z } from "zod";
import { Request, Response, NextFunction } from "express";
export const userSchema = z.object({
  username: z.string().min(1),
  age: z.number().int().nonnegative(),
  hobbies: z.array(z.string()).default([]),
});
export function validateBody(schema: z.ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.body = schema.parse(req.body);
    next();
  };
}
