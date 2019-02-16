import {startPromise} from "../src/index"
import db = require("../src/dbRepo") 

export default async function (){
    await db.setDb({})
    await startPromise
}
