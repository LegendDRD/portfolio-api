import express, { Request, Response } from "express";
export const basicTest = express.Router();

basicTest.get("/", async (req: Request, res: Response) => {
    try {
        console.log(req.body.aa.toString());
        res.status(200).send("OK");
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});
