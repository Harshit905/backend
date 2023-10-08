
var cors=require("cors");
const express = require('express')
const app = express()
const port = 5000

app.use(cors())

const connectToMongo=require('./db');
connectToMongo();

app.use(express.json());

app.use("/api/auth",require('./routes/auth'))
app.use("/api/notes",require('./routes/notes'))

app.listen(port, () => {
    console.log(`i-notebook backend listening on port ${port}`)
})
