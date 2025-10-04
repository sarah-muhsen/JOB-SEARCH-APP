import multer from "multer";
import fs from "node:fs"
import path from "node:path"
export const validationfile={
    image:["image/jpeg"]
}
export const uploadfiledisk=(custompath="general",validationfile=[])=>{
    const basepath=`uploads/${custompath}`
    const fullpath=path.resolve(`./src/${basepath}`)
    console.log({basepath,fullpath,checkuser:fs.existsSync(fullpath)});
     if(!fs.existsSync(fullpath)){
 fs.mkdirSync(fullpath,{recursive:true})
     }
    
    const storage=multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,fullpath)
        },
        filename:(req,file,cb)=>{
            const finalfilepath= Math.round(Math.random() * 1E9)+file.originalname;
            file .finalpath=basepath+"/"+finalfilepath
            cb(null,Date.now() + '-' +finalfilepath)
           
        }
    })
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
