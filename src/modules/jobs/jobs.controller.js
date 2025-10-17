import { Router } from "express";
import * as jobservice from "./services/jobs.services.js"
import { authentication, authorization } from "../../middleware/auth.middleware.js";
import { roletypes } from "../../DB/models/user.model.js";

const router=Router()
router.post("/addjob",authentication(),authorization([roletypes.HR,roletypes.owner]),jobservice.addjob)
router.post("/updatejob/:jobId",authentication(),authorization([roletypes.owner]),jobservice.updatejob)
router.delete("/deletejob/:jobId",authentication(),authorization([roletypes.owner]),jobservice.deleteJob)
export default router