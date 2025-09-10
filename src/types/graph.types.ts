export interface Vulnerability {
  file: string;
  severity: string;
  message: string;
  metadata: { cwe: string };
}

export interface Node {
  name: string;
  kind: string;
  language?: string;
  path?: string;
  publicExposed?: boolean;
  vulnerabilities?: Vulnerability[];
  metadata?: { cloud?: string; engine?: string; version?: string };
}

export interface Edge {
  from: string;
  to: string[];
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}

export interface GraphResponse {
  nodes: Node[];
  edges: { from: string; to: string }[];
}

export type PathFilter = (path: Node[], graph: Graph) => boolean;