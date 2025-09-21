const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended:true }));

const connectDB = require('./config/db');
connectDB();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send("Pixisphere")
})

app.use('/api/auth', require('./routes/auth'));
app.use('/api/partner', require('./routes/partner'));
app.use('/api/admin', require('./routes/admin'));




// error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.status || 500;
    res.status(status).json({
        message: err.message || "Internal Server Error"
    })
})

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        message: "Not Found"
    })
})

app.listen(PORT, () => {
    console.log("server is running on port: " + PORT);
})
