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
    const aadObjectId = req.header('aadObjectId'); // AadObjectId des Benutzers
    const { properties, responsible, comment, url } = req.body;

    if (!cardType || !aadObjectId || !url) {
      res.status(400);
      res.json({ error: "Missing required fields" });
      return;
    }

    let cardData: Responsibilities | Activities | Following;
    let cardTemplate;
    let title;

    switch (cardType) {
      case '1':
        title = "Responsibility";
        cardData = {
          title: "Responsibility",
          properties: properties,
          responsible: responsible,
          url: url,
        };
        cardTemplate = responsibilities;
        break;
      case '2':
        title = "Activity";
        cardData = {
          title: "Activity",
          properties: properties,
          url: url,
        };
        cardTemplate = activities;
        break;
      case '3':
        title = "Following";
        cardData = {
          title: "Following",
          responsible: responsible,
          properties: properties,
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
    } catch {
      res.status(400);
      res.json({ error: "Invalid url" });
      return;
    }

    // Dynamically create the description
    let description = "";
    let note = "";
    if (comment) {
      note += `  ${comment}`;
    }
    if (properties) {
      description += ` ${properties}`;
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

    // Find the user by AadObjectId
    const user = await notificationApp.notification.findMember(
      async (member) => member.account.aadObjectId === aadObjectId
    );

    if (!user) {
      res.status(404);
      res.json({ error: "User not found" });
      return;
    }

    // Send the adaptive card to the user
    await user.sendAdaptiveCard(card);

    // Send a message indicating that the chat is readonly
    await user.sendMessage("This chat is readonly. You cannot reply to this message.");

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