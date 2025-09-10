import { Router, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { GraphService } from '../services/graph.service';
import { AppError } from '../types/error.types';
import { availableFilters } from '../filters';
import { validateGraphPathParams, getAvailableFilterNames, sanitizeFilters } from '../validation';

const router = Router();
const graphService = new GraphService();

router.get(
  '/paths',
  validateGraphPathParams,
  async (req: Request, res: Response) => {
    try {
      const { start, end, filters } = req.query as { start: string; end: string; filters?: string };

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      await graphService.loadGraph();
      
      const selectedFilters = filters
        ? sanitizeFilters(filters).map(filter => availableFilters[filter])
        : [];

      const allPaths = graphService.findAllPaths(start, end);
      if (allPaths.length === 0) {
        throw new AppError(`No paths found from ${start} to ${end}`, 404);
      }

      const filteredPaths = selectedFilters.length > 0 
        ? graphService.applyFilters(allPaths, selectedFilters) 
        : allPaths;

      if (filteredPaths.length === 0) {
        throw new AppError('No paths match the specified filters', 404);
      }

      const response = graphService.pathsToGraph(filteredPaths);  
      
      res.json(response);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
      }
    }
  }
);

router.get('/filters', (_req, res) => {
  const filterNames = getAvailableFilterNames();
  const filterDescriptions = {
    public: 'Routes starting at a public-exposed service',
    sink: 'Routes ending in a sink (rds/sql/db)',
    vulnerability: 'Routes touching a node with known vulnerabilities'
  };

  const filters = filterNames.map(id => ({
    id,
    description: filterDescriptions[id as keyof typeof filterDescriptions] || 'Custom filter'
  }));

  res.json({ filters });
});

export default router;