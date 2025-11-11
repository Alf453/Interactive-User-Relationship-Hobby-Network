"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true },
    age: { type: Number, required: true, min: 0 },
    hobbies: { type: [String], default: [] },
    friends: { type: [String], default: [] },
    createdAt: { type: Date, default: () => new Date() },
    popularityScore: { type: Number, default: 0 },
});
exports.User = (0, mongoose_1.model)("User", UserSchema);
