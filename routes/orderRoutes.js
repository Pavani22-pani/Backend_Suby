const orderController =require("../controllers/orderController")
const express= require("express")

const router=express.Router()

router.post("/createOrder/:userId",orderController.createOrder)
router.get("/getorder/:userId",orderController.getOrderByUser)
router.get('/recent-order/:userId', orderController.getRecentOrder);
router.delete("/delete/:orderId",orderController.deleteById)


module.exports=router