import { Router } from "express";
import {
  getUsers,
  postUser,
  putUser,
  removeUser,
  link,
  unlink,
} from "../controllers/userController";
import { validateBody, userSchema } from "../middlewares/validateUser";

const router = Router();

// ✅ Correct paths
router.get("/", getUsers);
router.post("/", validateBody(userSchema), postUser);
router.put("/:id", validateBody(userSchema.partial()), putUser);
router.delete("/:id", removeUser);
router.post("/:id/link", link);
router.delete("/:id/unlink", unlink);

export default router;
