const mongoose=require("mongoose")

const OrderSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    firms:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Firm"
        }
    ],
    items:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product",
                required:true
            },
            quantity:{
                type:Number,
                required:true,
                min:1

            }
        }
    ],
    totalPrice:{
        type:Number,
        required:true
    },
    paymentMethod:{
        type:String,
        enum:["COD","UPI","Card","Wallet"],
        required:true
    },
    paymentStatus:{
        type:String,
        enum:["Pending","Paid","Failed"],
        default:"Pending"
    },
    orderStatus:{
        type:String,
        enum:["Pending","Confirmed","Preparing","Out for Delivery","Deliverd","Cancelled"],
        default:"Pending"
    },
    deliveryAddress:{
        street:{type:String,required:true},
        city:{type:String,required:true},
        state:{type:String,required:true},
        zipcode:{type:String,required:true},
    },
    estimatedDeliveryTime:{type:Date},
    deliveredAt:{type:Date}
},{timestamps:true})

OrderSchema.pre('findOneAndDelete', async function (next) {
    const deletedOrder = await this.model.findOne(this.getFilter());

    if (deletedOrder) {
        await User.findByIdAndUpdate(deletedOrder.user, {
            $pull: { orders: deletedOrder._id }  // ✅ Auto-clean user orders array
        });
    }

    next();
});

const Order=mongoose.model("Order",OrderSchema)

module.exports=Order








// const Order = require("../models/Order");
// const User = require("../models/User");
// const Product = require("../models/Product");

// // ✅ Create a New Order
// const createOrder = async (req, res) => {
//     try {
//         const { user, restaurant, items, paymentMethod, deliveryAddress } = req.body;

//         // Validate Items
//         if (!items || items.length === 0) {
//             return res.status(400).json({ error: "Order must contain at least one item." });
//         }

//         // Calculate Total Price
//         let totalPrice = 0;
//         for (let item of items) {
//             const product = await Product.findById(item.product);
//             if (!product) return res.status(404).json({ error: `Product not found: ${item.product}` });
//             totalPrice += product.price * item.quantity;
//         }

//         // Create Order
//         const newOrder = new Order({
//             user,
//             restaurant,
//             items,
//             totalPrice,
//             paymentMethod,
//             deliveryAddress
//         });

//         await newOrder.save();
//         res.status(201).json({ message: "Order placed successfully", order: newOrder });

//     } catch (error) {
//         console.error("Error creating order:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

// // ✅ Get Orders for a Specific User
// const getUserOrders = async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const orders = await Order.find({ user: userId }).populate("items.product", "name price").sort({ createdAt: -1 });

//         if (!orders.length) {
//             return res.status(404).json({ error: "No orders found for this user." });
//         }

//         res.status(200).json(orders);
//     } catch (error) {
//         console.error("Error fetching user orders:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

// // ✅ Get All Orders (Admin View)
// const getAllOrders = async (req, res) => {
//     try {
//         const orders = await Order.find()
//             .populate("user", "name email")
//             .populate("items.product", "name price")
//             .sort({ createdAt: -1 });

//         res.status(200).json(orders);
//     } catch (error) {
//         console.error("Error fetching all orders:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

// // ✅ Update Order Status (Admin or Delivery)
// const updateOrderStatus = async (req, res) => {
//     try {
//         const { orderId } = req.params;
//         const { orderStatus } = req.body;

//         const order = await Order.findById(orderId);
//         if (!order) return res.status(404).json({ error: "Order not found." });

//         // Check if order is already delivered
//         if (order.orderStatus === "Delivered") {
//             return res.status(400).json({ error: "Cannot update a delivered order." });
//         }

//         order.orderStatus = orderStatus;
//         if (orderStatus === "Delivered") {
//             order.deliveredAt = new Date();
//         }

//         await order.save();
//         res.status(200).json({ message: "Order status updated successfully.", order });
//     } catch (error) {
//         console.error("Error updating order status:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

// // ✅ Cancel Order (User)
// const cancelOrder = async (req, res) => {
//     try {
//         const { orderId } = req.params;
//         const order = await Order.findById(orderId);
//         if (!order) return res.status(404).json({ error: "Order not found." });

//         // Only allow cancellation if order is not delivered
//         if (["Delivered", "Cancelled"].includes(order.orderStatus)) {
//             return res.status(400).json({ error: "Cannot cancel this order." });
//         }

//         order.orderStatus = "Cancelled";
//         await order.save();
//         res.status(200).json({ message: "Order cancelled successfully.", order });
//     } catch (error) {
//         console.error("Error cancelling order:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

// // ✅ Update Payment Status
// const updatePaymentStatus = async (req, res) => {
//     try {
//         const { orderId } = req.params;
//         const { paymentStatus } = req.body;

//         const order = await Order.findById(orderId);
//         if (!order) return res.status(404).json({ error: "Order not found." });

//         order.paymentStatus = paymentStatus;
//         await order.save();
//         res.status(200).json({ message: "Payment status updated successfully.", order });
//     } catch (error) {
//         console.error("Error updating payment status:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

// module.exports = {
//     createOrder,
//     getUserOrders,
//     getAllOrders,
//     updateOrderStatus,
//     cancelOrder,
//     updatePaymentStatus
// };
