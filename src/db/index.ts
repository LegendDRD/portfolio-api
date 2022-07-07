import { Pool } from 'pg';
// console.log(process.env.DATABASE_URL.replace("postgres://", "").split(":")[0])
// console.log(process.env.DATABASE_URL.replace("postgres://", "").match(/@(.*?):/)[0].replace(':', "").replace("@", ''))
// console.log(process.env.DATABASE_URL.replace("postgres://", "").split("/")[1])
// console.log(process.env.DATABASE_URL.replace("postgres://", "").match(/:(.*?)@/)[0].replace(':', "").replace("@", ''))



const pool = new Pool({
    user: process.env.DATABASE_URL.replace("postgres://", "").split(":")[0],
    host: process.env.DATABASE_URL.replace("postgres://", "").match(/@(.*?):/)[0].replace(':', "").replace("@", ''),
    database: process.env.DATABASE_URL.replace("postgres://", "").split("/")[1],
    password: process.env.DATABASE_URL.replace("postgres://", "").match(/:(.*?)@/)[0].replace(':', "").replace("@", ''),
    port: 5432, ssl: {
        rejectUnauthorized: false
    }
});


const asyncPool: (sql: string, args: any) => Promise<any> = (sql: string, args: any) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, args, (err: any, res: any) => {
            if (err) {
                console.log(err)
                return reject({ StatusCode: 500, message: err.message })
            }
            return resolve(res);
        })
    })
}

export const db = {
    asyncPool,
};
