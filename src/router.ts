import { db } from "./dbRepo"
import * as pluralize from "pluralize"
import {processEmbedded} from "./embed"
import { logFactory } from "./log"
import * as express from "express"

const 
    logger = logFactory("router"),
    router = express.Router()
;

router.get("/", (req,res) => {
    res.json({status:"ok"}).end()
})

router.post("/:entity", async (req,res) => {
    const entity = pluralize(req.params["entity"],2);
    const obj = await db.save(entity,req.body)
    logger.debug(`${entity} created [id: ${obj.id}]`)
    res.status(201).json(obj).end()
})

router.get("/:entity/:id", async (req,res) => {
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

router.get("/:entity", async (req,res) => {
    const entity = pluralize(req.params["entity"],2);
    const list = await db.list(entity,req.query);
    
    logger.debug(`${entity} get all`)

    res.status(200).json(list).end()
})

router.head("/:entity", async (req,res) => {
    const entity = pluralize(req.params["entity"],2);
    const count = await db.count(entity,req.query);

    logger.debug(`${entity} count [${count}]`)

    res.send(`${count}`).end;
})

router.delete("/:entity/:id",async (req,res) => {
    const entity = pluralize(req.params["entity"],2);
    const id = req.params["id"];

    logger.debug(`${entity} delete [id: ${id}]`)

    await db.remove(entity,id);
    res.status(204).end()
})

export default router
