import express from 'express'

const router = express.Router()

// middleware
// Ensures route can only be accessed by the logged in user 
import { requireSignin } from '../middleware/index.js'

// controllers
import {
    createConnectAccount,
    getAccountStatus,
    getAccountBalance,
    payoutSetting,
    stripeSessionId,
    stripeSuccess
} from '../controllers/stripeController.js'

router.post("/create-connect-account", requireSignin, createConnectAccount)
router.post("/get-account-status", requireSignin, getAccountStatus)
router.post("/get-account-balance", requireSignin, getAccountBalance)
router.post("/payout-setting", requireSignin, payoutSetting)
router.post('/stripe-session-id', requireSignin, stripeSessionId)

// order
router.post("/stripe-success", requireSignin, stripeSuccess) 

// V.Imp - Need this old ES5 line to require route in server.js else it will throw an error
export default router