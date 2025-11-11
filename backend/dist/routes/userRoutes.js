"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const validateUser_1 = require("../middlewares/validateUser");
const router = (0, express_1.Router)();
// ✅ Correct paths
router.get("/", userController_1.getUsers);
router.post("/", (0, validateUser_1.validateBody)(validateUser_1.userSchema), userController_1.postUser);
router.put("/:id", (0, validateUser_1.validateBody)(validateUser_1.userSchema.partial()), userController_1.putUser);
router.delete("/:id", userController_1.removeUser);
router.post("/:id/link", userController_1.link);
router.delete("/:id/unlink", userController_1.unlink);
exports.default = router;
