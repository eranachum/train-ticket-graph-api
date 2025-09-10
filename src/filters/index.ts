import { Node, PathFilter } from '../types/graph.types';

// Filter functions for path analysis
export const startsWithPublicService: PathFilter = (path: Node[]) =>  {
  return path[0].publicExposed === true;
}

export const endsWithSink: PathFilter = (path: Node[]) => {
  const lastNode = path[path.length - 1];
  return !(lastNode.kind === 'rds' && lastNode.metadata?.engine === 'postgres');
};

export const hasVulnerability: PathFilter = (path: Node[]) => 
  !(path.some(node => node.vulnerabilities && node.vulnerabilities.length > 0));

// Available filters mapping
export const availableFilters: { [key: string]: PathFilter } = {
  public: startsWithPublicService,
  sink: endsWithSink,
  vulnerability: hasVulnerability,
};
