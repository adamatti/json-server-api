import { db } from "./dbRepo"
import { logFactory } from "./log"
import * as express from "express"
import * as bodyParser from 'body-parser'
import * as Bluebird from "bluebird"
import * as http from "http"
import config from "./config"
import * as pluralize from "pluralize"
import * as _ from "lodash"

const logger = logFactory("index")
const app:express.Application = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

async function processChildren(obj:any,entity:string, embedPlural:string){
    const nestedKey = pluralize(entity,1)
    const criteria = {}; criteria[`${nestedKey}Id`] = obj.id;

    const objToReturn = _.cloneDeep(obj)
    objToReturn[embedPlural] = await db.list(embedPlural,criteria);

    return objToReturn
}

async function processParent(obj:any, embedSingular:string,embedPlural:string){
    const idName = `${embedSingular}Id`
    if (obj[idName]){
        const entity = await db.findById(embedPlural,obj[idName]);
        if (entity){
            const objToReturn = _.cloneDeep(obj)
            objToReturn[embedSingular] = entity
            delete objToReturn[idName];
            return objToReturn
        } 
    }
    return obj;
} 

async function processEmbedded(obj:any,entity:string,embed:string):Promise<any>{
    const embedSingular = pluralize(embed,1)
    const embedPlural = pluralize(embed,2) 

    if (embed == embedSingular){
        return processParent(obj,embedSingular,embedPlural)
    }
    return processChildren(obj,entity,embedPlural)
}

app.get("/", (req,res) => {
    res.json({status:"ok"}).end()
})

app.post("/:entity", async (req,res) => {
    const entity = pluralize(req.params["entity"],2);
    const obj = await db.save(entity,req.body)
    logger.debug(`${entity} created [id: ${obj.id}]`)
    res.status(201).json(obj).end()
})

app.get("/:entity/:id", async (req,res) => {
    const entity = pluralize(req.params["entity"],2);
    const id = req.params["id"];

    logger.debug(`${entity} get [id: ${id}]`)

    let obj = await db.findById(entity,id);

    if (!obj){
        res.status(404).end()
        return
    }

    if (req.query.embed){
        obj = await processEmbedded(obj,entity,req.query.embed)
    }

    res.status(200).json(obj).end()
})

app.get("/:entity", async (req,res) => {
    const entity = pluralize(req.params["entity"],2);
    const list = await db.list(entity,req.query);
    
    logger.debug(`${entity} get all`)

    res.status(200).json(list).end()
})

app.head("/:entity", async (req,res) => {
    const entity = pluralize(req.params["entity"],2);
    const count = await db.count(entity,req.query);

    logger.debug(`${entity} count [${count}]`)

    res.send(`${count}`).end;
})

app.delete("/:entity/:id",async (req,res) => {
    const entity = pluralize(req.params["entity"],2);
    const id = req.params["id"];

    logger.debug(`${entity} delete [id: ${id}]`)

    await db.remove(entity,id);
    res.status(204).end()
})

export const server = http.createServer(app)

export const startPromise = Bluebird.fromCallback ( cb => {
    server.listen(config.port, error => {
        logger.info("started");
        cb(error)
    })
})
