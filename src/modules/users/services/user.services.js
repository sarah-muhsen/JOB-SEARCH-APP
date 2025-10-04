import { asynchandler } from "../../../utils/responses/error.response.js";
import * as dbservice from "../../../DB/db.service.js"
import { userModel } from "../../../DB/models/user.model.js";
import { successResponse } from "../../../utils/responses/sucess.response.js";
import { comparehash, generatehash } from "../../../utils/security/hash.js";
import { cloud } from "../../../utils/multer/cloudinary.multer.js";


export const upsdateaccountdata=asynchandler(async(req,res,next)=>{
    const{firstName,lastName,DOB,gender,mobileNumber}=req.body
const user =await dbservice.findOneAndUpdate({model:userModel,filter:{_id:req.user.id},data:{firstName,lastName,DOB,gender,mobileNumber}})
successResponse({res,data:{user}})
})
export const getaccountdata=asynchandler(async(req,res,next)=>{
const user =await dbservice.findOne({model:userModel,filter:{_id:req.user.id}})

successResponse({res,data:{user}})
})
export const getdataforuser=asynchandler(async(req,res,next)=>{
    const{userid}=req.params    
const user =await dbservice.findOne({model:userModel,filter:{_id:userid},select:'firstName lastName mobileNumber'})

successResponse({res,data:{user}})
})
export const updatepassword=asynchandler(async(req,res,next)=>{
const {oldpassword,newpassword}=req.body
if(!comparehash({plaintext:oldpassword,hashvalue:req.user.password})){
return next(new Error("wrong password",{cause:404}))
}
const user=await dbservice.findOneAndUpdate({model:userModel,filter:{_id:req.user._id},data:{password:generatehash({plaintext:newpassword})}})
successResponse({res,data:{user}})
})
export const updateuserimage=asynchandler(async(req,res,next)=>{
    const {secure_url,public_id}=await cloud.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/user/${req.user._id}`})
    const user=await dbservice.findOneAndUpdate({model:userModel,data:{profilePic:{secure_url,public_id}},options:{new:false}})
   if(user. profilePic?.public_id){
    cloud.uploader.destroy(user.image.public_id)
   }
return successResponse({res,data:{user}})
})
export const updateprofilecoverimage=asynchandler(async(req,res,next)=>{
    let images=[]
    for (const file of req.files) {
        const {secure_url,public_id}=await cloud.uploader.upload(file.path,{folder:`${process.env.APP_NAME}/user/${req.user._id}/cover`})
   images.push({secure_url,public_id})
    }
     const user=await dbservice.findOneAndUpdate({model:userModel,data:{coverPic:images},options:{new:false}})
   
return successResponse({res,data:{user}})
})
export const deleteuserimage = asynchandler(async (req, res, next) => {
    console.log(req.user);
  // 1) امسح من Cloudinary
  await cloud.uploader.destroy(req.user.profilePic.public_id);

  // 2) حدث الـ user في DB
  const user = await dbservice.findOneAndUpdate({
    model: userModel,
    filter: { _id: req.user._id },
    data: { $unset: { profilePic: "" } }, // مسح الـ profilePic
    options: { new: true }
  });

  return successResponse({ res, data: { user } });
});
export const deleteuserimages = asynchandler(async (req, res, next) => {

const{index}=req.params
const public_id1=req.user.coverPic[index].public_id

  // 1) امسح من Cloudinary
  await cloud.uploader.destroy(public_id1);

  // 2) حدث الـ user في DB
  const user = await dbservice.findOneAndUpdate({
    model: userModel,
    filter: { _id: req.user._id },
    data: { $pull: { coverPic: {public_id:public_id1} }}, // مسح الـ profilePic
    options: { new: true }
  });

  return successResponse({ res, data: { user } });
});
export const softDeleteAccount = asynchandler(async (req, res, next) => {


  const user = await dbservice.findOneAndUpdate({model:userModel,filter:{_id:req.user._id},data:{isDeleted:true,deletedAt:Date.now()}})

  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

return successResponse({res,data:{user}})
});
