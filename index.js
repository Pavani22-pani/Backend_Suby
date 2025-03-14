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
require('./models/Order');  // Import to ensure middleware runs

const app = express();
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

// ✅ Correct CORS Configuration (Dynamic Origin Setup)
app.use((req, res, next) => {
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin); // ✅ Dynamic Origin
    }

    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, token");
    res.setHeader("Access-Control-Allow-Credentials", "true"); // ✅ Important for cookies/auth headers

    // ✅ Handle OPTIONS preflight request
    if (req.method === "OPTIONS") {
        return res.sendStatus(200); // Stops OPTIONS requests from proceeding further
    }

    next();
});

// ✅ Load Environment Variables
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

// ✅ Static File Handling
app.use('/uploads', express.static('uploads'));

// ✅ Route Definitions
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
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`✅ Server started and running at port ${PORT}`);
});
