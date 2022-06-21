"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const basic_test_1 = require("./routes/basic.test");
const error_middleware_1 = require("./middleware/error.middleware");
const not_found_middleware_1 = require("./middleware/not-found.middleware");
const statusCodeSender_1 = __importDefault(require("./utils/statusCodeSender"));
dotenv.config();
statusCodeSender_1.default.start();
// maintenance.emailerChecker();
// maintenance.annualFeeChecker();
if (!process.env.PORT) {
    process.exit(1);
}
const PORT = parseInt(process.env.PORT, 10);
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '1000mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '1000mb' }));
// Routes Middlewares
app.use('/public', express_1.default.static('./public'));
// USER ROUTES
app.use("/api/webhooks", basic_test_1.basicTest);
app.use(error_middleware_1.errorHandler);
app.use(not_found_middleware_1.notFoundHandler);
app.listen(PORT, () => {
    console.log("\u001B[42m\u001B[30m>-", " Started up ", "-<\u001B[0m\u001B[40m"),
        console.log('> \u001B[32mlistening on port: \u001B[0m' + PORT || 7000);
});
//# sourceMappingURL=api.js.map