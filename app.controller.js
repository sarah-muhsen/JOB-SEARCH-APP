import { connectdb } from "./src/DB/db.connection.js"
import { globalhandlingerror } from "./src/utils/responses/error.response.js"
import authcontroller from "./src/modules/auth/auth.controller.js"
import usercontroller from "./src/modules/users/user.controller.js"
import companycontroller from "./src/modules/company/company.controller.js"
import jobcontroller from "./src/modules/jobs/jobs.controller.js"

export const bootstrap=(express,app)=>{
app.use(express.json())
app.use("/auth",authcontroller)
app.use("/user",usercontroller)
app.use("/company",companycontroller)
app.use("/job",jobcontroller)
connectdb()
app.use(globalhandlingerror)
}