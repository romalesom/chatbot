import * as ACData from "adaptivecards-templating";
import * as restify from "restify";
import { notificationApp } from "./internal/initialize";
import { TeamsBot } from "./teamsBot";
import { Responsibilities, Activities, Following } from "./cardModels";
import activities from "./adaptiveCards/notification-Activities.json";
import following from "./adaptiveCards/notification-Following.json";
import responsibilities from "./adaptiveCards/notification-Responsibilities.json";

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
    const { workItem, responsible, comment, url } = req.body;

    if (!cardType || !url) {
      res.status(400);
      res.json({ error: "Missing required fields" });
      return;
    }

    let cardData: Responsibilities | Activities | Following ;
    let cardTemplate;
    let title;

    switch (cardType) {
      case '1':
        title = "Responsibility"
        cardData = {
          title: "Responsibility",
          workItem: workItem,
          responsible: responsible,
          url: url,
        };
        cardTemplate = responsibilities;
        break;
      case '2':
        title = "Activity"
        cardData = {
          title: "Activity",
          workItem: workItem,
          url: url,
        };
        cardTemplate = activities;
        break;
      case '3':
        title = "Following"
        cardData = {
          title: "Following",
          responsible: responsible,
          workItem: workItem,
          comment: comment,
          url: url,
        };
        cardTemplate = following;
        break;
      default:
        res.status(400);
        res.json({ error: "Invalid cardType" });
        return;
    }

    // Ensure the URL is correctly encoded
    try {
    cardData.url = encodeURI(cardData.url);
    }catch{ 
      res.status(400)
      res.json({ error: "Invalid url" });
    }
    // Dynamically create the description
    let description = "";
    let note = "";
    if(comment){
      note += `  ${comment}`;
    }
    if (workItem) {
      description += ` ${workItem}`;
    }
    if (responsible) {
      description += ` by ${responsible}`;
    }

    const card = new ACData.Template(cardTemplate).expand({
      $root: {
        title: title,
        comment: note,
        description: description,
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