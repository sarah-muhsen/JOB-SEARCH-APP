import { asynchandler } from "../../../utils/responses/error.response.js";
import * as dbservice from "../../../DB/db.service.js"
import { userModel } from "../../../DB/models/user.model.js";
import { successResponse } from "../../../utils/responses/sucess.response.js";
import { comparehash } from "../../../utils/security/hash.js";
import { emailevent } from "../../../utils/events/email.event.js";
import cron from "node-cron"

export const signup=asynchandler(async(req,res,next)=>{
  const {firstName,lastName,email,password,mobileNumber}=req.body;
    if(await dbservice.findOne({model:userModel,filter:{email}})){
        return next(new Error("the email exsist",{cause:409}))
    }
    const user= dbservice.create({model:userModel,data:{firstName,lastName,email,password,mobileNumber}})
    
     emailevent.emit("sendconfirmemail",{email})
  return successResponse({res,status:201})
})
 export const confirmemail = asynchandler(async (req, res, next) => {
  const { email, code } = req.body;

  const user = await dbservice.findOne({ model: userModel, filter: { email } });
  if (!user) {
    return next(new Error("invalid account", { cause: 404 }));
  }

  if (user.isConfirmed) {
    return next(new Error("the account already verified", { cause: 409 }));
  }
  const otpDoc = user.OTP.find(o => o.type === "confirm-email");
  if (!otpDoc) {
    return next(new Error("No OTP found", { cause: 404 }));
  }
  if (otpDoc.expiresIn < new Date()) {
    return next(new Error("OTP expired", { cause: 410 }));
  }

  if (!comparehash({ plaintext: code, hashvalue: otpDoc.code })) {
    return next(new Error("invalid code", { cause: 401 }));
  }
  await dbservice.updateOne({
    model: userModel,
    filter: { email },
    data: { isConfirmed: true,   $pull: { OTP: { type: "confirm-email" } }} 
  });

  return successResponse({
    res,
    message: "the account is verified",
    status: 201
  });
});
cron.schedule('* * * * *', async () => {
  const now = new Date();
const result = await userModel.updateMany(
  { "OTP.expiresIn": { $lt: new Date() } },
  { $pull: { OTP: { expiresIn: { $lt: new Date() } } } }
);
  console.log(`[TEST] Deleted ${result.deletedCount} expired OTPs at ${now}`);
});
