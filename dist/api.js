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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const basic_test_1 = require("./routes/basic.test");
const projects_1 = require("./routes/projects");
const error_middleware_1 = require("./middleware/error.middleware");
const not_found_middleware_1 = require("./middleware/not-found.middleware");
const statusCodeSender_1 = __importDefault(require("./utils/statusCodeSender"));
statusCodeSender_1.default.start();
// maintenance.emailerChecker();
// maintenance.annualFeeChecker();
if (!process.env.PORT) {
    process.exit(1);
}
const pg_1 = require("pg");
const connectDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = new pg_1.Pool({
            user: 'bxlojpczpffzad',
            host: 'ec2-3-248-121-12.eu-west-1.compute.amazonaws.com',
            database: 'd7v7d5q2v5gqm3',
            password: '4dbf85bd36682b4a5e260cf113d9be907fd546dddaaa165809f639f279edc9a1',
            port: 5432, ssl: {
                rejectUnauthorized: false
            }
        });
        yield pool.connect();
        const res = yield pool.query('SELECT * FROM projects');
        console.log(res.rows);
        yield pool.end();
    }
    catch (error) {
        console.log(error);
    }
});
connectDb();
const PORT = parseInt(process.env.PORT, 10);
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '1000mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '1000mb' }));
// Routes Middlewares
app.use('/public', express_1.default.static('./public'));
// USER ROUTES
app.use("/api/test", basic_test_1.basicTest);
app.use("/api/projects", projects_1.router);
app.use(error_middleware_1.errorHandler);
app.use(not_found_middleware_1.notFoundHandler);
app.listen(PORT, () => {
    console.log("\u001B[42m\u001B[30m>-", " Started up ", "-<\u001B[0m\u001B[40m"),
        console.log('> \u001B[32mlistening on port: \u001B[0m' + PORT || 7000);
});
//# sourceMappingURL=api.js.map