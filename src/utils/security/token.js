import jwt from "jsonwebtoken"
import { userModel } from "../../DB/models/user.model.js"
 import * as dbservice from "../../DB/db.service.js"
// import { usermodel } from "../../DB/models/user.model.js"
export const generatetoken=({payload={},signature=process.env.USER_ACCESS_TOKEN}={})=>{
    const token =jwt.sign(payload,signature)
return token
}
export const verifytoken=({token="",signature=process.env.USER_ACCESS_TOKEN}={})=>{
    const decoded =jwt.verify(token,signature)
return decoded
}
export const tokentypes={
    access:"access",
    refresh:"refresh"
}
export const decodedtoken=async({authorization="",tokentype=tokentypes.access,next={}}={})=>{
    const[bearer,token]=authorization?.split(" ")||[]
    console.log({bearer ,token});
    let access_signature='';
    let refresh_signature='';
    
    switch (bearer) {
        case "admin":
           
           refresh_signature=process.env.ADMIN_REFRESH_TOKEN;
            access_signature=process.env.ADMIN_ACCESS_TOKEN;
            break;
             case "hr":
             case "owner":
            case "user":
                access_signature=process.env.USER_ACCESS_TOKEN;
            refresh_signature=process.env.USER_REFRESH_TOKEN;
                break;
    
        default:
            break;
    }
    const decoded=verifytoken({token,signature:tokentype==tokentypes.access?access_signature:refresh_signature})
    if(!decoded?.id){
    return next(new Error("in-valid token payload",{cause:401}))
    }
    console.log(decoded);
    
    const user =await dbservice.findOne({model:userModel,filter:{_id:decoded.id}})
    
    if(!user){
        return next(new Error("not register account",{cause:404}))
    }
    if(user.changecridentialsTime?.getTime()>=decoded.iat*1000){
        return next(new Error("in-valid login credentails",{cause:400}))
    }
    
    return user;
}

