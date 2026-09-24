import { salesforceAuth } from './salesforceAuth.js';
import { SALESFORCE_CONFIG } from '../../config/salesforce.js';
import { logger } from '../../utils/logger.js';

/**
 * Salesforce REST Client
 * Executes SOQL and SObject REST requests against Salesforce Org
 */
export const salesforceClient = {
  /**
   * Execute a SOQL query against Salesforce REST API
   * @param {string} soql
   * @returns {Promise<{totalSize: number, done: boolean, records: any[]}>}
   */
  async query(soql) {
    try {
      logger.debug('Executing Salesforce SOQL Query:', { soql });
      const auth = await salesforceAuth.getAccessToken();
      const queryUrl = `${auth.instanceUrl}/services/data/${SALESFORCE_CONFIG.apiVersion}/query?q=${encodeURIComponent(soql)}`;

      const response = await fetch(queryUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${auth.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        // Token expired, clear cache and retry once
        salesforceAuth.clearTokenCache();
        const retryAuth = await salesforceAuth.getAccessToken();
        const retryResponse = await fetch(queryUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${retryAuth.accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        if (!retryResponse.ok) {
          const err = await retryResponse.json().catch(() => ({}));
          throw new Error(JSON.stringify(err));
        }
        return await retryResponse.json();
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        logger.error('Salesforce SOQL Query Error:', errorData);
        throw new Error(errorData[0]?.message || errorData.message || response.statusText);
      }

      const data = await response.json();
      logger.info(`Salesforce SOQL Query returned ${data.totalSize} records.`);
      return data;
    } catch (error) {
      logger.error('Salesforce query execution failed:', { message: error.message });
      throw error;
    }
  },

  /**
   * Create an SObject record in Salesforce (e.g. Lead, Order, Contact)
   * @param {string} sObjectName
   * @param {Record<string, any>} data
   * @returns {Promise<any>}
   */
  async createRecord(sObjectName, data) {
    try {
      logger.debug(`Creating Salesforce ${sObjectName} Record:`, data);
      const auth = await salesforceAuth.getAccessToken();
      const endpoint = `${auth.instanceUrl}/services/data/${SALESFORCE_CONFIG.apiVersion}/sobjects/${sObjectName}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        logger.error(`Salesforce Create ${sObjectName} Error:`, err);
        throw new Error(err[0]?.message || err.message || response.statusText);
      }

      return await response.json();
    } catch (error) {
      logger.error(`Error creating ${sObjectName} in Salesforce:`, { message: error.message });
      throw error;
    }
  },

  /**
   * Retrieve an SObject record by ID from Salesforce
   * @param {string} sObjectName
   * @param {string} recordId
   * @param {string[]} fields
   * @returns {Promise<any>}
   */
  async getRecordById(sObjectName, recordId, fields = []) {
    try {
      const auth = await salesforceAuth.getAccessToken();
      const fieldsParam = fields.length > 0 ? `?fields=${fields.join(',')}` : '';
      const endpoint = `${auth.instanceUrl}/services/data/${SALESFORCE_CONFIG.apiVersion}/sobjects/${sObjectName}/${recordId}${fieldsParam}`;

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${auth.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err[0]?.message || err.message || response.statusText);
      }

      return await response.json();
    } catch (error) {
      logger.error(`Error retrieving ${sObjectName} ${recordId}:`, { message: error.message });
      throw error;
    }
  },

  /**
   * Update an SObject record in Salesforce (PATCH)
   * @param {string} sObjectName
   * @param {string} recordId
   * @param {Record<string, any>} data
   * @returns {Promise<any>}
   */
  async updateRecord(sObjectName, recordId, data) {
    try {
      logger.debug(`Updating Salesforce ${sObjectName} Record ${recordId}:`, data);
      const auth = await salesforceAuth.getAccessToken();
      const endpoint = `${auth.instanceUrl}/services/data/${SALESFORCE_CONFIG.apiVersion}/sobjects/${sObjectName}/${recordId}`;

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${auth.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.status === 204) {
        return { success: true, id: recordId };
      }

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        logger.error(`Salesforce Update ${sObjectName} Error:`, err);
        throw new Error(err[0]?.message || err.message || response.statusText);
      }

      return await response.json();
    } catch (error) {
      logger.error(`Error updating ${sObjectName} in Salesforce:`, { message: error.message });
      throw error;
    }
  },

  /**
   * Delete an SObject record from Salesforce (DELETE)
   * @param {string} sObjectName
   * @param {string} recordId
   * @returns {Promise<any>}
   */
  async deleteRecord(sObjectName, recordId) {
    try {
      logger.debug(`Deleting Salesforce ${sObjectName} Record ${recordId}`);
      const auth = await salesforceAuth.getAccessToken();
      const endpoint = `${auth.instanceUrl}/services/data/${SALESFORCE_CONFIG.apiVersion}/sobjects/${sObjectName}/${recordId}`;

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.accessToken}`
        }
      });

      if (response.status === 204) {
        return { success: true, id: recordId };
      }

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err[0]?.message || err.message || response.statusText);
      }

      return { success: true, id: recordId };
    } catch (error) {
      logger.error(`Error deleting ${sObjectName} in Salesforce:`, { message: error.message });
      throw error;
    }
  }
};
