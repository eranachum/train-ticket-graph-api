import { query, ValidationChain } from 'express-validator';
import { availableFilters } from '../filters';

/**
 * Validation middleware for graph route parameters
 */
export const validateGraphPathParams: ValidationChain[] = [
  query('start')
    .isString()
    .notEmpty()
    .withMessage('Start node must be a non-empty string')
    .trim()
    .escape(),
  
  query('end')
    .isString()
    .notEmpty()
    .withMessage('End node must be a non-empty string')
    .trim()
    .escape(),
  
  query('filters')
    .optional()
    .isString()
    .custom((value: string) => {
      if (!value) return true; // Optional field
      const filters = value.split(',').map(f => f.trim());
      return filters.every((filter: string) => Object.keys(availableFilters).includes(filter));
    })
    .withMessage('Invalid filter values. Available filters: ' + Object.keys(availableFilters).join(', ')),
];

/**
 * Custom validation function for filter values
 */
export const validateFilters = (filters: string): boolean => {
  if (!filters) return true; // Empty filters are valid
  const filterList = filters.split(',').map(f => f.trim());
  return filterList.every((filter: string) => Object.keys(availableFilters).includes(filter));
};

/**
 * Get available filter names for validation
 */
export const getAvailableFilterNames = (): string[] => {
  return Object.keys(availableFilters);
};

/**
 * Validation for node names (used in path finding)
 */
export const validateNodeName = (nodeName: string): boolean => {
  return typeof nodeName === 'string' && nodeName.trim().length > 0;
};

/**
 * Sanitize filter string input
 */
export const sanitizeFilters = (filters: string): string[] => {
  if (!filters) return [];
  return filters.split(',').map(f => f.trim()).filter(f => f.length > 0);
};
