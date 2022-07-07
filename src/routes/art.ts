

import express, { Request, Response } from "express";
import fs from "fs";
import { db } from '../db'

export const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const results = await db.asyncPool('SELECT * FROM art', []);
        // console.log(results.rows)
        return res.send(results.rows);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});
