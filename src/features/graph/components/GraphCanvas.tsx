"use client";

import { useRef, useState, useCallback } from "react";
import { useGraphLayout } from "../hooks/useGraphLayout";
import { GraphEdgeLayer } from "./GraphEdgeLayer";
import { GraphNodeLayer } from "./GraphNodeLayer";
import { useGraphStore } from "../store/graphStore";

const WIDTH  = 600;
const HEIGHT = 420;

export function GraphCanvas() {
  const { nodes, edges, assignments, mode, hoveredNode, hoveredEdge,
          setHoveredNode, setHoveredEdge } = useGraphStore();

  const positions = useGraphLayout(nodes, { width: WIDTH, height: HEIGHT });

  // Zoom / Pan
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const isPanning = useRef(false);
  const lastPos   = useRef({ x: 0, y: 0 });

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setTransform((t) => ({
      ...t,
      scale: Math.max(0.5, Math.min(2.5, t.scale - e.deltaY * 0.001)),
    }));
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isPanning.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setTransform((t) => ({ ...t, x: t.x + dx, y: t.y + dy }));
  }, []);

  const onMouseUp = useCallback(() => { isPanning.current = false; }, []);

  const resetView = () => setTransform({ x: 0, y: 0, scale: 1 });

  if (nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
        <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-300 text-2xl">
          ⬡
        </div>
        <p className="font-mono text-sm font-bold text-slate-500">Graphe non disponible</p>
        <p className="font-mono text-xs text-slate-400">Lance une résolution pour voir le graphe</p>
      </div>
    );
  }

  return (
    <div className="relative w-full select-none">
      {/* Toolbar */}
      <div className="absolute top-3 right-3 z-10 flex gap-1.5">
        <button
          onClick={() => setTransform((t) => ({ ...t, scale: Math.min(2.5, t.scale + 0.2) }))}
          className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-700 text-sm flex items-center justify-center shadow-sm transition-colors"
        >+</button>
        <button
          onClick={() => setTransform((t) => ({ ...t, scale: Math.max(0.5, t.scale - 0.2) }))}
          className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-700 text-sm flex items-center justify-center shadow-sm transition-colors"
        >−</button>
        <button
          onClick={resetView}
          className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-400 hover:text-slate-700 text-xs flex items-center justify-center shadow-sm transition-colors font-mono"
          title="Réinitialiser la vue"
        >⊙</button>
      </div>

      {/* SVG Canvas */}
      <svg
        width="100%"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-950 cursor-grab active:cursor-grabbing"
        style={{ display: "block" }}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {/* Fond grille */}
        <defs>
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" strokeWidth="0.5" />
          </pattern>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width={WIDTH} height={HEIGHT} fill="url(#grid)" />

        {/* Séparateur centre */}
        <line
          x1={WIDTH / 2} y1={40}
          x2={WIDTH / 2} y2={HEIGHT - 40}
          stroke="#1e293b"
          strokeWidth={1}
          strokeDasharray="6 4"
        />
        <text x={WIDTH / 2} y={22} textAnchor="middle" fontSize={9}
          fontFamily="monospace" fill="#334155" letterSpacing="0.1em">
          GRAPHE BIPARTI
        </text>

        {/* Labels colonnes */}
        <text x={WIDTH * 0.22} y={HEIGHT - 16} textAnchor="middle"
          fontSize={9} fontFamily="monospace" fill="#475569" letterSpacing="0.08em">
          AGENTS
        </text>
        <text x={WIDTH * 0.78} y={HEIGHT - 16} textAnchor="middle"
          fontSize={9} fontFamily="monospace" fill="#475569" letterSpacing="0.08em">
          TÂCHES
        </text>

        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}
           style={{ transformOrigin: `${WIDTH / 2}px ${HEIGHT / 2}px` }}>
          {/* Arcs en dessous des nœuds */}
          <GraphEdgeLayer
            edges={edges}
            positions={positions}
            hoveredNode={hoveredNode}
            hoveredEdge={hoveredEdge}
            mode={mode}
            onHoverEdge={setHoveredEdge}
          />
          {/* Nœuds au-dessus */}
          <GraphNodeLayer
            nodes={nodes}
            edges={edges}
            positions={positions}
            assignments={assignments}
            hoveredNode={hoveredNode}
            onHoverNode={setHoveredNode}
          />
        </g>
      </svg>

      {/* Hint zoom */}
      <p className="text-center font-mono text-[10px] text-slate-400 mt-2">
        Molette pour zoomer · Cliquer-glisser pour déplacer · Survol pour détails
      </p>
    </div>
  );
}