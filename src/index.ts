import * as restify from "restify";
import { MicrosoftAppCredentials } from 'botframework-connector';
import { authProvider } from './auth';
import { Client } from '@microsoft/microsoft-graph-client';

// Create HTTP server
const server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log(`\nApp started. ${server.name} listening to ${server.url}`);
});

// Register an API endpoint for sending notifications
server.post(
  "/api/notification",
  restify.plugins.queryParser(),
  restify.plugins.bodyParser(),
  async (req, res) => {
    const aadObjectId = req.header('aadObjectId'); // AadObjectId des Benutzers
    const { subject, bodyContent, emailAddress } = req.body;
    console.log("angekommen:" + aadObjectId)
    if (!aadObjectId || !subject || !bodyContent || !emailAddress) {
      res.status(400);
      return;
    }

    const options = {
      authProvider
    };
    console.log("client init" + authProvider)
    const client = Client.init(options);

    try {
      // Fetch user details
      console.log("davor");
      let user = await client.api(`/users/${aadObjectId}`).get();

      // Prepare the message
      const message = {
        subject: 'Did you see last night\'s game?',
        importance: 'Low',
        body: {
          contentType: 'HTML',
          content: 'They were <b>awesome</b>!'
        },
        toRecipients: [
          {
            emailAddress: {
              address: 'AdeleV@contoso.com'
            }
          }
        ]
      };
      console.log("user: " + user );
      // Send the message
      await client.api(`/users/${aadObjectId}/messages`).post(message);

      // Send success response
      res.json({ message: "Email sent successfully" });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500);
    }
  }
);