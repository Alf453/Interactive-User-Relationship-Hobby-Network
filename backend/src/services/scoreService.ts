import { IUser, User } from "../models/User";
export async function computePopularity(user: IUser): Promise<number> {
  const uniqueFriends = new Set(user.friends);
  const friendDocs = await User.find({
    id: { $in: Array.from(uniqueFriends) },
  });
  return computePopularityPure(user, friendDocs);
}
export function computePopularityPure(
  user: Pick<IUser, "hobbies" | "friends">,
  friendDocs: Array<Pick<IUser, "hobbies">>
) {
  const uniqueFriends = new Set(user.friends);
  const hobbies = new Set(user.hobbies);
  let shared = 0;
  for (const f of friendDocs)
    for (const h of f.hobbies) if (hobbies.has(h)) shared += 1;
  return uniqueFriends.size + shared * 0.5;
}
export async function recomputeForUsers(userIds: string[]) {
  const ids = Array.from(new Set(userIds));
  const users = await User.find({ id: { $in: ids } });
  for (const u of users) {
    u.popularityScore = await computePopularity(u);
    await u.save();
  }
}
