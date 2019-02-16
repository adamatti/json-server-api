import {startPromise} from "../src/index"
import db = require("../src/dbRepo") 

export default async function (){
    db.setDb({})
    await startPromise
}
