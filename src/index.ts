import { logFactory } from "./log"
import * as express from "express"
import * as bodyParser from 'body-parser'
import * as Bluebird from "bluebird"
import * as http from "http"
import config from "./config"
import * as _ from "lodash"
import "./router"
import router from "./router";

const logger = logFactory("index")
const app:express.Application = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(router)

export const server = http.createServer(app)

export const startPromise = Bluebird.fromCallback ( cb => {
    server.listen(config.port, error => {
        logger.info("started");
        cb(error)
    })
})
