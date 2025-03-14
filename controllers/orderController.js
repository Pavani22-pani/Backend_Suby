const Order=require("../models/Order")
const Product =require("../models/Product")
const User=require("../models/User")
const mongoose = require("mongoose");



const createOrder=async(req,res)=>{
    try {
        const {items,paymentMethod,deliveryAddress}=req.body

        if(!items ||items.length==0){
            return res.status.json({error:"Order must contain atleast one item."})
        }
        const userId=req.params.userId
        const user=await User.findById(userId)
        if(!user){
            return res.status(404).json({error:"No User Found"})
        }


        let totalPrice=0
        let firms =new Set()
        const validatedItems=[]
        for(let item of items){
            const product=await Product.findById(item.product).populate("firm")
            if(!product) return res.status(404).json({error: `Product with ID ${item.product} not found`})
            
            firms.add(product.firm._id)
            totalPrice+=product.price*item.quantity
            validatedItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price,
            });
        }
        const newOrder=new Order({
            user:user._id,
            firms:Array.from(firms),
            items:validatedItems,
            totalPrice,
            paymentMethod,
            deliveryAddress
        })
       
        const savedOrder= await newOrder.save()
        user.orders.push(savedOrder)
        await user.save()
        res.status(201).json({message:"order placed successfully!!"})
    } catch (error) {
        console.log("Error creating order",error)
        res.status(500).json({error:"Internal server error"})
    }
}
const getOrderByUser=async(req,res)=>{
    try {
        const {userId}=req.params
        if(!userId || !mongoose.Types.ObjectId.isValid(userId)){
            return res.status(400).json({error:"Invalid or missing userId"})

        }
        const user=await User.findById(userId)
        if(!user){
            return res.status(404).json({error:"No user Found!!"})
        }
        const userName=user.userName
        const orders=await Order.find({user:userId})
        res.status(200).json({userName,orders})
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Internal Server Error"})
    }
}
const getRecentOrder = async (req, res) => {
    const { userId } = req.params;
    try {
        const recentOrder = await Order.findOne({ user: userId }).sort({ createdAt: -1 }).exec();

        if (!recentOrder) {
            return res.status(404).json({ message: "No recent orders found." });
        }

        const formattedOrder = {
            ...recentOrder.toObject(),
            orderDate: new Date(recentOrder.createdAt).toLocaleDateString(),
            orderTime: new Date(recentOrder.createdAt).toLocaleTimeString(),
        };

        res.status(200).json(formattedOrder);
    } catch (error) {
        console.error("Error fetching recent order:", error);
        res.status(500).json({ message: "Internal server error." });  // ✅ Ensure proper JSON response
    }
};
const deleteById=async(req,res)=>{
    const { orderId } = req.params;

    try {
        // Step 1: Find the order to get the userId
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const userId = order.user; // Extract userId from order

        // Step 2: Delete the order from the `Order` collection
        await Order.findByIdAndDelete(orderId);

        // Step 3: Remove order reference from the `User` collection
        await User.findByIdAndUpdate(userId, {
            $pull: { orders: orderId }  // ✅ Removes the deleted order reference
        });

        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}
module.exports={createOrder,getOrderByUser,getRecentOrder,deleteById}
