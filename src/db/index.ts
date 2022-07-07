import { Pool } from 'pg';

const pool = new Pool({
    user: 'bxlojpczpffzad',
    host: 'ec2-3-248-121-12.eu-west-1.compute.amazonaws.com',
    database: 'd7v7d5q2v5gqm3',
    password: '4dbf85bd36682b4a5e260cf113d9be907fd546dddaaa165809f639f279edc9a1',
    port: 5432, ssl: {
        rejectUnauthorized: false
    }
});


const asyncPool: (sql: string, args: any) => Promise<any> = (sql: string, args: any) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, args, (err: any, res: any) => {
            if (err) {
                console.log(err)
                return reject({ StatusCode: 500, message: "Databse is Starting up, Try Again Later." })
            }
            return resolve(res);
        })
    })
}

export const db = {
    asyncPool,
};
