"use client";

import { motion } from "framer-motion";
import { GraphEdge } from "../store/graphStore";
import { NodePosition } from "../hooks/useGraphLayout";

interface GraphEdgeLayerProps {
  edges: GraphEdge[];
  positions: Map<string, NodePosition>;
  hoveredNode: string | null;
  hoveredEdge: string | null;
  mode: "min" | "max";
  onHoverEdge: (id: string | null) => void;
}

export function GraphEdgeLayer({
  edges, positions, hoveredNode, hoveredEdge, mode, onHoverEdge,
}: GraphEdgeLayerProps) {

  const costs = edges.map((e) => e.cost);
  const minCost = Math.min(...costs);
  const maxCost = Math.max(...costs);

  return (
    <>
      {edges.map((edge, idx) => {
        const src = positions.get(edge.source);
        const tgt = positions.get(edge.target);
        if (!src || !tgt) return null;

        const isNodeHovered =
          hoveredNode === edge.source || hoveredNode === edge.target;
        const isEdgeHovered = hoveredEdge === edge.id;
        const isHighlighted = isNodeHovered || isEdgeHovered;

        // Couleur selon état
        let stroke = "#cbd5e1";        // slate-300 par défaut
        let strokeWidth = 1;
        let opacity = 0.35;

        if (edge.isAssigned) {
          stroke = "#10b981";          // emerald-500
          strokeWidth = 3;
          opacity = 1;
        } else if (edge.isActive) {
          stroke = "#38bdf8";          // sky-400
          strokeWidth = 2;
          opacity = 0.9;
        } else if (edge.isEliminated) {
          stroke = "#f87171";          // rose-400
          strokeWidth = 1;
          opacity = 0.25;
        } else if (isHighlighted) {
          stroke = mode === "min" ? "#38bdf8" : "#34d399";
          strokeWidth = 2;
          opacity = 0.85;
        } else if (
          (mode === "min" && edge.cost === minCost) ||
          (mode === "max" && edge.cost === maxCost)
        ) {
          stroke = mode === "min" ? "#fbbf24" : "#a78bfa";
          strokeWidth = 1.5;
          opacity = 0.6;
        }

        // Point de contrôle pour courbe de Bézier légère
        const mx = (src.x + tgt.x) / 2;
        const my = (src.y + tgt.y) / 2 + (idx % 2 === 0 ? -12 : 12);
        const d = `M ${src.x} ${src.y} Q ${mx} ${my} ${tgt.x} ${tgt.y}`;

        // Label coût — milieu de la courbe
        const labelX = mx;
        const labelY = my - 6;

        return (
          <g key={edge.id}>
            {/* Zone de hit invisible plus large */}
            <path
              d={d}
              fill="none"
              stroke="transparent"
              strokeWidth={16}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => onHoverEdge(edge.id)}
              onMouseLeave={() => onHoverEdge(null)}
            />

            {/* Arc animé */}
            <motion.path
              d={d}
              fill="none"
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity,
                stroke,
                strokeWidth,
              }}
              transition={{
                pathLength: { duration: 0.6, delay: idx * 0.03, ease: "easeOut" },
                opacity:    { duration: 0.4, delay: idx * 0.03 },
                stroke:     { duration: 0.3 },
                strokeWidth:{ duration: 0.3 },
              }}
              style={edge.isAssigned ? { filter: "drop-shadow(0 0 4px #10b98188)" } : undefined}
            />

            {/* Flèche sur arc assigné */}
            {edge.isAssigned && (
              <motion.circle
                cx={tgt.x}
                cy={tgt.y}
                r={5}
                fill="#10b981"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.3 }}
              />
            )}

            {/* Label coût */}
            {(isHighlighted || edge.isAssigned || edge.isActive) && (
              <motion.g
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.15 }}
              >
                <rect
                  x={labelX - 14}
                  y={labelY - 10}
                  width={28}
                  height={16}
                  rx={4}
                  fill={edge.isAssigned ? "#065f46" : "#0f172a"}
                  fillOpacity={0.85}
                />
                <text
                  x={labelX}
                  y={labelY + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={10}
                  fontFamily="monospace"
                  fontWeight="bold"
                  fill={edge.isAssigned ? "#6ee7b7" : "#94a3b8"}
                >
                  {edge.cost}
                </text>
              </motion.g>
            )}
          </g>
        );
      })}
    </>
  );
}