const mongoose=require("mongoose")
const productSchema=new mongoose.Schema({
    productName:{
        type:String,
        required:true

    },
    price:{
        type:String,
        required:true,

    },
    category:{
        type:[
            {
                type:String,
                enum:['veg',"non-veg","drink","cake"]
            }
        ]
    },
    image:{
        type:String
    },
    bestSeller:{
        type:Boolean
    },
    description:{
        type:String
    },
    firm:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Firm"
        }
    ]


})

const Product=mongoose.model('Product',productSchema)
module.exports=Product





// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema({
//     user: { 
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: "User", 
//         required: true 
//     },
//     restaurant: { 
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: "Restaurant", 
//         required: true 
//     },
//     items: [
//         {
//             product: { 
//                 type: mongoose.Schema.Types.ObjectId, 
//                 ref: "Product", 
//                 required: true 
//             },
//             quantity: { 
//                 type: Number, 
//                 required: true, 
//                 min: 1 
//             },
//             price: { 
//                 type: Number, 
//                 required: true 
//             }
//         }
//     ],
//     totalPrice: { 
//         type: Number, 
//         required: true 
//     },
//     paymentMethod: {
//         type: String,
//         enum: ["COD", "UPI", "Card", "Wallet"],
//         required: true
//     },
//     paymentStatus: {
//         type: String,
//         enum: ["Pending", "Paid", "Failed"],
//         default: "Pending"
//     },
//     orderStatus: {
//         type: String,
//         enum: ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"],
//         default: "Pending"
//     },
//     deliveryAddress: {
//         street: { type: String, required: true },
//         city: { type: String, required: true },
//         state: { type: String, required: true },
//         zipCode: { type: String, required: true },
//         country: { type: String, required: true }
//     },
//     estimatedDeliveryTime: { type: Date },
//     deliveredAt: { type: Date },
// }, { timestamps: true });

// const Order = mongoose.model("Order", orderSchema);
// module.exports = Order;
