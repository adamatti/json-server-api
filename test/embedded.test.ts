import * as frisby from "frisby"
import * as uuid from "uuid4"
import {logFactory} from "../src/log"

const logger = logFactory("embedded")
const Joi = frisby.Joi

test("embedded objects", async ()=>{
    const person = {id:uuid(),name:"adamatti"}
    // task belongs to person
    const task = {id: uuid(), personId: person.id, subject:"do domething"}

    await frisby.post("http://localhost:3000/people",person)
        .expect('status',201)
        .promise()

    await frisby.post("http://localhost:3000/tasks",task)
        .expect('status',201)
        .promise()

    await frisby.get(`http://localhost:3000/tasks/${task.id}?embed=person`)
        .expect('status',200)
        .then( res => {
            const taskFromApi = res.json
            const personFromApi = taskFromApi.person;

            expect(taskFromApi.id).toBe(task.id);
            expect(taskFromApi.personId).toBeUndefined();
            expect(personFromApi).toEqual(person);
        })
        .promise()

    await frisby.get(`http://localhost:3000/people/${person.id}?embed=tasks`)
        .expect('status',200)
        .then( res => {
            const personFromApi = res.json
            const tasks = personFromApi.tasks;

            expect(personFromApi.id).toBe(person.id);
            expect(tasks).toEqual([task]);
        })
        .promise()
})
