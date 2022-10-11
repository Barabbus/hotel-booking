import User from '../models/User.js'
import Stripe from 'stripe'
import Order from '../models/Order.js'
import Hotel from '../models/Hotel.js'

// Parse and stringify url query strings
import queryString from 'query-string'

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

// Create Stripe Account
const createConnectAccount = async (req, res) => {
    // Find user from db
    const user = await User.findById(req.auth._id).exec()    
    // If user doesn't have a stripe_account_id, create a new account
    if (!user.stripe_account_id) {
        const account = await stripe.accounts.create({
            type: "express",
        })        
        // Save Stripe account id to database
        user.stripe_account_id = account.id
        user.save()
    }
    // Create login link based on account id (for frontend to complete onboarding)
    let accountLink = await stripe.accountLinks.create({
        account: user.stripe_account_id,
        refresh_url: process.env.STRIPE_REDIRECT_URL,
        return_url: process.env.STRIPE_REDIRECT_URL,
        type: "account_onboarding"
    })
    // Prefill any info such as email
    accountLink = Object.assign(accountLink, {
        "stripe_user[email]": user.email || undefined
    })
    let link = `${accountLink.url}?${queryString.stringify(accountLink)}`    
    res.send(link)
}

// Update waiting period for first payout on Stripe
const updateDelayDays = async (accountId) => {
    const account = await stripe.accounts.update(accountId, {
        settings: {
            payouts: {
                schedule: {
                    delay_days: 10
                },
            },
        },
    })
    return account
}

const getAccountStatus = async (req, res) => {    
    const user = await User.findById(req.auth._id).exec()
    // Get details of user's Stripe account
    const account = await stripe.accounts.retrieve(user.stripe_account_id)    
    // update delay days
    const updatedAccount = await updateDelayDays(account.id)
    const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
            stripe_seller: updatedAccount
        },
        /* Ensure the below is set so that info returned on this object can be accessed from updatedUser variable */
        { new: true }
    )
        // Ensures password details are not sent back with response
        .select("-password")
        .exec()    
    res.json(updatedUser)    
}

const getAccountBalance = async (req, res) => {
    const user = await User.findById(req.auth._id).exec()
    try {
        const balance = await stripe.balance.retrieve({
            stripeAccount: user.stripe_account_id
        })        
        res.json(balance)
    } catch (err) {
        console.log(err)
    }
}

const payoutSetting = async (req, res) => {
    try {
        const user = await User.findById(req.auth._id).exec()

        const loginLink = await stripe.accounts.createLoginLink(
            user.stripe_seller.id,            
            { redirect_url: process.env.STRIPE_SETTING_REDIRECT_URL }            
        )        
        res.json(loginLink)
    } catch (err) {
        console.log("STRIPE PAYOUT SETTING ERR ", err)
    }
}

const stripeSessionId = async (req, res) => {
    // Get hotel id from req.body
    const { hotelId } = req.body

    // Find the hotel based on hotel id from db
    const item = await Hotel.findById(hotelId).populate("postedBy").exec()

    // 20% charge as application fee
    const fee = (item.price * 20) / 100

    // Create a session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],        
        // Success and cancel urls
        success_url: `${process.env.STRIPE_SUCCESS_URL}/${item._id}`,
        cancel_url: process.env.STRIPE_CANCEL_URL,
        // Purchasing item details that will be shown to user on checkout
        line_items: [
            {
                quantity: 1,
                price_data: {                    
                    currency: "gbp",
                    product_data: {
                        name: item.title                        
                    },
                    unit_amount: item.price * 100
                }    
            }
        ],
        mode: 'payment',        
        // Create payment intent with application fee and destination charge 80%
        payment_intent_data: {
            application_fee_amount: fee * 100,
            // this seller can see his balance in frontend dashboard
            transfer_data: {
                destination: item.postedBy.stripe_account_id
            },
        }       
    })
    // Add this session object to user in the db
    await User.findByIdAndUpdate(req.auth._id, { stripeSession: session }).exec()

    // Send session id as response to frontend
    res.send({
        sessionId: session.id
    })    
}

const stripeSuccess = async (req, res) => {
    try {
        // Get hotel id from req.body
        const { hotelId } = req.body
        // Find currently logged in user
        const user = await User.findById(req.auth._id).exec()
        // Check if user has stripeSession
        if (!user.stripeSession) return
        // Retrieve stripe session based on session id previously saved in user db
        const session = await stripe.checkout.sessions.retrieve(
            user.stripeSession.id
        )
        // If session payment status is paid, create order
        if (session.payment_status === "paid") {
            // Check if order with that session id already exists by querying orders collection
            const orderExist = await Order.findOne({
                "session.id": session.id,
            }).exec()
            if (orderExist) {
                // If order exists, send success true
                res.json({ success: true })
            } else {
                // Create new order and send success true
                let newOrder = await new Order({
                    hotel: hotelId,
                    session,
                    orderedBy: user._id
                }).save()
                // Remove user's stripeSession
                await User.findByIdAndUpdate(user._id, {
                    $set: { stripeSession: {} },
                })
                res.json({ success: true })
            }
        }
    } catch (err) {
        console.log("STRIPE SUCCESS ERR", err)
    }
}

export {
    createConnectAccount,
    getAccountStatus,
    getAccountBalance,
    payoutSetting,
    stripeSessionId,
    stripeSuccess
} 