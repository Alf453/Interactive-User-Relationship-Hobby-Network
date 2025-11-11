export type User = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
  friends: string[];
  createdAt: string;
  popularityScore: number;
};

export type GraphData = {
  nodes: Array<{
    id: string;
    type: string;
    data: {
      username: string;
      age: number;
      popularityScore: number;
      onAddHobby?: (hobby: string) => void;
    };
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
  }>;
};
