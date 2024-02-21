const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const cookieParser = require("cookie-parser")
const cors = require("cors")
const ConnectDB = require('./config/Database')
const userRoutes = require('./routes/routes')
const Paymentrouter = require('./routes/PaymentRoutes')

//configuration

ConnectDB()

// middlewares
app.use(cors())

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

//routes
app.get('/', (req, res) => {
    res.send("Hello I Am New Krishna Glass beads")
})

app.use('/api/v1',userRoutes)
app.use('/api/v2',Paymentrouter)


// addpackage

//Listen App
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on ${process.env.PORT}`)
})