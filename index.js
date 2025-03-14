const express=require("express")
const dotEnv=require("dotenv")
const mongoose=require("mongoose")
const vendorRoutes=require("./routes/vendorRoutes")
const bodyParser=require('body-parser')
const firmRoutes=require('./routes/firmRoutes')
const productRoutes=require('./routes/productRoutes')
const userRoutes=require('./routes/userRoutes')
const orderRoutes=require('./routes/orderRoutes')
const path=require("path")
const cors=require('cors')
require('./models/Order');  // Import to ensure middleware runs

const app=express()
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // ✅ Allow cookies/auth headers
  })
);


const PORT=process.env.PORT||4000

dotEnv.config()

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDb Connected Sucessfully!!!"))
.catch((error)=>{console.log(error)})

app.use(bodyParser.json())

app.use('/vendor',vendorRoutes)
app.use("/user",userRoutes)
app.use('/firm',firmRoutes)
app.use('/product',productRoutes)
app.use('/order',orderRoutes)

app.use('/uploads',express.static('uploads'))


app.use('/',(req,res)=>{
    res.send('<h1> Welcome to Suby')

})
app.listen(PORT,()=>{
    console.log("Server started  and running at ",PORT)
})