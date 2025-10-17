import { companymodel } from "../../../DB/models/company.model.js";
import { jobmodel } from "../../../DB/models/job.model.js";
import { asynchandler } from "../../../utils/responses/error.response.js";
import { successResponse } from "../../../utils/responses/sucess.response.js";
import * as dbservice from "../../../DB/db.service.js"
export const addjob=asynchandler(async(req,res,next)=>{
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    companyId,
  } = req.body;
    const company = await dbservice.findOne({
    model: companymodel,
    filter: { _id: companyId, isDeleted: false },
  });
    if (!company) {
    return next(new Error("Company not found or deleted", { cause: 404 }));
  }
    const job = await dbservice.create({
    model: jobmodel,
    data: {
      jobTitle,
      jobLocation,
      workingTime,
      seniorityLevel,
      jobDescription,
      technicalSkills,
      softSkills,
      companyId,
      addedBy: req.user._id,
    },
  });

  if (!job) {
    return next(new Error("Job not created", { cause: 500 }));
  }

  return successResponse({
    res,
    message: "Job created successfully",
    data: { job },
  });
});
export const updatejob=asynchandler(async(req,res,next)=>{
     const { jobId } = req.params;
       const job = await dbservice.findOne({
    model: jobmodel,
    filter: { _id: jobId, closed: false },
  });

  if (!job) {
    return next(new Error("Job not found or already closed", { cause: 404 }));
  }
  const updatedJob = await dbservice.findOneAndUpdate({
    model: jobmodel,
    filter: { _id: jobId },
    data: { ...req.body, updatedBy: req.user._id },
    options: { new: true },
  });
    return successResponse({
    res,
    message: "Job updated successfully",
    data: { updatedJob },
  });
})
export const deleteJob = asynchandler(async (req, res, next) => {
  const { jobId } = req.params;
  const job = await dbservice.findOne({
    model: jobmodel,
    filter: { _id: jobId, closed: false },
  });

  if (!job) {
    return next(new Error("Job not found", { cause: 404 }));
  }

  const company = await dbservice.findOne({
    model: companymodel,
    filter: { _id: job.companyId, createdBy: req.user._id },
  });

  if (!company) {
    return next(
      new Error("You are not authorized to delete this job", { cause: 403 })
    );
  }

  const deletedJob = await dbservice.findOneAndUpdate({
    model: jobmodel,
    filter: { _id: jobId },
    data: { closed: true },
    options: { new: true },
  });

  return successResponse({
    res,
    message: "Job deleted successfully",
    data: { deletedJob },
  });
});
