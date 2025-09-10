import fs from 'fs/promises';
import path from 'path';
import { Graph, Node, PathFilter, GraphResponse } from '../types/graph.types';
import config from '../config';

export class GraphService {
  private graph: Graph | null = null;

  async loadGraph(filePath: string = config.graph.filePath): Promise<Graph> {
    if (!this.graph) {
      try {
        const data = await fs.readFile(filePath, 'utf-8');
        this.graph = JSON.parse(data) as Graph;
      } catch (error) {
        console.error(`Failed to load graph from ${filePath}:`, error);
        throw new Error(`Failed to load graph: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    return this.graph;
  }

  findAllPaths(start: string, end: string): Node[][] {
    if (!this.graph) {
      throw new Error('Graph not loaded');
    }
    
    const paths: Node[][] = [];
    const visited = new Set<string>();
    const currentPath: Node[] = [];

    const dfs = (current: string) => {
      const currentNode = this.graph!.nodes.find(node => node.name === current);
      if (!currentNode) return;

      currentPath.push(currentNode);
      visited.add(current);

      if (current === end) {
        paths.push([...currentPath]);
      } else {
        const edge = this.graph!.edges.find(e => e.from === current);
        if (edge) {
          for (const next of edge.to) {
            if (!visited.has(next)) {
              dfs(next);
            }
          }
        }
      }

      currentPath.pop();
      visited.delete(current);
    };

    dfs(start);
    return paths;
  }

  applyFilters(paths: Node[][], filters: PathFilter[]): Node[][] {
    return paths.filter(path => filters.every(filter => filter(path, this.graph!)));
  }

  pathsToGraph(paths: Node[][]): GraphResponse {
    const nodes = new Map<string, Node>();
    const edges = new Set<string>();

    for (const path of paths) {
      for (const node of path) {
        nodes.set(node.name, node);
      }
      for (let i = 0; i < path.length - 1; i++) {
        edges.add(`${path[i].name}->${path[i + 1].name}`);
      }
    }

    return {
      nodes: Array.from(nodes.values()),
      edges: Array.from(edges).map(edge => {
        const [from, to] = edge.split('->');
        return { from, to };
      }),
    };
  }

  getFullGraph(): GraphResponse {
    if (!this.graph) {
      throw new Error('Graph not loaded');
    }

    return {
      nodes: this.graph.nodes,
      edges: this.graph.edges.flatMap(edge => 
        edge.to.map(to => ({ from: edge.from, to }))
      ),
    };
  }
}
