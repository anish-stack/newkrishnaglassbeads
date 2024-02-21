const merchantid='PGTESTPAYUAT'
const apikey ='099eb0cd-02cf-4e2a-8aca-3e6c6aff0399'
const crypto =  require('crypto');
const axios = require('axios');
const user =require('../models/user.model')
const jwt = require('jsonwebtoken')
exports.newPayment = async (req, res) => {
    try {
        console.log(req.body)
        const userId = req.user ? req.user.id : null;
        const checkUserPresent = await user.findById(userId);

        if (!checkUserPresent) {
            return res.status(400).json({ success: false, message: "User ID not available" });
        }

        const { amount, Merchenat } = req.body;
        const merchantTransactionId = req.body.transactionId;
        const data = {
            merchantId: merchantid,
            merchantTransactionId: merchantTransactionId,
            merchantUserId: Merchenat,
            name: checkUserPresent.Name || "User",
            amount: amount * 100 || 1000    ,
            redirectUrl: `http://localhost:4000/api/v1/status/${merchantTransactionId}?token=${req.headers.authorization.split(" ")[1]}`,
            redirectMode: 'POST',
            mobileNumber: checkUserPresent.Number || "123456789",
            paymentInstrument: {
                type: 'PAY_PAGE'
            }
        };
        console.log(data)
        const payload = JSON.stringify(data);
        const payloadMain = Buffer.from(payload).toString('base64');
        const keyIndex = 1;
        const string = payloadMain + '/pg/v1/pay' + apikey;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + '###' + keyIndex;

        const prod_URL = " https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";
        const options = {
            method: 'POST',
            url: prod_URL,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum
            },
            data: {
                request: payloadMain
            }
        };

        const response = await axios.request(options);
        console.log(response.data);

        // Responding with success and the response data
        res.status(200).json({
            success: true,
            paydata: response.data // Assuming you want to send back the response from PhonePe API
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false
        });
    }
}
exports.checkStatus = async (req, res) => {
    // Extract token from URL query parameters
    // console.log("I am Hit By CheckStatus")

    const token = req.query.token;
    // console.log(token)
    // console.log(req.body)


    // Extract the merchantTransactionId from the request body
    const { transactionId: merchantTransactionId } = req.body;
    
    // Check if the merchantTransactionId is available
    if (!merchantTransactionId) {
        return res.status(400).json({ success: false, message: "Merchant transaction ID not provided" });
    }

    // Retrieve the merchant ID from the environment variables or constants
    const merchantId = merchantid;

    // Generate the checksum for authentication
    const keyIndex = 1;
    const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + apikey;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + "###" + keyIndex;
console.log(string)
    // Prepare the options for the HTTP request
    const options = {
        method: 'GET',
        url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`,
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': `${merchantId}`
        }
    };

    // Send the HTTP request to check the payment status
    axios.request(options)
        .then(async (response) => {
            // Check if the payment was successful
            if (response.data.success === true) {
              
                
                // Redirect the user to the success page
                const successRedirectUrl = `http://localhost:5173/Success/transaction_id=${merchantTransactionId}`;
                return res.redirect(successRedirectUrl);
            } else {
                // Redirect the user to the failed payment page
                const failedRedirectUrl = "http://localhost:5173/fail";
                return res.redirect(failedRedirectUrl);
            }
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        });
};