import React, { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useEdgesState,
  useNodesState,
  Connection,
  Edge,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { useApp } from "../context/AppStore";
import HighScoreNode from "./nodes/HighScoreNode";
import LowScoreNode from "./nodes/LowScoreNode";

export default function GraphCanvas() {
  const { graph, users, link, unlink, updateUser } = useApp();
  const nodeTypes = useMemo(() => ({ HighScoreNode, LowScoreNode }), []);

  const initialNodes = (graph?.nodes ?? []).map((n, i) => ({
    id: n.id,
    type: n.type,
    position: { x: (i % 5) * 220 + 80, y: Math.floor(i / 5) * 160 + 60 },
    data: {
      ...n.data,
      onAddHobby: async (hobby: string) => {
        const user = users.find((u) => u.id === n.id);
        if (!user) return;
        if (user.hobbies.includes(hobby)) return;
        await updateUser(user.id, { hobbies: [...user.hobbies, hobby] });
      },
    },
  }));

  const initialEdges = (graph?.edges ?? []).map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges as Edge[]);
  }, [graph?.nodes?.length, graph?.edges?.length]);

  const onConnect = useCallback(
    async (params: Connection) => {
      if (!params.source || !params.target) return;
      try {
        await link(params.source, params.target);
      } catch (e: any) {
        alert(e?.response?.data?.error ?? "Link error");
      }
    },
    [link]
  );

  const onEdgeClick = useCallback(
    async (_: any, edge: Edge) => {
      if (!confirm(`Unlink ${edge.source} ↔ ${edge.target}?`)) return;
      try {
        await unlink(edge.source, edge.target);
      } catch (e: any) {
        alert(e?.response?.data?.error ?? "Unlink error");
      }
    },
    [unlink]
  );

  return (
    <div className="canvas">
      <div className="edge-hint">Tip: Click an edge to unlink users</div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
