const express=require("express")
const firmController = require("../controllers/firmController")
const verifyToken=require('../middlewares/verifyToken')
const path=require('path')


const router=express.Router()
router.post('/add-firm',verifyToken,firmController.addFirm)

//for getting images
router.get('/uploads/:imageName',(req,res)=>{
    const imageName=req.params.imageName
    req.headersSent('Content-Type','image/jpeg')
    res.sendFile(path.join(__dirname ,'..','uploads',imageName))

})
router.delete("/delete/:firmId",firmController.deleteFirmById)
router.get('/areas',firmController.getAreas)

module.exports=router