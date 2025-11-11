import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppStore";

export default function Sidebar() {
  const { hobbies } = useApp();
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () => hobbies.filter((h) => h.toLowerCase().includes(q.toLowerCase())),
    [hobbies, q]
  );

  const onDragStart = (e: React.DragEvent, hobby: string) => {
    e.dataTransfer.setData("text/plain", hobby);
  };

  return (
    <div className="sidebar">
      <h3>Hobbies</h3>
      <input
        placeholder="Search hobbies..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="list">
        {filtered.map((h) => (
          <div
            key={h}
            className="hobby"
            draggable
            onDragStart={(e) => onDragStart(e, h)}
          >
            {h}
          </div>
        ))}
      </div>
      <p style={{ fontSize: 12, opacity: 0.7 }}>
        Drag a hobby and drop onto a node to add.
      </p>
      <hr />
      <div style={{ fontSize: 12, opacity: 0.8 }}>
        Tip: Click an edge to unlink the friendship.
      </div>
    </div>
  );
}
