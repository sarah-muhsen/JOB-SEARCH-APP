//  import { roletypes } from "../DB/models/user.model.js";
// import { asynchandler } from "../utils/response/error.response.js";
// import { decodedtoken, tokentypes } from "../utils/security/token.js";

import { asynchandler } from "../utils/responses/error.response.js";
import { decodedtoken } from "../utils/security/token.js";
import { roletypes } from "../DB/models/user.model.js";

export const authentication=()=>{
    return asynchandler(async(req,res,next)=>{
        const{authorization}=req.headers;
        req.user=await decodedtoken({authorization,next})
        return next()
        })
}
export const authorization=(roletypes=[])=>{
    return asynchandler((req,res,next)=>{
        if(!roletypes.includes(req.user.role)){
            return next(new Error("you are not authorized to be here",{cause:403}))
        }
        return next()
    })
}