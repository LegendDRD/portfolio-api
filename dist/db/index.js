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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const mysql_1 = __importDefault(require("mysql"));
const md5_1 = __importDefault(require("md5"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const logger_1 = require("../utils/logger");
const delay_1 = __importDefault(require("delay"));
const pool = mysql_1.default.createPool({
    connectionLimit: 10,
    host: process.env.MYSQL_HOST,
    password: process.env.MYSQL_PASS,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DB,
    port: parseInt(process.env.MYSQL_PORT, 10),
    timezone: '+02:00'
});
const AuthGetUser = (email, password) => {
    return new Promise((resolve, reject) => {
        if (!email)
            return resolve(false);
        if (!password)
            return resolve(false);
        pool.query(`SELECT * FROM users WHERE email = ? LIMIT 1`, [email], (err, res) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return reject(err);
            }
            if (res.length < 1)
                return resolve(false);
            if (!res[0].password)
                return resolve(false);
            if (res[0].password === '')
                return resolve(false);
            const authed = yield AuthCheckPassword(password.toString(), res[0].password, res[0].id);
            if (authed) {
                delete res.password;
                return resolve(res[0]);
            }
            else {
                return resolve(false);
            }
        }));
    });
};
const AuthCheckRefreshtoken = (id, refreshTokenState) => {
    return new Promise((resolve, reject) => {
        if (id) {
            pool.query('SELECT * FROM users WHERE id=?', [id], (err, res) => {
                if (err) {
                    return resolve(false);
                }
                const userInfo = res[0];
                const userState = (0, md5_1.default)(`${userInfo.id}${userInfo.email}${userInfo.password}${userInfo.updated_at}`);
                if (userState === refreshTokenState) {
                    const returndata = {
                        email: userInfo.email,
                        password: userInfo.pwd
                    };
                    return resolve(returndata);
                }
                else {
                    return resolve(false);
                }
            });
        }
        else {
            return resolve(false);
        }
    });
};
function AuthCheckPassword(check, against, id) {
    return new Promise((resolve, reject) => {
        const hash = bcrypt_1.default.hashSync(check, 10);
        if (bcrypt_1.default.compareSync(check, against)) {
            return resolve(true);
        }
        else {
            if (check === against) {
                if (id) {
                    pool.query('UPDATE users SET password=? WHERE id=?', [hash, id], (err, res) => {
                        if (err) {
                            return resolve(false);
                        }
                        return resolve(true);
                    });
                }
                else {
                    return resolve(true);
                }
            }
            else {
                return resolve(false);
            }
        }
    });
}
const asyncPool = (sql, args) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, args, (err, res) => {
            if (err) {
                console.log(err);
                return reject(err);
            }
            return resolve(res);
        });
    });
};
function TakealotInti(orderInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield asyncPool(`TRUNCATE takealot_orders`, []);
        const result2 = yield asyncPool(`TRUNCATE sales`, []);
        yield (0, delay_1.default)(10000);
        for (let i = 0; i < orderInfo.length - 1; i++) {
            const currentInsert = yield asyncPool(`INSERT INTO takealot_orders (order_item_id, order_id, sale_status, offer_id, tsin, sku, product_title, takealot_url_mobi, selling_price, quantity, dc, customer, shipment_id, po_number, shipment_name, takealot_url, shipment_state_id, sales_id, order_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?)`, [orderInfo[i].order_item_id, orderInfo[i].order_id, orderInfo[i].sale_status, orderInfo[i].offer_id, orderInfo[i].tsin, orderInfo[i].sku, orderInfo[i].product_title, orderInfo[i].takealot_url_mobi, orderInfo[i].selling_price, orderInfo[i].quantity, orderInfo[i].dc, orderInfo[i].customer, orderInfo[i].shipment_id, orderInfo[i].po_number, orderInfo[i].shipment_name, orderInfo[i].takealot_url, orderInfo[i].shipment_state_id, orderInfo[i].sales_id, orderInfo[i].order_date]);
            if (currentInsert.affectedRows !== 1) {
                (0, logger_1.cLog)("Error on takealot Intial insert of orders", JSON.stringify(orderInfo[i]));
            }
        }
    });
}
function TakealotOfferInti(offers) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield asyncPool(`TRUNCATE takealot_offers`, []);
        for (let i = 0; i < offers.length - 1; i++) {
            const currentInsert = yield asyncPool(`INSERT IGNORE INTO takealot_offers (tsin_id, offer_id, sku, barcode, product_label_number, selling_price, rrp, leadtime_days, leadtime_stock, status, title, offer_url, stock_at_takealot, stock_on_way, total_stock_on_way, stock_cover, total_stock_cover, sales_units, stock_at_takealot_total, date_created, storage_fee_eligible, discount, discount_shown, replen_block_jhb, replen_block_cpt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [offers[i].tsin_id, offers[i].offer_id, offers[i].sku, offers[i].barcode, offers[i].product_label_number, offers[i].selling_price, offers[i].rrp, offers[i].leadtime_days, JSON.stringify(offers[i].leadtime_stock), offers[i].status, offers[i].title, offers[i].offer_url, JSON.stringify(offers[i].stock_at_takealot), JSON.stringify(offers[i].stock_on_way), offers[i].total_stock_on_way, JSON.stringify(offers[i].stock_cover), offers[i].total_stock_cover, JSON.stringify(offers[i].sales_units), offers[i].stock_at_takealot_total, offers[i].date_created, offers[i].storage_fee_eligible, offers[i].discount, offers[i].discount_shown, offers[i].replen_block_jhb, offers[i].replen_block_cpt]);
            // if (currentInsert.affectedRows !== 1){
            //     cLog("Error on takealot Intial insert of offers",JSON.stringify(offers[i]));
            // }
        }
    });
}
function getAllVoiceOverArtists() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = asyncPool(`SELECT * FROM voiceover_artists`, []);
        return result;
    });
}
function getVoiceOverArtist(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = asyncPool(`SELECT * FROM voiceover_artists WHERE id = ?`, [id]);
        return result;
    });
}
exports.db = {
    AuthGetUser,
    AuthCheckRefreshtoken,
    asyncPool,
    TakealotInti,
    getAllVoiceOverArtists,
    getVoiceOverArtist, TakealotOfferInti
};
//# sourceMappingURL=index.js.map