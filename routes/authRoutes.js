import express from 'express'
import { register, login } from '../controllers/authController.js'

const router = express.Router()

router.post("/register", register)
router.post("/login", login)


// V.Imp - Need this old ES5 line to require route in server.js else it will throw an error 
export default router