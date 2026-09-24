import { salesforceClient } from './salesforceClient.js';
import { logger } from '../../utils/logger.js';

/**
 * Salesforce Lead & Customer Service
 * Queries and Creates Leads in Salesforce
 */
export const sfCustomerService = {
  /**
   * Fetch leads from Salesforce Lead standard object
   */
  async fetchLeads() {
    try {
      const soql = `
        SELECT Id, Name, FirstName, LastName, Title, Company, Phone, MobilePhone, 
               Email, LeadSource, Status, Industry, Street, City, State, PostalCode, 
               Country, Description, CreatedDate, LastModifiedDate 
        FROM Lead 
        ORDER BY CreatedDate DESC 
        LIMIT 100
      `;
      const result = await salesforceClient.query(soql);
      
      return (result.records || []).map((rec) => ({
        id: rec.Id,
        name: rec.Name || `${rec.FirstName || ''} ${rec.LastName || ''}`.trim() || 'Lead',
        firstName: rec.FirstName || '',
        lastName: rec.LastName || '',
        title: rec.Title || '',
        company: rec.Company || 'Individual Shopper',
        phone: rec.Phone || rec.MobilePhone || '-',
        mobilePhone: rec.MobilePhone || '',
        email: rec.Email || '-',
        category: rec.LeadSource || 'Web Storefront',
        leadSource: rec.LeadSource || 'Web Storefront',
        industry: rec.Industry || '-',
        street: rec.Street || '',
        city: rec.City || '',
        state: rec.State || '',
        postalCode: rec.PostalCode || '',
        country: rec.Country || '',
        message: rec.Description || '-',
        description: rec.Description || '',
        status: rec.Status || 'Open',
        date: new Date(rec.CreatedDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
        createdDate: rec.CreatedDate,
        lastModifiedDate: rec.LastModifiedDate,
        sfStatus: 'Salesforce Lead'
      }));
    } catch (error) {
      logger.error('Failed to query Leads from Salesforce:', { error: error.message });
      return [];
    }
  },

  /**
   * Fetch single Lead by ID with all details
   */
  async fetchLeadById(leadId) {
    try {
      const soql = `
        SELECT Id, Name, FirstName, LastName, Title, Company, Phone, MobilePhone, 
               Email, LeadSource, Status, Industry, Street, City, State, PostalCode, 
               Country, Description, CreatedDate, LastModifiedDate 
        FROM Lead 
        WHERE Id = '${leadId}'
      `;
      const result = await salesforceClient.query(soql);
      const rec = result.records?.[0];
      if (!rec) return null;

      return {
        id: rec.Id,
        name: rec.Name || `${rec.FirstName || ''} ${rec.LastName || ''}`.trim() || 'Lead',
        firstName: rec.FirstName || '',
        lastName: rec.LastName || '',
        title: rec.Title || '',
        company: rec.Company || '',
        phone: rec.Phone || '',
        mobilePhone: rec.MobilePhone || '',
        email: rec.Email || '',
        leadSource: rec.LeadSource || 'Web Storefront',
        industry: rec.Industry || '',
        street: rec.Street || '',
        city: rec.City || '',
        state: rec.State || '',
        postalCode: rec.PostalCode || '',
        country: rec.Country || '',
        description: rec.Description || '',
        status: rec.Status || 'Open',
        createdDate: rec.CreatedDate,
        lastModifiedDate: rec.LastModifiedDate
      };
    } catch (error) {
      logger.error('Failed to query Lead by ID:', { error: error.message });
      return null;
    }
  },

  /**
   * Create a Lead in Salesforce
   */
  async createLead(leadData) {
    const payload = {
      FirstName: leadData.firstName || '',
      LastName: leadData.lastName || 'Customer',
      Phone: leadData.phone || '',
      Email: leadData.email || '',
      Company: leadData.company || 'Individual Shopper',
      LeadSource: 'Web Storefront',
      Description: `Category: ${leadData.categoryInterest || 'Readymades'} | Note: ${leadData.message || ''}`,
      Status: 'Open - Not Contacted'
    };
    return await salesforceClient.createRecord('Lead', payload);
  }
};
