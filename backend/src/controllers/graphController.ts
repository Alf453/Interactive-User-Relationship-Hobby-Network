import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
export async function getGraph(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await User.find({}).lean();
    const nodes = users.map((u) => ({
      id: u.id,
      data: {
        username: u.username,
        age: u.age,
        popularityScore: u.popularityScore,
      },
      type: u.popularityScore > 5 ? "HighScoreNode" : "LowScoreNode",
    }));
    const edges: { id: string; source: string; target: string }[] = [];
    const seen = new Set<string>();
    for (const u of users)
      for (const f of u.friends) {
        const key = [u.id, f].sort().join("-");
        if (!seen.has(key)) {
          seen.add(key);
          edges.push({ id: key, source: u.id, target: f });
        }
      }
    res.json({ nodes, edges });
  } catch (e) {
    next(e);
  }
}
