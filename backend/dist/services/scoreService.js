"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computePopularity = computePopularity;
exports.computePopularityPure = computePopularityPure;
exports.recomputeForUsers = recomputeForUsers;
const User_1 = require("../models/User");
async function computePopularity(user) {
    const uniqueFriends = new Set(user.friends);
    const friendDocs = await User_1.User.find({
        id: { $in: Array.from(uniqueFriends) },
    });
    return computePopularityPure(user, friendDocs);
}
function computePopularityPure(user, friendDocs) {
    const uniqueFriends = new Set(user.friends);
    const hobbies = new Set(user.hobbies);
    let shared = 0;
    for (const f of friendDocs)
        for (const h of f.hobbies)
            if (hobbies.has(h))
                shared += 1;
    return uniqueFriends.size + shared * 0.5;
}
async function recomputeForUsers(userIds) {
    const ids = Array.from(new Set(userIds));
    const users = await User_1.User.find({ id: { $in: ids } });
    for (const u of users) {
        u.popularityScore = await computePopularity(u);
        await u.save();
    }
}
