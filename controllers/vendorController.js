const Vendor = require("../models/Vendor");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotEnv=require('dotenv')

dotEnv.config()

const secretKey=process.env.WhatIsYourName

const vendorRegister = async (req, res) => {
    const { username, email, password,firmId} = req.body;

    try {
        const vendorEmail = await Vendor.findOne({ email });
        if (vendorEmail) {
            return res.status(400).json({ error: "Email already taken" }); 
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newVendor = new Vendor({
            username,
            email,
            password: hashedPassword,
            firm: undefined 
        });

        await newVendor.save();
        
        console.log("Registered");
        return res.status(201).json({ message: "Vendor Registered Successfully", vendorId: newVendor._id,
            firmId: newVendor.firm  }); 
        

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
const vendorLogin=async(req,res)=>{
    const {email,password}=req.body
    try{
        const vendor=await Vendor.findOne({email})
        if(!vendor || !(await bcrypt.compare(password,vendor.password))){
            return res.status(401).json({error:"Invalid username or password"})
        }
        const token=jwt.sign({vendorId:vendor.id},secretKey,{expiresIn:"1h"})


        res.status(200).json({  
            message: "Login successful",
            token,
            vendorId: vendor._id
        })
        console.log(email,"This is token:",token, "vendorId:",vendor._id)

    
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
const getAllVendors=async(req,res)=>{
    try {
        const vendors=await Vendor.find().populate('firm')
        res.json({vendors})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
const getVendorById=async(req,res)=>{
    const vendorId=req.params.id
    try {
         const vendor=await Vendor.findById(vendorId).populate("firm")
         if(!vendor){
            return res.status(404).json({error:"vendor not found"})
         }
         res.status(200).json(vendor)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports={vendorRegister,vendorLogin,getAllVendors,getVendorById}
