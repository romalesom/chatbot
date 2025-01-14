import * as ACData from "adaptivecards-templating";
import * as restify from "restify";
import { notificationApp } from "./internal/initialize";
import { TeamsBot } from "./teamsBot";
import { buildAdaptiveCard } from "./buildAdaptiveCard";

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
    //Person who should receive the AdaptiveCard
    const aadObjectId = req.header('aadObjectId');
    let card;

    try {
      //Building the adaptive card
      card = buildAdaptiveCard(req)
    }catch (error){
        res.json(error.code, error.message)
    }
    //Identitfy the person from aadObjectId
    const member = await notificationApp.notification.findMember(
      async (m) => m.account.aadObjectId === aadObjectId
    );

    //Send adaptiveCard to the right person
    try{
      await member?.sendAdaptiveCard(card)
      res.json(201, "Send successfully");
    }catch{
      res.json(500,"failed sending card")
    }
  }
);

  // Register an API endpoint with `restify`. Teams sends messages to your application
  // through this endpoint.
  //
  // The Teams Toolkit bot registration configures the bot with `/api/messages` as the
  // Bot Framework endpoint. If you customize this route, update the Bot registration
  // in `/templates/provision/bot.bicep`.
  // const teamsBot = new TeamsBot();
  // server.post("/api/messages", async (req, res) => {
  //   await notificationApp.requestHandler(req, res, async (context) => {
  //     await teamsBot.run(context);
  //   });
  // });
