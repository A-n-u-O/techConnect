// this file helps connect everything server with database
const Pool = require('pg').Pool //what allows us to configure our connection
//pool allows us run queries with postgres
const pool = new Pool({
    user: "postgres",
    password: "Postgres123",
    host: "localhost",
    port: 5432,
    database:"blogplatform"
});

module.exports = pool;//to manipulate data inside the routes e.g updating, inputing, deleting

