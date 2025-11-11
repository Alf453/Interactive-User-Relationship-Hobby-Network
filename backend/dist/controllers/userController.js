"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.postUser = postUser;
exports.putUser = putUser;
exports.removeUser = removeUser;
exports.link = link;
exports.unlink = unlink;
const userService_1 = require("../services/userService");
async function getUsers(_req, res, next) {
    try {
        res.json(await (0, userService_1.listUsers)());
    }
    catch (e) {
        next(e);
    }
}
async function postUser(req, res, next) {
    try {
        res.status(201).json(await (0, userService_1.createUser)(req.body));
    }
    catch (e) {
        next(e);
    }
}
async function putUser(req, res, next) {
    try {
        res.json(await (0, userService_1.updateUser)(req.params.id, req.body));
    }
    catch (e) {
        next(e);
    }
}
async function removeUser(req, res, next) {
    try {
        res.json(await (0, userService_1.deleteUser)(req.params.id));
    }
    catch (e) {
        next(e);
    }
}
async function link(req, res, next) {
    try {
        res.json(await (0, userService_1.linkFriends)(req.params.id, req.body.friendId));
    }
    catch (e) {
        next(e);
    }
}
async function unlink(req, res, next) {
    try {
        res.json(await (0, userService_1.unlinkFriends)(req.params.id, req.body.friendId));
    }
    catch (e) {
        next(e);
    }
}
