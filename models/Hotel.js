import mongoose from 'mongoose'

const HotelSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: "Title is required"
        },
        content: {
            type: String,
            required: "Content is required",
            maxlength: 10000
        },
        location: {
            type: String,
        },
        price: {
            type: Number,
            required: "Price is required",
            trim: true
        },
        postedBy: {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        },
        image: {
            data: Buffer,
            contentType: String
        },
        from: {
            type: Date,
            required: "From date is required"
        },
        to: {
            type: Date,
            required: "To date is required"
        },
        bed: {
            type: Number
        }        
    },
    { timestamps: true }
)

export default mongoose.model("Hotel", HotelSchema)