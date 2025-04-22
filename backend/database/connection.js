require('dotenv').config()

const { Pool } = require('pg');
console.log(process.env.POSTGRES_USERNAME)
console.log(process.env.POSTGRES_HOST)
console.log(process.env.POSTGRES_PORT)
console.log(process.env.POSTGRES_DATABASE)
console.log(process.env.POSTGRES_PASSWORD)
const pool = new Pool({
    user: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT ? Number(process.env.POSTGRES_PORT) : 5432,
    database: process.env.POSTGRES_DATABASE
})

pool.connect()
    .then(() => {
        console.log("Postgres Connected");
    })
    .catch(err => console.log(err))

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
}