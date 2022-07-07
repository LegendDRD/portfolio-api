

import express, { Request, Response } from "express";
import fs from "fs";
import { db } from '../db'

export const router = express.Router();

// router.get("/", async (req: Request, res: Response) => {
//     try {
//         const result = fs.readFileSync(`${process.cwd()}/src/storage/storage.json`, { encoding: "utf8" });
//         res.status(200).send(JSON.parse(result));
//     } catch (e: any) {
//         res.status(500).send(e.message);
//     }

// });

router.get("/", async (req: Request, res: Response) => {
    try {
        const results = await db.asyncPool('SELECT * FROM projects', []);
        console.log(results.rows)
        return res.send(results.rows);
    } catch (e: any) {
        res.status(500).send(e.message);
    }

});

router.post("/insert", async (req: Request, res: Response) => {
    console.log(req.body);
    try {
        if (!req.body) { return res.status(500).send('no body'); }
        const results = await db.asyncPool('INSERT INTO projects (title,description, images,videos,files,tags,timelog,external,status) Values ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
            [req.body.title, req.body.description, JSON.stringify(req.body.images), JSON.stringify(req.body.videos), JSON.stringify(req.body.files), req.body.tags, JSON.stringify(req.body.timelog), JSON.stringify(req.body.external), req.body.status]);

        return res.send(results);
    } catch (e: any) {
        return res.status(500).send(e.message);
    }

});

router.put("/update/:id", async (req: Request, res: Response) => {
    try {
        if (!req.body) { return res.status(500).send('no body'); }

        const { rows } = await db.asyncPool('UPDATE projects set title=$1, description=$2, images=$3, videos=$4, files=$5, tags=$6 ,timelog=$7 WHERE id =$8',
            [req.body.title, req.body.description, JSON.stringify(req.body.images), JSON.stringify(req.body.videos), JSON.stringify(req.body.files), req.body.tags, JSON.stringify(req.body.timelog), req.params.id]);

        return res.send(rows);
    } catch (e: any) {
        return res.status(500).send(e.message);
    }

});