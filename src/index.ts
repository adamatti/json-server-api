import * as db from "./dbRepo"
import { logFactory } from "./log"
import * as express from "express"

const 
    logger = logFactory("index"),
    app = express()
;

app.get("/", (req,res) => {
    res.json({status:"ok"}).end()
})

export default app.listen(3000, () => {
    logger.info("started")
})
