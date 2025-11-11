import { createContext, useContext, useEffect, useMemo, useState } from "react";

import api from "../api/client";

// ✅ TYPES
export type User = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
  friends: string[];
  createdAt: string;
  popularityScore: number;
};

export type GraphNode = {
  id: string;
  type: string;
  data: {
    username: string;
    age: number;
    popularityScore: number;
    onAddHobby?: (hobby: string) => void;
  };
};

export type GraphEdge = {
  id: string;
  source: string;
  target: string;
};

export type GraphData = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

// ✅ CONTEXT TYPE
type Ctx = {
  users: User[];
  graph: GraphData | null;
  refresh(): Promise<void>;
  addUser(u: {
    username: string;
    age: number;
    hobbies: string[];
  }): Promise<void>;
  updateUser(
    id: string,
    patch: Partial<Pick<User, "username" | "age" | "hobbies">>
  ): Promise<void>;
  deleteUser(id: string): Promise<void>;
  link(a: string, b: string): Promise<void>;
  unlink(a: string, b: string): Promise<void>;
  hobbies: string[];
  setHobbies(h: string[]): void;
};

const AppContext = createContext<Ctx>(null as any);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [graph, setGraph] = useState<GraphData | null>(null);

  const [hobbies, setHobbies] = useState<string[]>([
    "music",
    "travel",
    "coding",
    "reading",
    "gaming",
    "sports",
    "art",
    "tech",
  ]);

  // ✅ FIXED refresh
  const refresh = async () => {
    try {
      const [u, g] = await Promise.all([api.get("/users"), api.get("/graph")]);

      console.log("Users API:", u.data);
      console.log("Graph API:", g.data);

      // ✅ Always array
      const userList = Array.isArray(u.data) ? u.data : [];
      setUsers(userList);

      // ✅ Always graph object
      const graphData =
        g.data && Array.isArray(g.data.nodes) && Array.isArray(g.data.edges)
          ? g.data
          : { nodes: [], edges: [] };

      setGraph(graphData);

      // ✅ FIXED this part — loop on userList, not u.data
      const hobbySet = new Set<string>(hobbies);
      userList.forEach((user: User) => {
        (user.hobbies || []).forEach((h: string) => hobbySet.add(h));
      });

      setHobbies(Array.from(hobbySet));
    } catch (err) {
      console.error("Refresh error:", err);
    }
  };

  const addUser = async (u: {
    username: string;
    age: number;
    hobbies: string[];
  }) => {
    await api.post("/users", u);
    await refresh();
  };

  const updateUser = async (
    id: string,
    patch: Partial<Pick<User, "username" | "age" | "hobbies">>
  ) => {
    await api.put(`/users/${id}`, patch);
    await refresh();
  };

  const deleteUser = async (id: string) => {
    await api.delete(`/users/${id}`);
    await refresh();
  };

  const link = async (a: string, b: string) => {
    await api.post(`/users/${a}/link`, { friendId: b });
    await refresh();
  };

  const unlink = async (a: string, b: string) => {
    await api.delete(`/users/${a}/unlink`, { data: { friendId: b } });
    await refresh();
  };

  useEffect(() => {
    refresh();
  }, []);

  const value = useMemo(
    () => ({
      users,
      graph,
      refresh,
      addUser,
      updateUser,
      deleteUser,
      link,
      unlink,
      hobbies,
      setHobbies,
    }),
    [users, graph, hobbies]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);
