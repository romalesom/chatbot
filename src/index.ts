import * as ACData from "adaptivecards-templating";
import * as restify from "restify";
import { notificationApp } from "./internal/initialize";
import { TeamsBot } from "./teamsBot";
import { DefaultCardData, NoResponsibleCardData, NoWorkItemCardData } from "./cardModels";
import defaultTemplate from "./adaptiveCards/notification-default.json";
import noResponsibleTemplate from "./adaptiveCards/notification-no-responsible.json";
import noWorkItemTemplate from "./adaptiveCards/notification-no-workitem.json";

// Create HTTP server.
const server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log(`\nApp Started, ${server.name} listening to ${server.url}`);
});

// Register an API endpoint with `restify`.
server.post(
  "/api/notification",
  restify.plugins.queryParser(),
  restify.plugins.bodyParser(),
  async (req, res) => {
    const cardType = req.header('cardType');
    const { workItem, responsible, url } = req.body;

    if (!cardType || !url) {
      res.status(400);
      res.json({ error: "Missing required fields" });
      return;
    }

    let cardData: DefaultCardData | NoResponsibleCardData | NoWorkItemCardData;
    let cardTemplate;

    switch (cardType) {
      case '1':
        cardData = {
          title: "Default Card",
          workItem: workItem,
          responsible: responsible,
          url: url,
        };
        cardTemplate = defaultTemplate;
        break;
      case '2':
        cardData = {
          title: "No Responsible Card",
          workItem: workItem,
          url: url,
        };
        cardTemplate = noResponsibleTemplate;
        break;
      case '3':
        cardData = {
          title: "No Work Item Card",
          responsible: responsible,
          url: url,
        };
        cardTemplate = noWorkItemTemplate;
        break;
      default:
        res.status(400);
        res.json({ error: "Invalid cardType" });
        return;
    }

    // Ensure the URL is correctly encoded
    cardData.url = encodeURI(cardData.url);

    const card = new ACData.Template(cardTemplate).expand({
      $root: {
        title: "New Work Item Notification",
        description: `Work Item: ${workItem}\nResponsible: ${responsible}`,
        notificationUrl: url,
      },
    });

    const pageSize = 100;
    let continuationToken: string | undefined = undefined;
    do {
      const pagedData = await notificationApp.notification.getPagedInstallations(
        pageSize,
        continuationToken
      );
      const installations = pagedData.data;
      continuationToken = pagedData.continuationToken;

      for (const target of installations) {
        await target.sendAdaptiveCard(card);
      }
    } while (continuationToken);

    res.json({});
  }
);

// Register an API endpoint with `restify`. Teams sends messages to your application
// through this endpoint.
const teamsBot = new TeamsBot();
server.post("/api/messages", async (req, res) => {
  await notificationApp.requestHandler(req, res, async (context) => {
    await teamsBot.run(context);
  });
});