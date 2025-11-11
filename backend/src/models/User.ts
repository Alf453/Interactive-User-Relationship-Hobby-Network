import { Schema, model } from "mongoose";
export interface IUser {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
  friends: string[];
  createdAt: Date;
  popularityScore: number;
}
const UserSchema = new Schema<IUser>({
  id: { type: String, required: true, unique: true, index: true },
  username: { type: String, required: true },
  age: { type: Number, required: true, min: 0 },
  hobbies: { type: [String], default: [] },
  friends: { type: [String], default: [] },
  createdAt: { type: Date, default: () => new Date() },
  popularityScore: { type: Number, default: 0 },
});
export const User = model<IUser>("User", UserSchema);
