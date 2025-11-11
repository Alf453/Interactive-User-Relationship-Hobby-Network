"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGraph = getGraph;
const User_1 = require("../models/User");
async function getGraph(_req, res, next) {
    try {
        const users = await User_1.User.find({}).lean();
        const nodes = users.map((u) => ({
            id: u.id,
            data: {
                username: u.username,
                age: u.age,
                popularityScore: u.popularityScore,
            },
            type: u.popularityScore > 5 ? "HighScoreNode" : "LowScoreNode",
        }));
        const edges = [];
        const seen = new Set();
        for (const u of users)
            for (const f of u.friends) {
                const key = [u.id, f].sort().join("-");
                if (!seen.has(key)) {
                    seen.add(key);
                    edges.push({ id: key, source: u.id, target: f });
                }
            }
        res.json({ nodes, edges });
    }
    catch (e) {
        next(e);
    }
}
