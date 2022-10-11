import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, "Name is required"]
        },
        email: {
            type: String,
            trim: true,
            required: [true, "Email is required"],
            unique: true
        },
        password: {
            type: String,
            required: [true, "Please provide password"],
            minlength: 6,
            maxlength: 64
        },
        stripe_account_id: "",
        stripe_seller: {},
        stripeSession: {},
    },
    { timestamps: true }
)

/* This 'pre' middleware function will run each time a user is saved/created and/or password is modified/updated */
UserSchema.pre("save", function (next) {
    // 'this' refers to the current user
    let user = this
    // Hash password only if user is changing the password or registering for the first time
    if (user.isModified("password")) {
        return bcrypt.hash(user.password, 12, function (err, hash) {
            if (err) {
                console.log("BCRYPT HASH ERR ", err)
                return next(err)
            }
            user.password = hash
            return next()
        })
    } else {
        return next()
    }
})

UserSchema.methods.comparePassword = function (password, next) {
    bcrypt.compare(password, this.password, function (err, match) {
        if (err) {
            console.log("COMPARE PASSWORD ERR", err)
            return next(err, false)
        }
        // if no error, we get null        
        return next(null, match) // true
    })
}

export default mongoose.model("User", UserSchema)