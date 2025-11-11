import React from "react";
import { Handle, Position } from "reactflow";

export default function HighScoreNode({ data }: any) {
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const hobby = e.dataTransfer.getData("text/plain");
    if (!hobby) return;
    data.onAddHobby?.(hobby);
  };
  return (
    <div
      className="node high"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      style={{
        transform: `scale(${1 + Math.min(0.5, data.popularityScore / 10)})`,
      }}
    >
      <strong>⭐ {data.username}</strong>
      <div>Age: {data.age}</div>
      <div>Score: {data.popularityScore}</div>
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
}
