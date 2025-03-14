const User=require("../models/User")
const jwt=require("jsonwebtoken")
const dotEnv=require("dotenv")
const bcrypt=require("bcryptjs")
const mongoose = require('mongoose');

dotEnv.config()
const secretKey=process.env.WhatIsYourName
const userRegister=async(req,res)=>{
    const {userName,email,password,phone,address}=req.body
    try{
        const userEmail=await  User.findOne({email})
        if(userEmail){
            return res.status(400).json({error:"Email already exists"})

        }

        const hashedPassword=await bcrypt.hash(password,10)

        const newUser=new User({
            userName,
            email,
            password:hashedPassword,
            phone,
            address,
           
        })
        await newUser.save()
        console.log("Registered sucessfully!!!")
        return res.status(201).json({message:"User registered Sucessfull!!!",userId:newUser._id})

    }
    catch(error){
        console.log(error)
        return res.status(500).json({error:"Internal Server Error"})
    }

}
const userLogin=async(req,res)=>{
    const {email,password}=req.body
    try {
        const user=await User.findOne({email})
        if(!user || !(await bcrypt.compare(password,user.password))){
            return res.status(401).json({error:"Invalid username or Password"}) 
        }
        const token=jwt.sign({userid:user.id},secretKey,{expiresIn:"1h"})
        if (user.cart) { 
            cartItems = user.cart || []; // If cart is embedded in the user model
        }
        res.status(200).json({
            message:"Login Successfull!!!!",
            token,
            userId:user._id,
            cart:cartItems
        })
        console.log(email,"This is Token:",token,"userId",user._id)
    } catch (error) {
        console.log("error")
        return res.status(500).json({error:"Internal server Errror!!"})
        
    }
}
const getAllUsers=async(req,res)=>{
    try {
        const users= await User.find()
        res.json({users})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:"Internal server Error"})
    }
}
const getUserById=async(req,res)=>{
    const userId=req.params.id
    try {
        const user=await User.findById(userId)
        if(!user){
            return res.status(404).json({error:"User not found"})
        }
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:"Internal server error"})
    }
}


// const addToCart = async (req, res) => {
//     try {
//         const { userId, productId, quantity } = req.body;

//         if (!userId || !productId || quantity <= 0) {
//             return res.status(400).json({ error: "Invalid request data" });
//         }

//         // Find user by ID
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ error: "User not found" });
//         }

//         // Check if the product already exists in the cart
//         const existingItem = user.cart.find((item) => 
//             item.product.toString() === productId
//         );

//         if (existingItem) {
//             // Update quantity if product already exists in cart
//             existingItem.quantity += quantity;
//         } else {
//             // Add new product to cart
//             user.cart.push({ product: new mongoose.Types.ObjectId(productId), quantity });
//         }

//         await user.save();

//         return res.status(200).json({
//             message: "Product added to cart successfully!",
//             cart: user.cart
//         });

//     } catch (error) {
//         console.error("Error adding product to cart:", error);
//         return res.status(500).json({ error: "Internal server error" });
//     }
// };
const addToCart = async (req, res) => {
    try {
        let { userId, product, quantity } = req.body;

        quantity = Number(quantity);
        if (!userId || !product || quantity <= 0 || isNaN(quantity)) {
            return res.status(400).json({ error: "Invalid request data" });
        }

        if (!mongoose.Types.ObjectId.isValid(product)) {
            return res.status(400).json({ error: "Invalid product ID format" });
        }

        const productObjectId = new mongoose.Types.ObjectId(product);

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const existingItem = user.cart.find(
            item => item.product.toString() === product
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            user.cart.push({ product: productObjectId, quantity });
        }

        await user.save();

        return res.status(200).json({
            message: "Product added to cart successfully!",
            cart: user.cart
        });

    } catch (error) {
        console.error("Error adding product to cart:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const removeFromCart=async(req,res)=>{
    const { userId } = req.params;   // User ID from URL params
    const { productId } = req.body; 
    try {
        const user =await User.findById(userId)
        if(!user){
            return res.status(404).json({message:"User not Found!!"})
        }
        const updatedCart =user.cart.filter((item)=>item.product.toString()!==productId)
        user.cart=updatedCart
        await user.save()
        res.status(200).json({
            message:"Item removed sucessfully from Cart!! ",
            cart:user.cart

        })
    } catch (error) {
        console.log("Error removing item form cart:",error)
        return res.status(500).json({message:"Server error while removing item"})
        
    }
}

const clearCart = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Clear cart
        user.cart = [];
        await user.save();

        res.status(200).json({
            message: "Cart cleared successfully",
            cart: []
        });
    } catch (error) {
        console.error("Error clearing cart:", error);
        res.status(500).json({ message: "Failed to clear cart" });
    }
};



module.exports={userRegister,userLogin,getAllUsers,addToCart,getUserById,removeFromCart,clearCart}




// const User = require("../models/User");
// const Product = require("../models/Product");

// const addToCart = async (req, res) => {
//   try {
//     const { userId, productId, quantity } = req.body;

//     // Validate input
//     if (!userId || !productId || quantity <= 0) {
//       return res.status(400).json({ error: "Invalid request data" });
//     }

//     // Check if user exists
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Check if product exists
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     // Check if product is already in the cart
//     const existingItem = user.cart.find((item) => item.product.toString() === productId);

//     if (existingItem) {
//       // Update quantity if product already exists in cart
//       existingItem.quantity += quantity;
//     } else {
//       // Add new product to cart
//       user.cart.push({ product: productId, quantity });
//     }

//     // Save updated cart
//     await user.save();
//     return res.status(200).json({ message: "Product added to cart", cart: user.cart });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// module.exports = { addToCart };
