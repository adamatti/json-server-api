import * as frisby from "frisby"
import * as uuid from "uuid4"
import {logFactory} from "../src/log"
import { db } from "../src/dbRepo"

const logger = logFactory("crud-person")
const Joi = frisby.Joi

beforeAll ( async () => {
    await db.setDb({})
})

test("Crud person", async () => {
    const obj = {id:uuid(),name:"crud"}

    // insert 
    await frisby.post("http://localhost:3000/people",obj)
        .expect('status',201)
        .expect('json','id',obj.id).promise();

    // Overwrite
    await frisby.post("http://localhost:3000/people",obj)
        .expect('status',201)
        .expect('json','id',obj.id).promise();

    await frisby.get(`http://localhost:3000/people/${obj.id}`)
        .expect('status',200)
        .expect('json','id',obj.id).promise();

    await frisby.get("http://localhost:3000/people/unknown")
        .expect('status',404)
        .promise();

    // Get all
    await frisby.get("http://localhost:3000/people")
        .expect('status',200)
        .expect('jsonTypes', '*', {id: Joi.string()})
        .promise();

    // delete
    return frisby.del(`http://localhost:3000/people/${obj.id}`)
        .expect('status',204)
        .promise();
})
