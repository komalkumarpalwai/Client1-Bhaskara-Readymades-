import { ENV, isSalesforceConfigured } from '../../config/env.js';
import { SALESFORCE_CONFIG } from '../../config/salesforce.js';
import { logger } from '../../utils/logger.js';

let cachedToken = null;
let tokenExpiresAt = null;

/**
 * Salesforce Authentication Service
 * Handles OAuth 2.0 Username-Password token acquisition and caching
 */
export const salesforceAuth = {
  /**
   * Acquire or return cached Salesforce access token
   * Uses OAuth 2.0 Client Credentials flow (Client ID & Client Secret only),
   * or Username/Password flow if configured.
   * @returns {Promise<{accessToken: string, instanceUrl: string}>}
   */
  async getAccessToken() {
    if (!isSalesforceConfigured()) {
      logger.warn('Salesforce credentials not configured in environment. Using placeholder token.');
      return {
        accessToken: 'placeholder-token',
        instanceUrl: ENV.SALESFORCE.LOGIN_URL
      };
    }

    const now = Date.now();
    if (cachedToken && tokenExpiresAt && now < tokenExpiresAt - SALESFORCE_CONFIG.tokenExpiryMarginMs) {
      return cachedToken;
    }

    const { LOGIN_URL, CLIENT_ID, CLIENT_SECRET, USERNAME, PASSWORD, SECURITY_TOKEN } = ENV.SALESFORCE;

    // Clean login URL (ensure no trailing slash or /services path)
    const baseLoginUrl = (LOGIN_URL || 'https://login.salesforce.com').replace(/\/+$/, '');

    // Strategy 1: OAuth 2.0 Client Credentials Flow (Only Client ID & Client Secret)
    try {
      logger.info('Attempting Salesforce OAuth 2.0 Client Credentials flow (Client ID + Client Secret)...');
      const ccParams = new URLSearchParams();
      ccParams.append('grant_type', 'client_credentials');
      ccParams.append('client_id', CLIENT_ID);
      ccParams.append('client_secret', CLIENT_SECRET);

      const ccResponse = await fetch(`${baseLoginUrl}/services/oauth2/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: ccParams.toString()
      });

      if (ccResponse.ok) {
        const data = await ccResponse.json();
        cachedToken = {
          accessToken: data.access_token,
          instanceUrl: data.instance_url || baseLoginUrl
        };
        tokenExpiresAt = now + ((data.expires_in || 3600) * 1000);
        logger.info('Salesforce Client Credentials authentication successful! Instance:', { instanceUrl: cachedToken.instanceUrl });
        return cachedToken;
      }
      
      const ccErr = await ccResponse.json().catch(() => ({}));
      logger.warn('Client Credentials flow returned:', ccErr);
    } catch (ccError) {
      logger.warn('Client Credentials flow attempt error:', { message: ccError.message });
    }

    // Strategy 2: OAuth 2.0 Password Flow (Username & Password without requiring security token)
    try {
      logger.info('Attempting Salesforce OAuth 2.0 Password flow...');
      const pwParams = new URLSearchParams();
      pwParams.append('grant_type', 'password');
      pwParams.append('client_id', CLIENT_ID);
      pwParams.append('client_secret', CLIENT_SECRET);
      if (USERNAME) pwParams.append('username', USERNAME);
      if (PASSWORD) pwParams.append('password', `${PASSWORD}${SECURITY_TOKEN || ''}`);

      const pwResponse = await fetch(`${baseLoginUrl}/services/oauth2/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: pwParams.toString()
      });

      if (!pwResponse.ok) {
        const errJson = await pwResponse.json().catch(() => ({}));
        logger.error('Salesforce OAuth token exchange failed:', errJson);
        throw new Error(`Salesforce OAuth Error: ${errJson.error_description || errJson.error || pwResponse.statusText}`);
      }

      const data = await pwResponse.json();
      cachedToken = {
        accessToken: data.access_token,
        instanceUrl: data.instance_url || baseLoginUrl
      };
      tokenExpiresAt = now + 3600 * 1000;
      logger.info('Salesforce OAuth authentication successful! Instance:', { instanceUrl: cachedToken.instanceUrl });
      return cachedToken;
    } catch (error) {
      logger.error('Error during Salesforce OAuth:', { message: error.message });
      throw error;
    }
  },

  /**
   * Invalidate cached token on 401 Unauthorized
   */
  clearTokenCache() {
    cachedToken = null;
    tokenExpiresAt = null;
  }
};
