import * as fs from "fs"
import * as util from "util"
import * as _ from "lodash"
import * as uuid from "uuid4"
import * as lowdb from "lowdb"
import * as FileSync from "lowdb/adapters/FileSync"

import { logFactory } from "./log"
import config from "./config"

export namespace db {
    const 
        adapter = new FileSync(config.dbPath),
        db = lowdb(adapter),
        logger = logFactory("dbRepo")
    ;
    db.read();

    logger.debug("db started")

    /////// functions

    export async function setDb(newDb:{ [key:string]:Array<any>; }){
        db.setState(newDb).write()
    }

    /////// crud functions

    export async function save(name:string, obj:any): Promise<any>{
        const id = obj.id || uuid()
        obj.id = id

        db.get(name).push(obj).write();

        return obj
    }

    export async function findById(name:string, id: any): Promise<any>{
        return db.get(name).find({id}).value();
    }

    export async function list(name:string,criteria:{}): Promise<any[]>{
        return db.get(name).filter(criteria).value();
    }

    export async function count(name:string, criteria: {}): Promise<number>{
        return db.get(name).size().value()
    }

    export async function remove(name:string, id:any){
        return db.get(name).remove({id}).write();
    }
}
