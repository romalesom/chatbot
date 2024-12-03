import { ClientSecretCredential } from "@azure/identity"
import { Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials"
// @azure/identity
const credential = new ClientSecretCredential(
  "17a5b20f-fd8e-44fa-bfd6-4fc263f8e0b4",
  "3cd3b5d3-7b80-41b5-a052-288e9186923b",
  "VOU8Q~oDt-ZjL6agzNOyV6fALQ82lU.-hEddAcEO",
);

// @microsoft/microsoft-graph-client/authProviders/azureTokenCredentials
 const authProvider2 = new TokenCredentialAuthenticationProvider(credential, {
  // The client credentials flow requires that you request the
  // /.default scope, and pre-configure your permissions on the
  // app registration in Azure. An administrator must grant consent
  // to those permissions beforehand.
  scopes: ['https://graph.microsoft.com/.default'],
});
export const authProvider = authProvider2.getAccessToken
console.log(authProvider)
const graphClient = Client.initWithMiddleware({ authProvider: authProvider2 });