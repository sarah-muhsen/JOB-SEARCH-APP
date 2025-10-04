import { companymodel } from "../../../DB/models/company.model.js";
import { asynchandler } from "../../../utils/responses/error.response.js";
import * as dbservice from "../../../DB/db.service.js"
import { successResponse } from "../../../utils/responses/sucess.response.js";
import { cloud } from "../../../utils/multer/cloudinary.multer.js";
export const addCompany = asynchandler(async (req, res, next) => {
  const { companyName, companyEmail, ...rest } = req.body;
  const existingCompany = await dbservice.findOne({
    model: companymodel,
    filter: {
      $or: [{ companyName }, { companyEmail }],
    },
  });
  if (existingCompany) {
    return next(new Error("Company name or email already exists", { cause: 400 }));
  }
  const company = await dbservice.create({
    model: companymodel,
    data: {
      companyName,
      companyEmail,
      createdBy: req.user._id,
      ...rest, 
    },
  });
  if (!company) {
    return next(new Error("Company not created", { cause: 500 }));
  }

  return successResponse({
    res,
    message: "Company created successfully",
    data: { company },
  });
});
export const updateCompany = asynchandler(async (req, res, next) => {
  const { companyId } = req.params;
  const company = await dbservice.findOne({
    model: companymodel,
    filter: { _id: companyId },
  });
  if (!company) {
    return next(new Error("Company not found", { cause: 404 }));
  }
  if (company.createdBy.toString() !== req.user._id.toString()) {
    return next(new Error("You are not the owner of this company", { cause: 403 }));
  }
  if (req.body.legalAttachment) {
    delete req.body.legalAttachment;
  }
  const updatedCompany = await dbservice.findOneAndUpdate({
    model: companymodel,
    filter: { _id: companyId },
    data: req.body,
    options: { new: true },
  });

  return successResponse({
    res,
    message: "Company updated successfully",
    data: { updatedCompany },
  });
});
export const softDeleteCompany = asynchandler(async (req, res, next) => {
  const { companyId } = req.params;
  const company = await dbservice.findOne({
    model: companymodel,
    filter: { _id: companyId },
  });
  if (!company) {
    return next(new Error("Company not found", { cause: 404 }));
  }
  if (
    req.user.role !== "admin" &&
    company.createdBy.toString() !== req.user._id.toString()
  ) {
    return next(new Error("You are not allowed to delete this company", { cause: 403 }));
  }
  const deletedCompany = await dbservice.findOneAndUpdate({
    model: companymodel,
    filter: { _id: companyId },
    data: { isDeleted:true,deletedAt: Date.now() },
    options: { new: true },
  });

  return successResponse({
    res,
    message: "Company soft deleted successfully",
    data: { deletedCompany },
  });
});
export const searchcompany=asynchandler(async(req,res,next)=>{
  const {companyName}=req.query 
  const company=await dbservice.findOne({model:companymodel,filter:{companyName}})
  if(!company){
    return next (new Error("there is no results",{cause:404}))
  }
  return successResponse({res,data:{company}})
})
export const Uploadcompanylogo =asynchandler(async(req,res,next)=>{
    const {secure_url,public_id}=await cloud.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/companylogo/${req.user._id}`})
    const user=await dbservice.findOneAndUpdate({model:companymodel,data:{logoimage:{secure_url,public_id}},options:{new:false}})
   if(user.logoimage?.public_id){
    cloud.uploader.destroy(user.image.public_id)
   }
return successResponse({res,data:{user}})
})
export const Uploadcompanycover =asynchandler(async(req,res,next)=>{
    const {secure_url,public_id}=await cloud.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/companycover/${req.user._id}`})
    const user=await dbservice.findOneAndUpdate({model:companymodel,data:{coverimage:{secure_url,public_id}},options:{new:false}})
   if(user.coverimage?.public_id){
    cloud.uploader.destroy(user.image.public_id)
   }
return successResponse({res,data:{user}})
})
export const deletelogoimage = asynchandler(async (req, res, next) => {
  const companyexist=await dbservice.findOne({model:companymodel,filter:{createdBy:req.user._id }})
    if (!companyexist) {
    return next(new Error("Company not found", { cause: 404 }));
  }
  await cloud.uploader.destroy(companyexist.logoimage.public_id);
  const company = await dbservice.updateOne({
    model:companymodel,
    filter: {createdBy: req.user._id },
    data: { $unset: {logoimage: "" } }, 
    options: { new: true }
  });

  return successResponse({ res, data: { company} });
});
export const deletecoverimage = asynchandler(async (req, res, next) => {
  const companyexist=await dbservice.findOne({model:companymodel,filter:{createdBy:req.user._id }})
    if (!companyexist) {
    return next(new Error("Company not found", { cause: 404 }));
  }
  await cloud.uploader.destroy(companyexist.coverimage.public_id);
  const company = await dbservice.updateOne({
    model:companymodel,
    filter: {createdBy: req.user._id },
    data: { $unset: {coverimage: "" } }, 
    options: { new: true }
  });

  return successResponse({ res, data: { company} });
});

