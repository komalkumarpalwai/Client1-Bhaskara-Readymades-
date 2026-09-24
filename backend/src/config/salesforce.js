import { ENV } from './env.js';

export const SALESFORCE_CONFIG = {
  loginUrl: ENV.SALESFORCE.LOGIN_URL,
  apiVersion: ENV.SALESFORCE.API_VERSION,
  oauthTokenEndpoint: `${ENV.SALESFORCE.LOGIN_URL}/services/oauth2/token`,
  tokenExpiryMarginMs: 60 * 1000, // 1 minute safety buffer
  timeoutMs: 15000, // 15s timeout
  customObjects: {
    product: 'Product2',
    order: 'Order',
    orderItem: 'OrderItem',
    contact: 'Contact',
    account: 'Account'
  }
};
