import mysql from 'mysql';
import md5 from 'md5';
import bcrypt from 'bcrypt';
import { cLog } from '../utils/logger';
import delay from 'delay';
type value = string | number | undefined | null;


const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.MYSQL_HOST,
    password: process.env.MYSQL_PASS,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DB,
    port: parseInt(process.env.MYSQL_PORT, 10),
    timezone: '+02:00'
})


const AuthGetUser: (email: string, password: any) => Promise<any> = (email, password) => {
    return new Promise((resolve, reject) => {

        if (!email) return resolve(false);
        if (!password) return resolve(false);

        pool.query(`SELECT * FROM users WHERE email = ? LIMIT 1`, [email], async (err, res) => {
            if (err) {
                return reject(err);
            }

            if (res.length < 1) return resolve(false)
            if (!res[0].password) return resolve(false);
            if (res[0].password === '') return resolve(false);


            const authed:any = await AuthCheckPassword(password.toString(), res[0].password, res[0].id);
            if (authed) {
                delete res.password;
                return resolve(res[0]);
            }
            else {
                return resolve(false);
            }
        })
    });
}

const AuthCheckRefreshtoken: (id: string | number, refreshTokenState: string) => Promise<any> = (id, refreshTokenState) => {
    return new Promise((resolve, reject) => {

        if (id) {
            pool.query('SELECT * FROM users WHERE id=?', [id], (err, res) => {
                if (err) {

                    return resolve(false)
                }
                const userInfo = res[0];

                const userState: string = md5(`${userInfo.id}${userInfo.email}${userInfo.password}${userInfo.updated_at}`);

                if (userState === refreshTokenState) {
                    const returndata = {
                        email: userInfo.email,
                        password: userInfo.pwd
                    };
                    return resolve(returndata);
                } else {

                    return resolve(false);
                }

            })
        }
        else {

            return resolve(false);
        }

    })
}

function AuthCheckPassword(check:string, against:string, id:string|number) {
    return new Promise((resolve, reject) => {
        const hash = bcrypt.hashSync(check, 10);

        if (bcrypt.compareSync(check, against)) {
            return resolve(true)

        }else {

            if (check === against) {
                if (id) {
                    pool.query('UPDATE users SET password=? WHERE id=?', [hash, id], (err, res) => {
                        if (err) {
                            return resolve(false)
                        }
                        return resolve(true);
                    })
                }
                else {
                    return resolve(true);
                }
            }
            else {
                return resolve(false);
            }
        }
    })
}

const asyncPool: (sql: string, args: value[]) => Promise<any> = (sql: string, args: value[]) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, args, (err: any, res: any) => {
            if (err) {
                console.log(err)
                return reject(err)
            }
            return resolve(res);
        })
    })
}

async function TakealotInti (orderInfo:any){

    const result = await asyncPool(`TRUNCATE takealot_orders`,[])
    const result2 = await asyncPool(`TRUNCATE sales`,[]);
    await delay(10000);
    for (let i = 0; i <orderInfo.length-1; i++){
        const currentInsert = await asyncPool(`INSERT INTO takealot_orders (order_item_id, order_id, sale_status, offer_id, tsin, sku, product_title, takealot_url_mobi, selling_price, quantity, dc, customer, shipment_id, po_number, shipment_name, takealot_url, shipment_state_id, sales_id, order_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?)`,
        [orderInfo[i].order_item_id, orderInfo[i].order_id, orderInfo[i].sale_status, orderInfo[i].offer_id,orderInfo[i].tsin,orderInfo[i].sku,orderInfo[i].product_title,orderInfo[i].takealot_url_mobi, orderInfo[i].selling_price ,orderInfo[i].quantity ,orderInfo[i].dc,orderInfo[i].customer,orderInfo[i].shipment_id,orderInfo[i].po_number,orderInfo[i].shipment_name,orderInfo[i].takealot_url,orderInfo[i].shipment_state_id, orderInfo[i].sales_id, orderInfo[i].order_date])
        if (currentInsert.affectedRows !== 1){
            cLog("Error on takealot Intial insert of orders",JSON.stringify(orderInfo[i]));
        }
    }

}

async function TakealotOfferInti (offers:any){

    const result = await asyncPool(`TRUNCATE takealot_offers`,[]);

    for (let i = 0; i <offers.length-1; i++){

        const currentInsert = await asyncPool(`INSERT IGNORE INTO takealot_offers (tsin_id, offer_id, sku, barcode, product_label_number, selling_price, rrp, leadtime_days, leadtime_stock, status, title, offer_url, stock_at_takealot, stock_on_way, total_stock_on_way, stock_cover, total_stock_cover, sales_units, stock_at_takealot_total, date_created, storage_fee_eligible, discount, discount_shown, replen_block_jhb, replen_block_cpt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [offers[i].tsin_id,  offers[i].offer_id,  offers[i].sku,  offers[i].barcode, offers[i].product_label_number, offers[i].selling_price, offers[i].rrp, offers[i].leadtime_days,  JSON.stringify(offers[i].leadtime_stock) , offers[i].status , offers[i].title, offers[i].offer_url, JSON.stringify(offers[i].stock_at_takealot), JSON.stringify(offers[i].stock_on_way), offers[i].total_stock_on_way, JSON.stringify(offers[i].stock_cover), offers[i].total_stock_cover,  JSON.stringify(offers[i].sales_units),  offers[i].stock_at_takealot_total, offers[i].date_created, offers[i].storage_fee_eligible, offers[i].discount,  offers[i].discount_shown,  offers[i].replen_block_jhb, offers[i].replen_block_cpt])
        // if (currentInsert.affectedRows !== 1){
        //     cLog("Error on takealot Intial insert of offers",JSON.stringify(offers[i]));
        // }
    }

}

async function getAllVoiceOverArtists (){

    const result = asyncPool(`SELECT * FROM voiceover_artists`,[])

    return result
}
async function getVoiceOverArtist (id:number){

    const result = asyncPool(`SELECT * FROM voiceover_artists WHERE id = ?`, [id]);

    return result
}
export const db = {
    AuthGetUser,
    AuthCheckRefreshtoken,
    asyncPool,
    TakealotInti,
    getAllVoiceOverArtists,
    getVoiceOverArtist,TakealotOfferInti
};
