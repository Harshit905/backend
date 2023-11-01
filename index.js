var cors=require("cors");
const express = require('express')
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())

const connectToMongo=require('./db');
connectToMongo();

app.use(express.json());

app.use("/api/auth",require('./routes/auth'))
app.use("/api/notes",require('./routes/notes'))
app.use("/api/blogs",require('./routes/blogs'))

app.listen(port, () => {
    console.log(`BlogCanvas backend listening on port ${port}`)
})
