import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { basicTest } from "./routes/basic.test";
import { router as project } from "./routes/projects";
import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";

import verify from './utils/verify';
import statusCodeSender from "./utils/statusCodeSender";
import maintenance from "./utils/maintenance";

statusCodeSender.start();
// maintenance.emailerChecker();
// maintenance.annualFeeChecker();

if (!process.env.PORT) {
  process.exit(1);
}

import { Client, Pool } from 'pg';
const connectDb = async () => {
  try {
    const pool = new Pool({
      user: 'bxlojpczpffzad',
      host: 'ec2-3-248-121-12.eu-west-1.compute.amazonaws.com',
      database: 'd7v7d5q2v5gqm3',
      password: '4dbf85bd36682b4a5e260cf113d9be907fd546dddaaa165809f639f279edc9a1',
      port: 5432, ssl: {
        rejectUnauthorized: false
      }
    });

    await pool.connect()
    const res = await pool.query('SELECT * FROM projects')
    console.log(res.rows)
    await pool.end()
  } catch (error) {
    console.log(error)
  }
}

connectDb()


const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(cors());
app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ extended: true, limit: '1000mb' }));

// Routes Middlewares
app.use('/public', express.static('./public'));
// USER ROUTES
app.use("/api/test", basicTest);
app.use("/api/projects", project);

app.use(errorHandler);
app.use(notFoundHandler);


app.listen(PORT, () => {
  console.log("\u001B[42m\u001B[30m>-", " Started up ", "-<\u001B[0m\u001B[40m"),
    console.log('> \u001B[32mlistening on port: \u001B[0m' + PORT || 7000)
});