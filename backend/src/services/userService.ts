import { User, IUser } from "../models/User";
import { generateUUID } from "../utils/generateUUID";
import { recomputeForUsers } from "./scoreService";

export async function listUsers() {
  return User.find({}).lean();
}

export async function createUser(
  data: Pick<IUser, "username" | "age" | "hobbies">
) {
  const doc = await User.create({
    id: generateUUID(),
    username: data.username,
    age: data.age,
    hobbies: data.hobbies ?? [],
    friends: [],
    createdAt: new Date(),
    popularityScore: 0,
  });
  await recomputeForUsers([doc.id]);
  return doc.toObject();
}

export async function updateUser(
  id: string,
  patch: Partial<Pick<IUser, "username" | "age" | "hobbies">>
) {
  const user = await User.findOne({ id });
  if (!user) {
    const e: any = new Error("NOT_FOUND");
    throw e;
  }
  if (patch.username !== undefined) user.username = patch.username;
  if (patch.age !== undefined) user.age = patch.age;
  if (patch.hobbies !== undefined) user.hobbies = patch.hobbies;
  await user.save();
  await recomputeForUsers([user.id, ...user.friends]);
  return user.toObject();
}

export async function deleteUser(id: string) {
  const user = await User.findOne({ id });
  if (!user) {
    const e: any = new Error("NOT_FOUND");
    throw e;
  }
  if (user.friends.length > 0) {
    const e: any = new Error("UNLINK_FIRST");
    throw e;
  }
  await user.deleteOne();
  return { ok: true };
}

export async function linkFriends(idA: string, idB: string) {
  if (idA === idB) {
    const e: any = new Error("SELF_LINK");
    throw e;
  }
  const [a, b] = await Promise.all([
    User.findOne({ id: idA }),
    User.findOne({ id: idB }),
  ]);
  if (!a || !b) {
    const e: any = new Error("NOT_FOUND");
    throw e;
  }
  if (a.friends.includes(idB) || b.friends.includes(idA)) {
    const e: any = new Error("ALREADY_LINKED");
    throw e;
  }
  a.friends.push(idB);
  b.friends.push(idA);
  await Promise.all([a.save(), b.save()]);
  await recomputeForUsers([a.id, b.id, ...a.friends, ...b.friends]);
  return { ok: true };
}

export async function unlinkFriends(idA: string, idB: string) {
  const [a, b] = await Promise.all([
    User.findOne({ id: idA }),
    User.findOne({ id: idB }),
  ]);
  if (!a || !b) {
    const e: any = new Error("NOT_FOUND");
    throw e;
  }
  const beforeA = a.friends.length,
    beforeB = b.friends.length;
  a.friends = a.friends.filter((f) => f !== idB);
  b.friends = b.friends.filter((f) => f !== idA);
  if (a.friends.length === beforeA && b.friends.length === beforeB) {
    const e: any = new Error("NOT_LINKED");
    throw e;
  }
  await Promise.all([a.save(), b.save()]);
  await recomputeForUsers([a.id, b.id, ...a.friends, ...b.friends]);
  return { ok: true };
}
