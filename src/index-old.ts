import * as ACData from "adaptivecards-templating";
import * as restify from "restify";
import axios from "axios";
import { notificationApp } from "./internal/initialize";
import { TeamsBot } from "./teamsBot";
import { Responsibilities, Activities, Following } from "./cardModels";
import activities from "./adaptiveCards/notification-Activities.json";
import following from "./adaptiveCards/notification-Following.json";
import responsibilities from "./adaptiveCards/notification-Responsibilities.json";
import { Auth } from './auth';
import { MicrosoftAppCredentials } from 'botframework-connector';
import { sendAdaptiveCard } from "@microsoft/teamsfx";

// Create HTTP server.
const server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log(`\nApp Started, ${server.name} listening to ${server.url}`);
});

// Trust the service URL
MicrosoftAppCredentials.trustServiceUrl(process.env.SERVICE_URL);

// Configure MicrosoftAppCredentials
const credentials = new MicrosoftAppCredentials(process.env.BOT_ID, process.env.SECRET_BOT_VALUE);

// Initialize Auth
const auth = new Auth();
let accessToken: string | null = null;

// Function to get the access token
async function getAccessToken() {
  if (!accessToken) {
    accessToken = await auth.getToken();
  }
  return accessToken;
}

// Register an API endpoint with `restify`.
server.post(
  "/api/notification",
  restify.plugins.queryParser(),
  restify.plugins.bodyParser(),
  async (req, res) => {
    const cardType = req.header('cardType');
    const aadObjectId = req.header('aadObjectId'); // AadObjectId des Benutzers
    const { properties, responsible, comment, url } = req.body;

    if (!cardType || !aadObjectId || !url) {
      res.status(400);
      res.json({ error: "Missing required fields" });
      return;
    }


    // Find the user by AadObjectId
    const user = await findUserByAadObjectId(aadObjectId, credentials);

    if (!user) {
      res.status(404);
      res.json({ error: "User not found" });
      return;
    }
    res.json({});
  }
);


// Initialize Auth and get token
getAccessToken().then(token => {
  console.log('Access Token:', token);
}).catch(error => {
  console.error('Error acquiring token:', error);
});

// Helper function to find user by AadObjectId
async function findUserByAadObjectId(aadObjectId: string, credentials: MicrosoftAppCredentials) {
  const graphApiUrl = `https://graph.microsoft.com/v1.0/users/${aadObjectId}`;
  const token = await credentials.getToken();

  try {
    const response = await axios.get(graphApiUrl, {
      headers: {
        Authorization: accessToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error finding user by AadObjectId:', error);
    return null;
  }
}
