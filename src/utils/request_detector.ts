import { cLog } from './logger';

export async function baseRequest(apiRequest: any) {
    return new Promise((resolve, reject) => {

        const listOfProperties = ['name', 'email', 'jobTitle', 'company', 'countrys', 'age', 'favouriteColour', 'isMorningPerson',
            'contract', 'signatureName', 'video', 'videoDuration', 'audio', 'transcript', 'latitude', 'longitude', 'region', 'countryCallingCode', 'ipAddress', 'ipCountry', 'postalCode', 'regionCode', 'timeZone', 'utcOffset'];
       // cLog("BaseRequest", `apiRequest:${JSON.stringify(apiRequest)}\n\nList of properties: ${JSON.stringify(listOfProperties)}`);

        const result: any = objectChecker(apiRequest, listOfProperties);
        resolve(result);

    });
};

export async function takealotHookRequest(apiRequest: any) {
    return new Promise((resolve, reject) => {

        const listOfProperties = [
        "order_item_id",
        "order_id",
        "order_date",
        "sale_status",
        "offer_id",
        "tsin",
        "sku",
        "customer",
        "product_title",
        "takealot_url_mobi",
        "selling_price",
        "quantity",
        "warehouse",
        "promotion",
        "shipment_id",
        "shipment_state_id",
        "po_number",
        "shipment_name",
        "takealot_url"];
       // cLog("BaseRequest", `apiRequest:${JSON.stringify(apiRequest)}\n\nList of properties: ${JSON.stringify(listOfProperties)}`);

        const result: any = objectChecker(apiRequest, listOfProperties);
        resolve(result);

    });
};

function objectChecker(apiRequest: any, listOfProperties: any) {
    let foundCounter = 0;
    const keys = Object.keys(apiRequest);

    // cLog("ObjectChecker", `keys: ${JSON.stringify(keys)}\n\n list of properties: ${JSON.stringify(listOfProperties)}`);
    keys.forEach((key, index) => {

        for (let i = 0; i < listOfProperties.length; i++) {

            if (key === listOfProperties[i]) {
                foundCounter++;
            }
        }

    });
    if (foundCounter !== listOfProperties.length) {

        cLog("ObjectChecker Anommaly", `keys: ${keys}\n\n list of properties: ${JSON.stringify(listOfProperties)}`);
        // TODO emailer
        return false;
    }
    return true;
}
