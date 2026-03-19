import { useMemo } from "react";
import { GraphNode } from "../store/graphStore";

export interface NodePosition {
  id: string;
  x: number;
  y: number;
}

interface UseGraphLayoutOptions {
  width: number;
  height: number;
}

/**
 * Calcule les positions des nœuds en layout biparti vertical :
 * agents  → colonne gauche
 * tâches  → colonne droite
 */
export function useGraphLayout(
  nodes: GraphNode[],
  { width, height }: UseGraphLayoutOptions
): Map<string, NodePosition> {
  return useMemo(() => {
    const agents = nodes.filter((n) => n.type === "agent");
    const tasks  = nodes.filter((n) => n.type === "task");

    const positions = new Map<string, NodePosition>();

    const leftX  = width * 0.22;
    const rightX = width * 0.78;
    const padding = 80;

    agents.forEach((node, idx) => {
      const total = agents.length;
      const step  = (height - padding * 2) / Math.max(total - 1, 1);
      positions.set(node.id, {
        id: node.id,
        x: leftX,
        y: total === 1 ? height / 2 : padding + idx * step,
      });
    });

    tasks.forEach((node, idx) => {
      const total = tasks.length;
      const step  = (height - padding * 2) / Math.max(total - 1, 1);
      positions.set(node.id, {
        id: node.id,
        x: rightX,
        y: total === 1 ? height / 2 : padding + idx * step,
      });
    });

    return positions;
  }, [nodes, width, height]);
}