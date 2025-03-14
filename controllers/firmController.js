// const Firm = require("../models/Firm");
// const Vendor=require("../models/Vendor")
// const multer=require("multer")
// const path=require('path')

// const storage=multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null,'uploads/')
//     },
//     filename:function(req,file,cb){
//         cb(null,Date.now()+ path.extname(file.originalname))
//     }
// })
// const upload=multer({storage:storage})


// const addFirm=async(req,res)=>{
//     try{
//         const {firmName,area,category,region,offer}=req.body
//         console.log(req.body);
//         const image=req.file ?req.file.filename:undefined

//         const vendor=await Vendor.findById(req.vendorId)
//         if(!vendor){
//             return res.status(404).json({message:"vendor not found"})
//         }
        
//         const firm=new Firm({
//             firmName,area,category,region,offer,image,vendor:vendor._id
//         })
//         const savedFirm =await firm.save()
//         vendor.firm.push(savedFirm)
//         await vendor.save()
//         return res.status(200).json({message:"firm added sucessfully", imageUrl: `/uploads/${req.file}`,firm:savedFirm})
    
//     }
//     catch(error){
//         console.log(error)
//         res.status(500).json("Internal server error")
//     }
// }
// const deleteFirmById=async(req,res)=>{
//     try {
//         const firmId=req.params.firmId
//         const deleteFirm=await Firm.findByIdAndDelete(firmId)
//         if(!deleteFirm){
//             return res.status(404).json({error:"Firm not found"})
//         }
//     } catch (error) {
//         console.log(error)
//         res.status(500).json("Internal server error")
//     }
// }

// module.exports={addFirm:[upload.single('image'),addFirm],deleteFirmById}

const mongoose = require("mongoose")
const Firm = require("../models/Firm");
const Vendor = require("../models/Vendor");
const multer = require("multer");
const path = require("path");

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads/"); // Ensure this folder exists
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const addFirm = async (req, res) => {
    try {
        const { firmName, area, offer, category, region, vendorId } = req.body; 
        
        console.log("Received vendorId:", vendorId); // Debugging log

        // Validate vendorId
        if (!mongoose.Types.ObjectId.isValid(vendorId)) {
            return res.status(400).json({ message: "Invalid vendorId" });
        }

        // Find vendor by ID
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        // Ensure the vendor does not already have a firm
        if (vendor.firm) {
            return res.status(400).json({ message: "Vendor already has a firm" });
        }

        // Extract filename from uploaded file
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        // Create new firm entry
        const firm = new Firm({
            firmName,
            area,
            category: Array.isArray(category) ? category : [],
            region: Array.isArray(region) ? region : [],
            offer,
            image,
            vendor: vendorId
        });

        const savedFirm = await firm.save();

        // Link the firm to the vendor
        vendor.firm = savedFirm._id;
        await vendor.save();

        return res.status(201).json({
            message: "Firm added successfully",
            imageUrl: firm.image, 
            firm: savedFirm,
            firmId: savedFirm._id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Delete Firm API
const deleteFirmById = async (req, res) => {
    try {
        const firmId = req.params.firmId;
        const deleteFirm = await Firm.findByIdAndDelete(firmId);
        if (!deleteFirm) {
            return res.status(404).json({ error: "Firm not found" });
        }
        res.status(200).json({ message: "Firm deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
const getAreas = async (req, res) => {
    try {
        // Fetch unique city names from the Firm collection
        const cities = await Firm.distinct("area");

        res.status(200).json(cities);
    } catch (error) {
        console.error("Error fetching cities:", error);
        res.status(500).json({ message: "Failed to fetch city data." });
    }
};



// Export with multer middleware for image upload
module.exports = { addFirm: [upload.single("image"), addFirm], deleteFirmById,getAreas };
