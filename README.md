# Overview of the Notification bot template

This template showcases an app that send a message to Teams with Adaptive Cards triggered by a HTTP post request. You can further extend the template to consume, transform and post events to individual, chat or channel in Teams.

The app template is built using the TeamsFx SDK, which provides a simple set of functions over the Microsoft Bot Framework to implement this scenario.

## Get Started with the Notification bot

>
> **Prerequisites**
>
> To run the notification bot template in your local dev machine, you will need:
>
> - [Node.js](https://nodejs.org/), supported versions: 16, 18
> - [Teams Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit) version 5.0.0 and higher or [Teams Toolkit CLI](https://aka.ms/teamsfx-toolkit-cli)
>
> **Note**
>
> Your app can be installed into a team, or a group chat, or as personal app. See [Installation and Uninstallation](https://aka.ms/teamsfx-notification-new#customize-installation).
> For local debugging using Teams Toolkit CLI, you need to do some extra steps described in [Set up your Teams Toolkit CLI for local debugging](https://aka.ms/teamsfx-cli-debugging).

1. First, select the Teams Toolkit icon on the left in the VS Code toolbar.
2. Press F5 to start debugging which launches your app in Teams App Test Tool using a web browser. Select `Debug in Test Tool`.
3. The browser will pop up to open Teams App Test Tool.
4. Send a POST request to `http://<endpoint>/api/notification` with your favorite tool (like `Postman`)

   - When your project is running locally, replace `<endpoint>` with `localhost:3978`
   - When your project is deployed to Azure App Service, replace `<endpoint>` with the url from Azure App Service

The bot will send an Adaptive Card to Teams App Test Tool:

![Notification Message in Test Tool](https://github.com/OfficeDev/TeamsFx/assets/9698542/52aa4826-e8b3-4341-b9e1-bcba50470861)

## What's included in the template

| Folder / File | Contents |
| - | - |
| `teamsapp.yml` | Main project file describes your application configuration and defines the set of actions to run in each lifecycle stages |
| `teamsapp.local.yml`| This overrides `teamsapp.yml` with actions that enable local execution and debugging in Microsoft Teams |
| `teamsapp.testtool.yml`| This overrides `teamsapp.yml` with actions that enable local execution and debugging in Teams App Test Tool |
| `.vscode/` | VSCode files for local debug |
| `src/` | The source code for the notification Teams application |
| `appPackage/` | Templates for the Teams application manifest |
| `infra/` | Templates for provisioning Azure resources |

The following files can be customized and demonstrate an example implementation to get you started.

| File | Contents |
| - | - |
| `src/index.ts` | Application entry point and `restify` handlers for notifications |
| `src/teamsBot.ts`| An empty teams activity handler for bot customization |
| `src/adaptiveCards/notification-default.json` | A generated Adaptive Card that is sent to Teams |
| `src/cardModels.ts` | The default Adaptive Card data model |

## Extend the notification bot template

There are few customizations you can make to extend the template to fit your business requirements.

1. [Step 1: Customize the trigger point from event source](#step-1-customize-the-trigger-point-from-event-source)
2. [Step 2: Customize the notification content](#step-2-customize-the-notification-content)
3. [Step 3: Customize where notifications are sent](#step-3-customize-where-notifications-are-sent)

### Step 1: Customize the trigger point from event source

By default Teams Toolkit scaffolds a single `restify` entry point in `src/index.ts`. When a HTTP request is sent to this entry point, the default implementation sends a hard-coded Adaptive Card to Teams. You can customize this behavior by customizing `src/index.ts`. A typical implementation might make an API call to retrieve some events and/or data, and then send an Adaptive Card as appropriate.

You can also add additional triggers by:

- Creating new routing: `server.post("/api/new-trigger", ...);`
- Add Timer trigger(s) via widely-used npm packages such as [cron](https://www.npmjs.com/package/cron), [node-schedule](https://www.npmjs.com/package/node-schedule), etc. Or add other trigger(s) via other packages.

### Step 2: Customize the notification content

`src/adaptiveCards/notification-default.json` defines the default Adaptive Card. You can use the [Adaptive Card Designer](https://adaptivecards.io/designer/) to help visually design your Adaptive Card UI.

`src/cardModels.ts` defines a data structure that is used to fill data for the Adaptive Card. The binding between the model and the Adaptive Card is done by name matching (for example,`CardData.title` maps to `${title}` in the Adaptive Card). You can add, edit, or remove properties and their bindings to customize the Adaptive Card to your needs.

You can also add new cards if needed. Follow this [sample](https://aka.ms/teamsfx-adaptive-card-sample-new) to see how to build different types of adaptive cards with a list or a table of dynamic contents using `ColumnSet` and `FactSet`.

### Step 3: Customize where notifications are sent

Notifications can be sent to where the bot is installed:

- [Send notifications to a channel](https://aka.ms/teamsfx-notification-new#send-notifications-to-a-channel)
- [Send notifications to a group chat](https://aka.ms/teamsfx-notification-new#send-notifications-to-a-group-chat)
- [Send notifications to a personal chat](https://aka.ms/teamsfx-notification-new#send-notifications-to-a-personal-chat)

You can also send the notifications to a specific receiver:

- [Send notifications to a specific channel](https://aka.ms/teamsfx-notification-new#send-notifications-to-a-specific-channel)
- [Send notifications to a specific person](https://aka.ms/teamsfx-notification-new#send-notifications-to-a-specific-person)

Congratulations, you've just created your own notification! To learn more about extending the notification bot template, [visit the documentation on Github](https://aka.ms/teamsfx-notification-new). You can find more scenarios like:

- [Customize storage](https://aka.ms/teamsfx-notification-new#customize-storage)
- [Customize adapter](https://aka.ms/teamsfx-notification-new#customize-adapter)
- [Customize the way to initialize the bot](https://aka.ms/teamsfx-notification-new#customize-initialization)
- [Add authentication for your notification API](https://aka.ms/teamsfx-notification-new#add-authentication-for-your-notification-api)
- [Connect to existing APIs](https://aka.ms/teamsfx-notification-new#connect-to-existing-api)
- [Frequently asked questions](https://aka.ms/teamsfx-notification-new#frequently-asked-questions)

## Extend notification bot with other bot scenarios

Notification bot is compatible with other bot scenarios like command bot and workflow bot.

### Add command to your application

The command and response feature adds the ability for your application to "listen" to commands sent to it via a Teams message and respond to commands with Adaptive Cards. Follow the [steps here](https://aka.ms/teamsfx-command-new#How-to-add-more-command-and-response) to add the command response feature to your workflow bot. Refer [the command bot document](https://aka.ms/teamsfx-command-new) for more information.

### Add workflow to your notification bot

Adaptive cards can be updated on user action to allow user progress through a series of cards that require user input. Developers can define actions and use a bot to return an Adaptive Cards in response to user action. This can be chained into sequential workflows. Follow the [steps here](https://aka.ms/teamsfx-workflow-new#add-more-card-actions) to add workflow feature to your command bot. Refer [the workflow document](https://aka.ms/teamsfx-workflow-new) for more information.

## Additional information and references

- [Manage multiple environments](https://docs.microsoft.com/microsoftteams/platform/toolkit/teamsfx-multi-env)
- [Collaborate with others](https://docs.microsoft.com/microsoftteams/platform/toolkit/teamsfx-collaboration)
- [Teams Toolkit Documentations](https://docs.microsoft.com/microsoftteams/platform/toolkit/teams-toolkit-fundamentals)
- [Teams Toolkit CLI](https://aka.ms/teamsfx-toolkit-cli)
- [TeamsFx SDK](https://docs.microsoft.com/microsoftteams/platform/toolkit/teamsfx-sdk)
- [Teams Toolkit Samples](https://github.com/OfficeDev/TeamsFx-Samples)