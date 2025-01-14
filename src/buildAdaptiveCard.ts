import { Responsibilities, Activities, Following } from "./cardModels";
import {MissingFields, WrongAadObjectId} from "./Errors"
import activities from "./adaptiveCards/notification-Activities.json";
import following from "./adaptiveCards/notification-Following.json";
import responsibilities from "./adaptiveCards/notification-Responsibilities.json";
import * as ACData from "adaptivecards-templating";


export function buildAdaptiveCard(req){
    const cardType = req.header('cardType');
    const aadObjectId = req.header('aadObjectId'); // AadObjectId des Benutzers
    const { properties, responsible, comment, url } = req.body;
    let card;
    if (!cardType || !aadObjectId || !url) {
    throw new MissingFields ("Missing fields cardType or id or url", 400)
    }

    let cardData: Responsibilities | Activities | Following;
    let cardTemplate;
    let title;

    if(!isValidAadObjectId(aadObjectId)) throw new WrongAadObjectId("Incorrect format of aadObjectId", 400);

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
        throw new MissingFields("Invalid cardType provided", 400)
    }

    // Ensure the URL is correctly encoded
    try {
    cardData.url = encodeURI(cardData.url);
    } catch (message){throw new MissingFields(message, 400)}
    

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
    try{
        card = new ACData.Template(cardTemplate).expand({
        $root: {
            title: title,
            comment: note,
            description: description,
            notificationUrl: url,
        },
        });
    }catch{
        throw new Error("Error creating Adaptive Card")
    }
    return card;
}

//check if the given id is an aadObjectId
function isValidAadObjectId(id: string): boolean {
    const aadObjectIdRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return aadObjectIdRegex.test(id);
}

