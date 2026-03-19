"use client";

import { motion } from "framer-motion";
import { GraphNode, GraphEdge } from "../store/graphStore";
import { NodePosition } from "../hooks/useGraphLayout";

const NODE_R = 26;

interface GraphNodeLayerProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  positions: Map<string, NodePosition>;
  assignments: number[][];
  hoveredNode: string | null;
  onHoverNode: (id: string | null) => void;
}

export function GraphNodeLayer({
  nodes, edges, positions, assignments, hoveredNode, onHoverNode,
}: GraphNodeLayerProps) {
  const assignedIds = new Set([
    ...assignments.map(([r]) => `a${r}`),
    ...assignments.map(([, c]) => `t${c}`),
  ]);

  return (
    <>
      {nodes.map((node, idx) => {
        const pos = positions.get(node.id);
        if (!pos) return null;

        const isAgent    = node.type === "agent";
        const isAssigned = assignedIds.has(node.id);
        const isHovered  = hoveredNode === node.id;

        const connectedEdges = edges.filter(
          (e) => e.source === node.id || e.target === node.id
        );
        const isConnectedToHovered =
          hoveredNode !== null &&
          connectedEdges.some(
            (e) => e.source === hoveredNode || e.target === hoveredNode
          );

        const fillColor = isAssigned
          ? (isAgent ? "#065f46" : "#1e3a5f")
          : isHovered
          ? (isAgent ? "#0c4a6e" : "#4c1d95")
          : (isAgent ? "#0f172a" : "#1e1b4b");

        const strokeColor = isAssigned
          ? (isAgent ? "#10b981" : "#38bdf8")
          : isHovered
          ? (isAgent ? "#38bdf8" : "#a78bfa")
          : isConnectedToHovered
          ? "#475569"
          : "#334155";

        const strokeWidth = isAssigned ? 2.5 : isHovered ? 2 : 1.5;
        const textColor   = isAssigned
          ? (isAgent ? "#6ee7b7" : "#93c5fd")
          : "#e2e8f0";

        return (
          <motion.g
            key={node.id}
            style={{ cursor: "pointer" }}
            onMouseEnter={() => onHoverNode(node.id)}
            onMouseLeave={() => onHoverNode(null)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 20, delay: idx * 0.06 }}
            whileHover={{ scale: 1.12 }}
          >
            {/* Halo glow assigné */}
            {isAssigned && (
              <motion.circle
                cx={pos.x} cy={pos.y} r={NODE_R + 8}
                fill={isAgent ? "#10b981" : "#38bdf8"}
                fillOpacity={0.12}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.2, 0.12] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            )}

            {/* Halo hover */}
            {isHovered && (
              <circle
                cx={pos.x} cy={pos.y} r={NODE_R + 6}
                fill="transparent"
                stroke={isAgent ? "#38bdf8" : "#a78bfa"}
                strokeWidth={1} strokeOpacity={0.4} strokeDasharray="4 3"
              />
            )}

            {/* Cercle principal */}
            <motion.circle
              cx={pos.x} cy={pos.y} r={NODE_R}
              fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}
              animate={{ fill: fillColor, stroke: strokeColor, strokeWidth }}
              transition={{ duration: 0.3 }}
            />

            {/* Type label */}
            <text
              x={pos.x} y={pos.y - NODE_R - 8}
              textAnchor="middle" fontSize={9}
              fontFamily="monospace" fill="#64748b"
              fontWeight="500" letterSpacing="0.05em"
            >
              {isAgent ? "AGENT" : "TÂCHE"}
            </text>

            {/* Label principal */}
            <text
              x={pos.x} y={pos.y + 1}
              textAnchor="middle" dominantBaseline="middle"
              fontSize={13} fontFamily="monospace" fontWeight="bold" fill={textColor}
            >
              {node.label}
            </text>

            {/* Badge ✓ */}
            {isAssigned && (
              <motion.g
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.2 }}
              >
                <circle
                  cx={pos.x + NODE_R - 4} cy={pos.y - NODE_R + 4} r={8}
                  fill={isAgent ? "#10b981" : "#38bdf8"}
                />
                <text
                  x={pos.x + NODE_R - 4} y={pos.y - NODE_R + 4}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={9} fill="white" fontWeight="bold"
                >
                  ✓
                </text>
              </motion.g>
            )}
          </motion.g>
        );
      })}
    </>
  );
}