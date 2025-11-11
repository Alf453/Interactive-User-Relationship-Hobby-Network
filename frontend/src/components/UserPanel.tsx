import React, { useState } from "react";
import { useApp } from "../context/AppStore";
export type User = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
  friends: string[];
  createdAt: string;
  popularityScore: number;
};
export default function UserPanel() {
  const { users, addUser, updateUser, deleteUser } = useApp();
  const [username, setUsername] = useState("");
  const [age, setAge] = useState<number>(20);
  const [hobbies, setHobbies] = useState<string>("coding,reading");

  const [editing, setEditing] = useState<User | null>(null);
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState<number>(20);
  const [editHobbies, setEditHobbies] = useState("");

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      username,
      age: Number(age),
      hobbies: hobbies
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    await addUser(payload);
    setUsername("");
    setAge(20);
    setHobbies("");
  };

  const startEdit = (u: User) => {
    setEditing(u);
    setEditName(u.username);
    setEditAge(u.age);
    setEditHobbies(u.hobbies.join(","));
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    await updateUser(editing.id, {
      username: editName,
      age: Number(editAge),
      hobbies: editHobbies
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
    setEditing(null);
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete user? Ensure they have no friends.")) return;
    try {
      await deleteUser(id);
    } catch (e: any) {
      alert(e?.response?.data?.error ?? "Error deleting");
    }
  };

  return (
    <div className="panel">
      <h3>Create User</h3>
      <form onSubmit={onCreate}>
        <input
          required
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <input
          required
          type="number"
          min={0}
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
        />
        <br />
        <input
          placeholder="Hobbies (comma separated)"
          value={hobbies}
          onChange={(e) => setHobbies(e.target.value)}
        />
        <br />
        <button type="submit">Add</button>
      </form>

      {editing && (
        <div>
          <h3>Edit User</h3>
          <form onSubmit={saveEdit}>
            <input
              required
              placeholder="Username"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <br />
            <input
              required
              type="number"
              min={0}
              placeholder="Age"
              value={editAge}
              onChange={(e) => setEditAge(Number(e.target.value))}
            />
            <br />
            <textarea
              placeholder="Hobbies (comma separated)"
              value={editHobbies}
              onChange={(e) => setEditHobbies(e.target.value)}
            />
            <div className="row">
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditing(null)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <h3>Users</h3>
      <div className="list">
        {users.map((u) => (
          <div
            key={u.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #eee",
              padding: "6px 0",
            }}
          >
            <div>
              <strong>{u.username}</strong> ({u.age}) • Score{" "}
              {u.popularityScore}
              <div style={{ fontSize: 12, opacity: 0.8 }}>
                Hobbies: {u.hobbies.join(", ") || "—"}
              </div>
            </div>
            <div className="row">
              <button onClick={() => startEdit(u)}>Edit</button>
              <button onClick={() => onDelete(u.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
