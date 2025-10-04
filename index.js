import express from 'express'
import * as dotenv from "dotenv"
import path from "node:path"
import { bootstrap } from './app.controller.js'
const app = express()

dotenv.config({path:path.resolve("./src/config/.env.dev")})
bootstrap(express,app)

app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`))