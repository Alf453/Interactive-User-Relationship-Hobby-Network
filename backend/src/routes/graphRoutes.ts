import { Router } from "express";
import { getGraph } from "../controllers/graphController";

const router = Router();

// ✅ Correct endpoint
router.get("/", getGraph);

export default router;
