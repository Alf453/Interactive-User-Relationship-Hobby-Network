import { Request, Response, NextFunction } from "express";
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  linkFriends,
  unlinkFriends,
} from "../services/userService";
export async function getUsers(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    res.json(await listUsers());
  } catch (e) {
    next(e);
  }
}
export async function postUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    res.status(201).json(await createUser(req.body));
  } catch (e) {
    next(e);
  }
}
export async function putUser(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await updateUser(req.params.id, req.body));
  } catch (e) {
    next(e);
  }
}
export async function removeUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    res.json(await deleteUser(req.params.id));
  } catch (e) {
    next(e);
  }
}
export async function link(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await linkFriends(req.params.id, req.body.friendId));
  } catch (e) {
    next(e);
  }
}
export async function unlink(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await unlinkFriends(req.params.id, req.body.friendId));
  } catch (e) {
    next(e);
  }
}
