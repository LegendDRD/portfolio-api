"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.takealotHookRequest = exports.baseRequest = void 0;
const logger_1 = require("./logger");
function baseRequest(apiRequest) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const listOfProperties = ['name', 'email', 'jobTitle', 'company', 'countrys', 'age', 'favouriteColour', 'isMorningPerson',
                'contract', 'signatureName', 'video', 'videoDuration', 'audio', 'transcript', 'latitude', 'longitude', 'region', 'countryCallingCode', 'ipAddress', 'ipCountry', 'postalCode', 'regionCode', 'timeZone', 'utcOffset'];
            // cLog("BaseRequest", `apiRequest:${JSON.stringify(apiRequest)}\n\nList of properties: ${JSON.stringify(listOfProperties)}`);
            const result = objectChecker(apiRequest, listOfProperties);
            resolve(result);
        });
    });
}
exports.baseRequest = baseRequest;
;
function takealotHookRequest(apiRequest) {
    return __awaiter(this, void 0, void 0, function* () {
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
                "takealot_url"
            ];
            // cLog("BaseRequest", `apiRequest:${JSON.stringify(apiRequest)}\n\nList of properties: ${JSON.stringify(listOfProperties)}`);
            const result = objectChecker(apiRequest, listOfProperties);
            resolve(result);
        });
    });
}
exports.takealotHookRequest = takealotHookRequest;
;
function objectChecker(apiRequest, listOfProperties) {
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
        (0, logger_1.cLog)("ObjectChecker Anommaly", `keys: ${keys}\n\n list of properties: ${JSON.stringify(listOfProperties)}`);
        // TODO emailer
        return false;
    }
    return true;
}
//# sourceMappingURL=request_detector.js.map