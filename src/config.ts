// config.ts
export const config = {
    auth: {
      clientId: process.env.BOT_ID,
      authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
      clientSecret: process.env.SECRET_BOT_VALUE,
    }
  };