import * as frisby from "frisby"
import * as uuid from "uuid4"

const Joi = frisby.Joi

test("Save person", async () => {
    const obj = {id:uuid(),name:"adamatti"}

    await frisby.get(`http://localhost:3000/person/${obj.id}`)
        .expect('status',404)
        .promise();

    // insert 
    await frisby.post("http://localhost:3000/person",obj)
        .expect('status',201)
        .expect('json','id',obj.id).promise();

    // Overwrite
    await frisby.post("http://localhost:3000/person",obj)
        .expect('status',201)
        .expect('json','id',obj.id).promise();

    await frisby.get(`http://localhost:3000/person/${obj.id}`)
        .expect('status',200)
        .expect('json','id',obj.id).promise();

    await frisby.get("http://localhost:3000/person/unknown")
        .expect('status',404)
        .promise();

    // Get all
    return frisby.get("http://localhost:3000/person")
        .expect('status',200)
        .expect('jsonTypes', '*', {id: Joi.string()})
        .promise();
})
