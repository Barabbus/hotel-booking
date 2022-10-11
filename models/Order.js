import mongoose from 'mongoose'
const { ObjectId } = mongoose.Schema

const OrderSchema = new mongoose.Schema(
    {
        hotel: {
            type: ObjectId,
            ref: "Hotel"
        },
        session: {},
        orderedBy: {
            type: ObjectId,
            ref: "User"
        }        
    },
    { timestamps: true }
)

export default mongoose.model("Order", OrderSchema)