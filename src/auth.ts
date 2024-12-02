// auth.ts
import { ConfidentialClientApplication } from '@azure/msal-node';
import { config } from './config';

export class Auth {
  private cca: ConfidentialClientApplication;

  constructor() {
    this.cca = new ConfidentialClientApplication(config);
  }

  async getToken() {
    const tokenRequest = {
      scopes: ['https://graph.microsoft.com/.default']
    };

    try {
      const response = await this.cca.acquireTokenByClientCredential(tokenRequest);
      return response.accessToken;
    } catch (error) {
      console.error('Error acquiring token:', error);
      throw error;
    }
  }
}