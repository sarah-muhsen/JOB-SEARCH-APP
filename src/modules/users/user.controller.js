import { Router } from "express";
import { authentication } from "../../middleware/auth.middleware.js";
import * as userservice from "./services/user.services.js"
import { uploadcloudfile, validationfile } from "../../utils/multer/cloud.multer.js";
const router =Router()
router.post("/updatedata",authentication(),userservice.upsdateaccountdata)
router.get("/getdata",authentication(),userservice.getaccountdata)
router.get("/getdataforuser/:userid",authentication(),userservice.getdataforuser)
router.patch("/updatepassword",authentication(),userservice.updatepassword)
router.patch("/profile/image",authentication(),uploadcloudfile(validationfile.image).single("image"),userservice.updateuserimage)
 router.patch("/profile/image/cover",authentication(),uploadcloudfile(validationfile.image).array("image",3),userservice.updateprofilecoverimage)
  router.patch("/profile/deleteimage",authentication(),userservice.deleteuserimage)
   router.patch("/profile/deletecoverimage/:index",authentication(),userservice.deleteuserimages)
   router.patch("/softdeleteaccount",authentication(),userservice.softDeleteAccount)
export default router