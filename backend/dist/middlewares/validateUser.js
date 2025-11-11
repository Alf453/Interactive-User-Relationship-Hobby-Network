"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
exports.validateBody = validateBody;
const zod_1 = require("zod");
exports.userSchema = zod_1.z.object({
    username: zod_1.z.string().min(1),
    age: zod_1.z.number().int().nonnegative(),
    hobbies: zod_1.z.array(zod_1.z.string()).default([]),
});
function validateBody(schema) {
    return (req, _res, next) => {
        req.body = schema.parse(req.body);
        next();
    };
}
