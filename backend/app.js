const express = require('express');
require('dotenv').config()
const db = require('./database/connection.js')
const app = express();

app.use(express.json())
app.use('/api/auth', require("./routes/authRoute.js"));
console.log(process.env.PORT)

const PORT = process.env.PORT || 5100;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});