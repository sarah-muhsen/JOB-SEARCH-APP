
export const create=async({model,data={}}={})=>{
const document =await model.create(data)
return document 
}
export const findOne=async({model,filter={},select="",populate=[]}={})=>{
    const document =await model.findOne(filter).select(select).populate(populate)
    return document 
    }
    export const find=async({model,filter={},select="",populate=[],skip=0,limit=1000}={})=>{
        const document =await model.find(filter).select(select).populate(populate).skip(skip).limit(limit)
        return document 
        }

export const updateOne=async({model,filter={},data={},options={}})=>{
const document=await model.updateOne(filter,data,options)
return document
}
export const findOneAndUpdate=async({model,filter={},data={},select='',options={},populate=[]}={})=>{
    const document =await model.findOneAndUpdate(filter,data,options).select(select).populate(populate)
    return document 
    }
    export const findOneAndDelete=async({model,filter={}}={})=>{
        const document =await model.findOneAndDelete(filter)
        return document 
        }
    
    