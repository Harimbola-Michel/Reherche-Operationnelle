"use client";

import { useRef, useState, useCallback } from "react";
import { useGraphLayout } from "../hooks/useGraphLayout";
import { GraphEdgeLayer } from "./GraphEdgeLayer";
import { GraphNodeLayer } from "./GraphNodeLayer";
import { useGraphStore } from "../store/graphStore";

const WIDTH  = 600;
const HEIGHT = 400;

export function GraphCanvas() {
  const { nodes, edges, assignments, mode, hoveredNode, hoveredEdge,
          setHoveredNode, setHoveredEdge } = useGraphStore();

  const positions = useGraphLayout(nodes, { width: WIDTH, height: HEIGHT });

  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false); // ← useState pour le curseur
  const isPanning = useRef(false);                      // ← useRef pour la logique interne
  const lastPos   = useRef({ x: 0, y: 0 });
  const lastTouch = useRef({ x: 0, y: 0 });

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
    setIsDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setTransform((t) => ({ ...t, x: t.x + dx, y: t.y + dy }));
  }, []);

  const onMouseUp = useCallback(() => {
    isPanning.current = false;
    setIsDragging(false);
  }, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isPanning.current = true;
      setIsDragging(true);
      lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPanning.current || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - lastTouch.current.x;
    const dy = e.touches[0].clientY - lastTouch.current.y;
    lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    setTransform((t) => ({ ...t, x: t.x + dx, y: t.y + dy }));
  }, []);

  const onTouchEnd = useCallback(() => {
    isPanning.current = false;
    setIsDragging(false);
  }, []);

  const resetView = () => setTransform({ x: 0, y: 0, scale: 1 });

  if (nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 sm:h-64 gap-3 text-center">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-300 text-xl sm:text-2xl">⬡</div>
        <p className="font-mono text-sm font-bold text-slate-500">Lance une résolution d&apos;abord</p>
      </div>
    );
  }

  return (
    <div className="relative w-full select-none">
      {/* Toolbar */}
      <div className="absolute top-2 right-2 z-10 flex gap-1">
        {[
          { label: "+", action: () => setTransform((t) => ({ ...t, scale: Math.min(2.5, t.scale + 0.2) })) },
          { label: "−", action: () => setTransform((t) => ({ ...t, scale: Math.max(0.5, t.scale - 0.2) })) },
          { label: "⊙", action: resetView },
        ].map(({ label, action }) => (
          <button
            key={label}
            onClick={action}
            className="w-7 h-7 rounded-lg border border-slate-600 bg-slate-800/80 text-slate-300 hover:text-white text-sm flex items-center justify-center transition-colors font-mono backdrop-blur-sm"
          >{label}</button>
        ))}
      </div>

      {/* SVG Canvas */}
      <svg
        width="100%"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-950 touch-none"
        style={{ display: "block", cursor: isDragging ? "grabbing" : "grab" }}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <defs>
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width={WIDTH} height={HEIGHT} fill="url(#grid)" />

        <line x1={WIDTH/2} y1={30} x2={WIDTH/2} y2={HEIGHT-20} stroke="#1e293b" strokeWidth={1} strokeDasharray="6 4" />
        <text x={WIDTH*0.22} y={HEIGHT-8} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="#475569" letterSpacing="0.08em">AGENTS</text>
        <text x={WIDTH*0.78} y={HEIGHT-8} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="#475569" letterSpacing="0.08em">TÂCHES</text>

        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
          <GraphEdgeLayer
            edges={edges}
            positions={positions}
            hoveredNode={hoveredNode}
            hoveredEdge={hoveredEdge}
            mode={mode}
            onHoverEdge={setHoveredEdge}
          />
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

      <p className="text-center font-mono text-[10px] text-slate-400 mt-1.5 hidden sm:block">
        Molette pour zoomer · Glisser pour déplacer
      </p>
      <p className="text-center font-mono text-[10px] text-slate-400 mt-1.5 sm:hidden">
        Glisser pour déplacer
      </p>
    </div>
  );
}