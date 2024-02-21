const express = require('express')
const authenticateUser = require('../middleware/authmiddleware')
const { newPayment, checkStatus } = require('../controllers/PaymentController')
const Paymentrouter  =express.Router()


Paymentrouter.post('/payment-create',authenticateUser,newPayment)
Paymentrouter.get('/status/:merchantTransactionId',checkStatus)


module.exports=Paymentrouter


