import { providertypes, userModel } from "../../../DB/models/user.model.js";
import { emailevent } from "../../../utils/events/email.event.js";
import { asynchandler } from "../../../utils/responses/error.response.js";
import { successResponse } from "../../../utils/responses/sucess.response.js";
import { comparehash, generatehash } from "../../../utils/security/hash.js";
import { decodedtoken, generatetoken, tokentypes } from "../../../utils/security/token.js";
import * as dbservice from "../../../DB/db.service.js"
import  {OAuth2Client} from'google-auth-library';

export const login=asynchandler(async(req,res,next)=>{
    const {email,password}=req.body;
    const user=await userModel.findOne({email}) 
    if(!user){
        return next(new Error("in-valid account",{cause:404}))
    }
    if(user.provider!=="system"){
         return next(new Error("in-valid provider",{cause:404}))
    }
    if(!comparehash({plaintext:password,hashvalue:user.password})){
return next (new Error("incorrect password",{cause:404}))
    }
    if(!user.isConfirmed){
        return next (new Error("you have to confirm your email first ",{cause:400}))
    }
  const accesstoken=generatetoken({payload:{id:user._id},signature:user.role=="admin"?process.env.ADMIN_ACCESS_TOKEN:process.env.USER_ACCESS_TOKEN })

  const refreshtoken=generatetoken({payload:{id:user._id},signature:user.role=="admin"?process.env.ADMIN_REFRESH_TOKEN:process.env.USER_REFRESH_TOKEN})
    
  return successResponse({res,status:201,data:{accesstoken,refreshtoken}})
    })
        export const forgotpassword=async(req,res,next)=>{
const{email}=req.body
const user =await dbservice.findOne({model:userModel,filter:{email}})
if(!user){
    return next(new Error("not register account",{cause:404}))
}
if(!user.isConfirmed){
    return next (new Error("you have to confirm your email first ",{cause:400}))
}
emailevent.emit("forgotpassword",{id:user.id,email})


return successResponse({res,status:201})
}
export const resetpassword=async(req,res,next)=>{
    const {email,code,password}=req.body;
    const user=await userModel.findOne({email})
    console.log(user);
    
    if(!user){
        return next(new Error("not register account",{cause:404}))
    }
    if(!user.isConfirmed){
        return next (new Error("you have to confirm your email first ",{cause:400}))
    }
    
   const otpDoc = user.OTP.find(o => o.type === "reset-password");
    if (!otpDoc) {
      return next(new Error("No OTP found", { cause: 404 }));
    }
    if (otpDoc.expiresIn < new Date()) {
      return next(new Error("OTP expired", { cause: 410 }));
    }
  
    if (!comparehash({ plaintext: code, hashvalue: otpDoc.code })) {
      return next(new Error("invalid code", { cause: 401 }));
    }
await userModel.updateOne(
  { _id: user.id, email },
  {
    $set: {
      password: generatehash({ plaintext: password }),
      changeCredentialTime: Date.now()
    },
    $pull: {
      OTP: { type: "reset-password" }
    }
  }
);

    return successResponse({res,status:201})
    }
        export const getrefreshtoken=asynchandler(async(req,res,next)=>{
const{authorization}=req.headers;
const user=await decodedtoken({authorization,tokentype:tokentypes.refresh,next})
console.log("hhhhh",user);
if(!user){
    console.log("noooo");
    
}

const accesstoken=generatetoken({payload:{id:user._id},signature:user.role=="admin"?process.env.ADMIN_ACCESS_TOKEN:process.env.USER_ACCESS_TOKEN})

  const refreshtoken=generatetoken({payload:{id:user._id},signature:user.role=="admin"?process.env.ADMIN_REFRESH_TOKEN:process.env.USER_REFRESH_TOKEN})
return successResponse({res,status:201,data:{token:{accesstoken,refreshtoken}}})
    })
      export const loginwithgmail=asynchandler(async(req,res,next)=>{
        const {idToken}=req.body;
        console.log("tota",idToken);
        
        const client = new OAuth2Client();
        async function verify() {
          const ticket = await client.verifyIdToken({
              idToken,
              audience: process.env.CLIENT_ID,  // Specify the WEB_CLIENT_ID of the app that accesses the backend
              // Or, if multiple clients access the backend:
              //[WEB_CLIENT_ID_1, WEB_CLIENT_ID_2, WEB_CLIENT_ID_3]
          });
          const payload = ticket.getPayload();
         return payload;
          // If the request specified a Google Workspace domain:
          // const domain = payload['hd'];
        }
      const payload=await verify()
    let user = await userModel.findOne({ email: payload.email });

if (!user) {
  user = await dbservice.create({
    model: userModel,
    data: {
      firstName: payload.given_name,     // ← أول اسم
      lastName: payload.family_name,     // ← اسم العائلة
      email: payload.email,
      profilePic: payload.picture,
      provider: providertypes.google,
      isConfirmed:true
    }
  });
}
         if(user.provider!==providertypes.google){
     return next (new Error("in-valid provider",{cause:400}))
        }
   
      const accesstoken=generatetoken({payload:{id:user._id},signature:user.role=="admin"?process.env.ADMIN_ACCESS_TOKEN:process.env.USER_ACCESS_TOKEN})
    
      const refreshtoken=generatetoken({payload:{id:user._id},signature:user.role=="admin"?process.env.ADMIN_REFRESH_TOKEN:process.env.USER_REFRESH_TOKEN,expiresIn:315360000})
        
      return successResponse({res,status:201,data:{token:{accesstoken,refreshtoken}}})
        })