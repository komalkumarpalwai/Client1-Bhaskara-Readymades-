import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env or root .env
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',

  SALESFORCE: {
    LOGIN_URL: process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com',
    CLIENT_ID: process.env.SALESFORCE_CLIENT_ID || '',
    CLIENT_SECRET: process.env.SALESFORCE_CLIENT_SECRET || '',
    USERNAME: process.env.SALESFORCE_USERNAME || '',
    PASSWORD: process.env.SALESFORCE_PASSWORD || '',
    SECURITY_TOKEN: process.env.SALESFORCE_SECURITY_TOKEN || '',
    API_VERSION: process.env.SALESFORCE_API_VERSION || 'v59.0'
  },

  ADMIN: {
    EMAIL: (process.env.ADMIN_EMAIL || 'admin@bhaskarareadymades.com').toLowerCase().trim(),
    PASSWORD: process.env.ADMIN_PASSWORD || 'admin123'
  }
};

/**
 * Checks if Salesforce credentials are configured (Client ID and Client Secret)
 * @returns {boolean}
 */
export const isSalesforceConfigured = () => {
  const { CLIENT_ID, CLIENT_SECRET } = ENV.SALESFORCE;
  return Boolean(CLIENT_ID && CLIENT_SECRET);
};
