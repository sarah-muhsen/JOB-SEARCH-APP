import joi from "joi"
import { generalields } from "../../middleware/validation.middleware.js"
export const signup=joi.object().keys({
    firstName:generalields.firstName.required(),
    lastName:generalields.lastName.required(),
    email:generalields.email.required(),
    password:generalields.password.required(),
    gender:generalields.gender,
    DOB:generalields.DOB,
    mobileNumber:generalields.mobileNumber
    
}) 
export const confirmemail=joi.object().keys({
    email:generalields.email.required(),
    code:generalields.code.required()
})
export const login=joi.object().keys({
    email:generalields.email.required(),
    password:generalields.password.required()
})
export const forgetpassword=joi.object().keys({
    email:generalields.email.required(),
   
})
export const resetpassword=joi.object().keys({
    email:generalields.email.required(),
     code:generalields.code.required(),
    password:generalields.password.required()
   
})