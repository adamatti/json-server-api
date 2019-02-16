import * as fs from "fs"
import * as util from "util"
import * as _ from "lodash"

const readFile = util.promisify(fs.readFile)

let db = {} 

async function loadFromFile(){
    db = readFile('./db.json')
}

loadFromFile()

export function save(name:string, obj:any){

}
