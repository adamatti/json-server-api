import * as yargs from "yargs"

const argv = yargs
    .env()
    .example("$0 --port=3000 --db=db.json","Sample run")
    .epilog("For more info pls contact adamatti@gmail.com")
    .option('port',{
        alias:"p",
        default:3000,
        describe:"Port to run",
        type:'number'
    })
    .option('dbPath',{
        alias:"db",
        default:"db.json",
        describe: "path for store data",
        type: 'string'
    })
    .argv;

export default argv
