const express = require("express");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const vendorRoutes = require("./routes/vendorRoutes");
const bodyParser = require('body-parser');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const path = require("path");
const cors = require('cors');
require('./models/Order');  

const app = express();

// ✅ Correct CORS Configuration
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", ["http://localhost:5173", "http://localhost:5174"]);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, token");
    res.header("Access-Control-Allow-Credentials", "true"); 
    next();
});

const PORT = process.env.PORT || 4000;

dotEnv.config();

// ✅ Database Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Database connected successfully"))
.catch(err => console.error("❌ Database connection error:", err));

// ✅ Middleware for JSON parsing
app.use(express.json());
app.use(bodyParser.json());

// ✅ Static File Handling (Moved Above Routes)
app.use('/uploads', express.static('uploads'));

// ✅ Route Order
app.use('/vendor', vendorRoutes);
app.use("/user", userRoutes);
app.use('/firm', firmRoutes);
app.use('/product', productRoutes);
app.use('/order', orderRoutes);

// ✅ Root Route
app.use('/', (req, res) => {
    res.send('<h1>Welcome to Suby</h1>');
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`✅ Server started and running at port ${PORT}`);
});
