import * as fs from "fs"
import * as util from "util"
import * as _ from "lodash"
import * as uuid from "uuid4"
import { logFactory } from "./log"
import config from "./config"

const 
    dbPath = config.dbPath,
    readFile = util.promisify(fs.readFile),
    logger = logFactory("dbRepo")
;

let db:{ [key:string]:Array<any>; } = {} 

/////// functions

export async function setDb(newDb:{ [key:string]:Array<any>; }){
    db = newDb;
    await persistDB();
}

async function loadFromFile(){
    const content = (await readFile(dbPath)).toString()
    db = JSON.parse(content)
}

async function persistDB(){
    fs.writeFileSync(
        dbPath,
        JSON.stringify(db,null,2)
    )
}

/////// crud functions

export async function save(name:string, obj:any): Promise<any>{
    db[name] = db[name] || []
    
    const id = obj.id || uuid()
    obj.id = id
    
    _.remove(db[name], (it:any) => it.id == id )
    db[name].push(obj)

    await persistDB()

    return obj
}

export async function findById(name:string, id: any): Promise<any>{
    return _.find(db[name], {id})
}

export async function list(name:string,criteria:{}): Promise<Array<any>>{
    const list = db[name] || [];
    return _.filter(list,criteria);
}

export async function count(name:string, criteria: {}): Promise<number>{
    const list = db[name] || [];
    const collection = _.filter(list,criteria)
    return collection ? collection.length : 0
}

/////// Main
loadFromFile()
