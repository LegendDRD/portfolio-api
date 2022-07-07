"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: 'bxlojpczpffzad',
    host: 'ec2-3-248-121-12.eu-west-1.compute.amazonaws.com',
    database: 'd7v7d5q2v5gqm3',
    password: '4dbf85bd36682b4a5e260cf113d9be907fd546dddaaa165809f639f279edc9a1',
    port: 5432, ssl: {
        rejectUnauthorized: false
    }
});
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
exports.db = {
    asyncPool,
};
//# sourceMappingURL=index.js.map