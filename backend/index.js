const connectToMongo = require("./db");
const express = require('express')
var cors = require('cors')

connectToMongo()
const app = express()
const port = 4000

app.use(cors())

app.use(express.json());

app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/students', require('./routes/students'));
app.use('/api/bookings', require('./routes/bookings'));

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})
