import * as app from "../src"
import * as frisby from "frisby"

const Joi = frisby.Joi

beforeAll(() => {
    return app
})

test("call health check", () => {
    return frisby.get("http://localhost:3000/")
        .expect('status',200)
        .expect('json','status','ok')
        //.expect('jsonTypes', '*', {status: Joi.string()})
})
