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

// ✅ Correct CORS Configuration (Only Once)
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'] // ✅ Important for POST/PUT requests
}));

const PORT = process.env.PORT || 4000;

dotEnv.config();

// ✅ Correct Database Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Database connected successfully"))
.catch(err => console.error("❌ Database connection error:", err));

// ✅ Middleware for JSON parsing
app.use(express.json());
app.use(bodyParser.json());

// ✅ Correct Route Order
app.use('/vendor', vendorRoutes);
app.use("/user", userRoutes);
app.use('/firm', firmRoutes);
app.use('/product', productRoutes);
app.use('/order', orderRoutes);

app.use('/uploads', express.static('uploads'));

// ✅ Root Route
app.use('/', (req, res) => {
    res.send('<h1>Welcome to Suby</h1>');
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`✅ Server started and running at port ${PORT}`);
});
