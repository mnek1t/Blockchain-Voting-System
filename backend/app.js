const express = require('express');
require('dotenv').config()

var cors = require('cors');
var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 
}

const app = express();

app.use(cors(corsOptions))

app.use(express.json())
app.use('/api/auth', require("./routes/authRoute.js"));
console.log(process.env.PORT)

const PORT = process.env.PORT || 5100;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});