const express=require("express")
const userController=require("../controllers/userController")

const router=express.Router()

router.post("/register",userController.userRegister)
router.post("/login",userController.userLogin)
router.get("/all-users",userController.getAllUsers)
router.get("/single-user/:id",userController.getUserById)
router.post("/cart-add",userController.addToCart)
router.delete("/cart/remove/:userId", userController.removeFromCart);
router.delete("/cart/clear/:userId",userController.clearCart)

module.exports=router