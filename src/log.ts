// Using this logger module for now, select another one later
function logger(moduleName:string,level:string){
    return function (msg:string){
        console.log(`${new Date().toISOString()} - ${level} - ${moduleName} - ${msg}`)
    }
}

export function logFactory(moduleName:string){
    return {
        debug: logger(moduleName,"DEBUG"), 
        info: logger(moduleName,"INFO")
    }
}
