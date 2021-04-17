import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import {Request, Response} from "express";

(async () => {

    // Init the Express application
    const app = express();

    // Set the network port
    const port = process.env.PORT || 8082;

    // Use the body parser middleware for post requests
    app.use(bodyParser.json());

    // Endpoint to filter an image from a public url.
    // Return the filtered image.
    app.get("/filteredimage", async (req: Request, res: Response) => {
        let image_url: string = req.query.image_url;

        if (!image_url) {
            return res.status(422)
                .send("image url is required")
        }

        let filteredPath = await filterImageFromURL(image_url);

        res.on('finish', () => deleteLocalFiles([filteredPath]));

        return res.status(200).sendFile(filteredPath);
    })

    // Root Endpoint
    // Displays a simple message to the user
    app.get("/", async (req: Request, res: Response) => {
        res.send("try GET /filteredimage?image_url={{}}")
    });


    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
})();