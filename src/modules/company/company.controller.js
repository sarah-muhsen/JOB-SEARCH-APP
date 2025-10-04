
import { Router } from "express"
import { authentication } from "../../middleware/auth.middleware.js"
import * as companyservice from "./services/company.services.js"
import { uploadcloudfile, validationfile } from "../../utils/multer/cloud.multer.js"
const router =Router()
router.post("/addcompany",authentication(),companyservice.addCompany)
router.patch("/updatecompany/:companyId",authentication(),companyservice.updateCompany)
router.delete("/softdeletecompany/:companyId",authentication(),companyservice.softDeleteCompany)
router.get("/searchcompany",authentication(),companyservice.searchcompany)
router.patch("/logoimage",authentication(),uploadcloudfile(validationfile.image).single("image"),companyservice.Uploadcompanylogo)
router.patch("/logocover",authentication(),uploadcloudfile(validationfile.image).single("image"),companyservice.Uploadcompanycover)
 router.delete("/deletelogoimage",authentication(),companyservice.deletelogoimage)
  router.delete("/deletecoverimage",authentication(),companyservice.deletecoverimage)
export default router