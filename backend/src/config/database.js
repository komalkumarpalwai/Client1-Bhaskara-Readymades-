/**
 * Database & Cache Layer Configuration Placeholder
 * Salesforce acts as the primary system of record.
 * This file is prepared for Redis / local caching or session storage in future phases.
 */

export const DATABASE_CONFIG = {
  driver: 'salesforce',
  useCache: false,
  cacheTTL: 300 // 5 minutes default cache TTL
};
