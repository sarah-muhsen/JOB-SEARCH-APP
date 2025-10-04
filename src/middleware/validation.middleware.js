import joi from "joi"
import { Types } from "mongoose"
import { gendertypes } from "../DB/models/user.model.js"

export const isvalidobjectid=(value,helper)=>{
    return Types.ObjectId.isValid(value)?true:helper.message("in-valid object id")
}
export const generalields={
firstName:joi.string().min(2).max(50).trim(),
lastName:joi.string().min(2).max(50).trim(),
password:joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)),
email:joi.string().email({minDomainSegments:2,maxDomainSegments:3,tlds:{allow:["com","net"]}}),
code:joi.string().pattern(new RegExp(/^\d{4}$/)),
id:joi.string().custom(isvalidobjectid),
gender:joi.string().valid(...Object.values(gendertypes)),
DOB:joi.date().less("now"),
  mobileNumber: joi.string()
    .pattern(new RegExp(/^(?:\+20|20|0)?1[0125]\d{8}$/))
    .required()
    .messages({
      "string.pattern.base": "Mobile number must be a valid Egyptian number (e.g. 01012345678 or +201012345678)"
    })

}
export const validation=(schema)=>{
    return (req,res,next)=>{
        const inputdata={...req.body,...req.params,...req.query}
        if(req.file||req.files?.length){
            inputdata.File=req.file||req.files
        }
        console.log(inputdata);
        
        const validationresult=schema.validate(inputdata,{abortEarly:false})
        if(validationresult.error){
            return res.status(401).json({message:"validation error",details:validationresult.error.details})
        }
        return next()
    }
        
    
}