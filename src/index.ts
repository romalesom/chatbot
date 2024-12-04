import * as ACData from "adaptivecards-templating";
import * as restify from "restify";
import notificationTemplate from "./adaptiveCards/notification-Activities.json";
import { notificationApp } from "./internal/initialize";
import { TeamsBot } from "./teamsBot";
import { NotificationTargetType } from "@microsoft/teamsfx";

// Create HTTP server.
const server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log(`\nApp Started, ${server.name} listening to ${server.url}`);
});

// Register an API endpoint with `restify`.
//
// This endpoint is provided by your application to listen to events. You can configure
// your IT processes, other applications, background tasks, etc - to POST events to this
// endpoint.
//
// In response to events, this function sends Adaptive Cards to Teams. You can update the logic in this function
// to suit your needs. You can enrich the event with additional data and send an Adaptive Card as required.
//
// You can add authentication / authorization for this API. Refer to
// https://aka.ms/teamsfx-notification for more details.
server.post(
  "/api/notification",
  restify.plugins.queryParser(),
  restify.plugins.bodyParser(), // Add more parsers if needed
  async (req, res) => {
    const cardType = req.header('cardType');
    const aadObjectId = req.header('aadObjectId'); // AadObjectId des Benutzers
    const { properties, responsible, comment, url } = req.body;

    const member = await notificationApp.notification.findMember(
      async (m) => m.account.aadObjectId === aadObjectId
    );
    await member?.sendAdaptiveCard(
      new ACData.Template(notificationTemplate).expand({
        $root: {
          title: "New Event Occurred!",
          appName: "Contoso App Notification",
          description: `This is a sample http-triggered notification to ${member.account.name}`,
          notificationUrl: "https://aka.ms/teamsfx-notification-new",
        },
      })
    )
    res.json({});
  }
);

// Register an API endpoint with `restify`. Teams sends messages to your application
// through this endpoint.
//
// The Teams Toolkit bot registration configures the bot with `/api/messages` as the
// Bot Framework endpoint. If you customize this route, update the Bot registration
// in `/templates/provision/bot.bicep`.
const teamsBot = new TeamsBot();
server.post("/api/messages", async (req, res) => {
  await notificationApp.requestHandler(req, res, async (context) => {
    await teamsBot.run(context);
  });
});
