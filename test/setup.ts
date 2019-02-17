import {startPromise} from "../src/index"
import { db } from "../src/dbRepo" 

export default async function (){
    await db.setDb({people:[],tasks:[]})
    return startPromise
}
