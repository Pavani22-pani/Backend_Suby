const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true

    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true

    },
    cart: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
                default: 1
            }
        }
    ],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }] 
}, { timestamps: true })


const User = mongoose.model("User", userSchema)
module.exports = User