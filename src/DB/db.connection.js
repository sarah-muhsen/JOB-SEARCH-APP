import mongoose from "mongoose"; 
export const connectdb=async()=>{
    await mongoose.connect(process.env.DB_URL).then(res=>{
        console.log("the database is connected successsfully");
        
    }).catch(err=>{
        console.log(err,"the database is failed to connect");
        
    })

}