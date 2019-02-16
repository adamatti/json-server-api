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

export function setDb(newDb:{ [key:string]:Array<any>; }){
    db = newDb;
    persistDB();
}

async function loadFromFile(){
    const content = (await readFile(dbPath)).toString()
    db = JSON.parse(content)
}

function persistDB(){
    fs.writeFileSync(
        dbPath,
        JSON.stringify(db,null,2)
    )
}

/////// crud functions

export function save(name:string, obj:any):any{
    db[name] = db[name] || []
    
    const id = obj.id || uuid()
    obj.id = id
    
    _.remove(db[name], (it:any) => it.id == id )
    db[name].push(obj)

    persistDB()

    return obj
}

export function findById(name:string, id: any){
    return _.find(db[name], it => it.id == id)
}

export function list(name:string,criteria:{}){
    //TODO implement filter by criteria
    return db[name];
}

/////// Main
loadFromFile()
