"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = listUsers;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.linkFriends = linkFriends;
exports.unlinkFriends = unlinkFriends;
const User_1 = require("../models/User");
const generateUUID_1 = require("../utils/generateUUID");
const scoreService_1 = require("./scoreService");
async function listUsers() {
    return User_1.User.find({}).lean();
}
async function createUser(data) {
    const doc = await User_1.User.create({
        id: (0, generateUUID_1.generateUUID)(),
        username: data.username,
        age: data.age,
        hobbies: data.hobbies ?? [],
        friends: [],
        createdAt: new Date(),
        popularityScore: 0,
    });
    await (0, scoreService_1.recomputeForUsers)([doc.id]);
    return doc.toObject();
}
async function updateUser(id, patch) {
    const user = await User_1.User.findOne({ id });
    if (!user) {
        const e = new Error("NOT_FOUND");
        throw e;
    }
    if (patch.username !== undefined)
        user.username = patch.username;
    if (patch.age !== undefined)
        user.age = patch.age;
    if (patch.hobbies !== undefined)
        user.hobbies = patch.hobbies;
    await user.save();
    await (0, scoreService_1.recomputeForUsers)([user.id, ...user.friends]);
    return user.toObject();
}
async function deleteUser(id) {
    const user = await User_1.User.findOne({ id });
    if (!user) {
        const e = new Error("NOT_FOUND");
        throw e;
    }
    if (user.friends.length > 0) {
        const e = new Error("UNLINK_FIRST");
        throw e;
    }
    await user.deleteOne();
    return { ok: true };
}
async function linkFriends(idA, idB) {
    if (idA === idB) {
        const e = new Error("SELF_LINK");
        throw e;
    }
    const [a, b] = await Promise.all([
        User_1.User.findOne({ id: idA }),
        User_1.User.findOne({ id: idB }),
    ]);
    if (!a || !b) {
        const e = new Error("NOT_FOUND");
        throw e;
    }
    if (a.friends.includes(idB) || b.friends.includes(idA)) {
        const e = new Error("ALREADY_LINKED");
        throw e;
    }
    a.friends.push(idB);
    b.friends.push(idA);
    await Promise.all([a.save(), b.save()]);
    await (0, scoreService_1.recomputeForUsers)([a.id, b.id, ...a.friends, ...b.friends]);
    return { ok: true };
}
async function unlinkFriends(idA, idB) {
    const [a, b] = await Promise.all([
        User_1.User.findOne({ id: idA }),
        User_1.User.findOne({ id: idB }),
    ]);
    if (!a || !b) {
        const e = new Error("NOT_FOUND");
        throw e;
    }
    const beforeA = a.friends.length, beforeB = b.friends.length;
    a.friends = a.friends.filter((f) => f !== idB);
    b.friends = b.friends.filter((f) => f !== idA);
    if (a.friends.length === beforeA && b.friends.length === beforeB) {
        const e = new Error("NOT_LINKED");
        throw e;
    }
    await Promise.all([a.save(), b.save()]);
    await (0, scoreService_1.recomputeForUsers)([a.id, b.id, ...a.friends, ...b.friends]);
    return { ok: true };
}
