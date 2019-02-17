import * as pluralize from "pluralize"
import { db } from "./dbRepo"
import * as _ from "lodash"

async function processChildren(obj:any,entity:string, embedPlural:string){
    const nestedKey = pluralize(entity,1)
    const criteria = {}; criteria[`${nestedKey}Id`] = obj.id;

    const objToReturn = _.cloneDeep(obj)
    objToReturn[embedPlural] = await db.list(embedPlural,criteria);

    return objToReturn
}

async function processParent(obj:any, embedSingular:string,embedPlural:string){
    const idName = `${embedSingular}Id`
    if (obj[idName]){
        const entity = await db.findById(embedPlural,obj[idName]);
        if (entity){
            const objToReturn = _.cloneDeep(obj)
            objToReturn[embedSingular] = entity
            delete objToReturn[idName];
            return objToReturn
        } 
    }
    return obj;
} 

export async function processEmbedded(obj:any,entity:string,embed:string):Promise<any>{
    const embedSingular = pluralize(embed,1)
    const embedPlural = pluralize(embed,2) 

    if (embed == embedSingular){
        return processParent(obj,embedSingular,embedPlural)
    }
    return processChildren(obj,entity,embedPlural)
}
