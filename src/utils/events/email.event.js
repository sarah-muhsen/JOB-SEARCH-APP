import { customAlphabet } from "nanoid";
import { EventEmitter } from "node:events";
import { generatehash } from "../security/hash.js";
import { userModel } from "../../DB/models/user.model.js";
import { sendemail } from "../email/send.email.js";
import { confirmemailtemplate } from "../templates/verifyemail.template.js";
export const emailevent= new EventEmitter()
export const emailsubject={
    confirmemail:"confirm-email",
    resetpassword:"reset-password"
}
export const sendcode=async({data={},subject=emailsubject.confirmemail}={})=>{
    const {email}=data;
    const otp=customAlphabet("0123456789",4)();
    const hashotp=generatehash({plaintext:otp})
 const expiresIn = new Date(Date.now() + 10 * 60 * 1000);
    let updatedata={}
    switch (subject) {
        case emailsubject.confirmemail:
            updatedata = {
  code: hashotp,
  type: subject,
  expiresIn
};
            break;
            case emailsubject.resetpassword:
            updatedata = {
  code: hashotp,
  type: subject,
  expiresIn
};
                break;
        default:
            break;
    } 
    await userModel.updateOne({email},  { $push: { OTP: updatedata } } )
    const html=confirmemailtemplate({code:otp})
     await sendemail({to:email,html,subject})
    //  console.log(email);
}
emailevent.on("sendconfirmemail",async(data)=>{
 await sendcode({data,subject :emailsubject.confirmemail})
})
emailevent.on("forgotpassword",async(data)=>{
 await sendcode({data,subject:emailsubject.resetpassword})

})