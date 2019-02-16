import db = require("./dbRepo")
import { logFactory } from "./log"
import * as express from "express"
import * as bodyParser from 'body-parser'
import * as Bluebird from "bluebird"
import * as http from "http"
import config from "./config"

const logger = logFactory("index")
const app:express.Application = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get("/", (req,res) => {
    res.json({status:"ok"}).end()
})

app.post("/:entity", async (req,res) => {
    const entity = req.params["entity"];
    const obj = await db.save(entity,req.body)
    res.status(201).json(obj).end()
})

app.get("/:entity/:id", async (req,res) => {
    const entity = req.params["entity"];
    const id = req.params["id"];
    const obj = await db.findById(entity,id);

    res.status(obj ? 200 : 404).json(obj).end()
})

app.get("/:entity", async (req,res) => {
    const entity = req.params["entity"];
    const list = await db.list(entity,req.query);
    res.status(200).json(list).end()
})


export const server = http.createServer(app)
export const startPromise = Bluebird.fromCallback ( cb => {
    server.listen(config.port, error => {
        logger.info("started");
        cb(error)
    })
})
