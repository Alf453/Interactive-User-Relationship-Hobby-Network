import { describe, it, expect } from "vitest";
import request from "supertest";
import express from "express";
import { errorHandler } from "../src/middlewares/errorHandler";
import userRoutes from "../src/routes/userRoutes";
const app = express();
app.use(express.json());
app.use("/api", userRoutes);
app.use(errorHandler);
describe("User validation", () => {
  it("rejects invalid body", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ username: "", age: -1, hobbies: "oops" });
    expect(res.status).toBe(400);
  });
});
