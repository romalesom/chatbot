/*function buildAdaptiveCard(req){
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
}*/