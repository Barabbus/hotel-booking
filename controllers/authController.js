import User from '../models/User.js'
import jwt from 'jsonwebtoken'

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body

        // Validation
        if (!name) return res.status(400).send("Name is required")
        if (!email) return res.status(400).send("Email is required")
        if (!password || password.length < 6)
            return res
                .status(400)
                .send("Password is required and should be at least 6 characters in length")
        let userExist = await User.findOne({ email }).exec()
        if (userExist) return res.status(400).send("This email has already been taken")

        // Register user
        const user = new User(req.body)

        await user.save()        
        return res.json({ ok: true })
    } catch (err) {
        console.log("CREATE USER FAILED", err)
        return res.status(400).send("Error: Try again.")
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        // check if user with that email exists
        let user = await User.findOne({ email }).exec()
        if (!user) return res.status(400).send("User with that email not found")
        // compare user password with db password
        user.comparePassword(password, (err, match) => {            
            if (!match || err) return res.status(400).send("Wrong password")
            // Generate a token then send a response to the client
            let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
            res.json({
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    stripe_account_id: user.stripe_account_id,
                    stripe_seller: user.stripe_seller,
                    stripeSession: user.stripeSession
                }
            })
        })
    } catch (err) {
        console.log("LOGIN ERROR", err)
        res.status(400).send("Login failed")
    }
}

export { register, login }