import { Request, Response, NextFunction } from "express";
export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const map: Record<string, { status: number; message: string }> = {
    NOT_FOUND: { status: 404, message: "Resource not found" },
    UNLINK_FIRST: {
      status: 409,
      message: "Unlink all friendships before deletion.",
    },
    ALREADY_LINKED: { status: 409, message: "Users are already linked." },
    NOT_LINKED: { status: 409, message: "Users are not linked." },
    SELF_LINK: { status: 400, message: "Cannot link a user to themselves." },
  };
  const known = map[err?.message];
  if (known) return res.status(known.status).json({ error: known.message });
  if (err?.name === "ZodError")
    return res
      .status(400)
      .json({ error: "Validation error", details: err.issues });
  console.error(err);
  return res.status(500).json({ error: "Internal Server Error" });
}
