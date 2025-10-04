import multer from "multer";
export const validationfile={
    image:["image/jpeg","image/jpg"]
}
export const uploadcloudfile=(validationfile=[])=>{
    const storage=multer.diskStorage({ })
    function fileFilter(req,file,cb){
        if(validationfile.includes(file.mimetype)){
            cb(null,true)
        }
        else{
            cb("in-valid format",false)
        }
    }
    return multer({dest:"tempath",fileFilter,storage})
}
