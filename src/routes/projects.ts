

import express, { Request, Response } from "express";
const personalProjects = [{
    name: "FPS DEMO",
    genre: "FPS",
    description: "wdwda adwad wada \ndwadwadaa wdwda adwad wada \ndwadwadaa wdwda adwad wada \ndwadwadaawdwda adwad wada \ndwadwadaa",
    image: "https://source.unsplash.com/600x400/?computer"
}, {
    name: "Eternatal Destruction",
    genre: "ROUGELIKE",
    description: "wdwda adwad wada \ndwadwadaa",
    image: "https://source.unsplash.com/600x400/?computer"
}, {
    name: "Mars Survival",
    genre: "2.5 D",
    description: "wdwda adwad wada \ndwadwadaa",
    image: "https://source.unsplash.com/600x400/?animal"
}, {
    name: "Neon Runner",
    genre: "3D",
    description: "wdwda adwad wada \ndwadwadaa",
    image: "https://source.unsplash.com/600x400/?computer"
}, {
    name: "FPS DEMO",
    genre: "FPS",
    description: "wdwda adwad wada \ndwadwadaa",
    image: "https://source.unsplash.com/600x400/?computer"
}, {
    name: "Eternatal Destruction",
    genre: "ROUGELIKE",
    description: "wdwda adwad wada \ndwadwadaa",
    image: "https://source.unsplash.com/600x400/?computer"
},]

export const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    try {

        res.status(200).send(personalProjects);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});