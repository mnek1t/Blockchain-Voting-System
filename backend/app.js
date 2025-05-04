const express = require('express');
require('dotenv').config()
const cookieParser = require('cookie-parser');
var cors = require('cors');
var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true
}

const app = express();

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser());
app.use('/api/auth', require("./routes/authRoute.js"));
app.use('/api/election', require("./routes/electionRoute.js"));
console.log(process.env.PORT)

const PORT = process.env.PORT || 5100;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});