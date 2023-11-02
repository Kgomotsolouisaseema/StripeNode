//loads dotenv module allowing to read env variables from .env . sets them in app env
require('dotenv').config()
//imports express framework
const express = require('express');
//import cors middleware enabling cros origin resource sharing 
const cors =require('cors');
//import stripe librabrays and initializes it with the strip secret key , creates strip obj with stripe API
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
//CREATES INSTANCE OF EXPRESS APP , "app" will be used to config your routes and start server
const app = express();
//This line sets the port number where your server will listen for incoming requests. In this case, it's set to 8000
const PORT = 8000;
//THIS LINE TELLS EXPRESS APP TO PARSE INCOMING REQUESTS WITH JSON PAULOADS, ENABLE SERVE TO UNDERSTAND JSON DATA SENT
app.use(express.json());
//This line applies the CORS middleware to your Express application, allowing it to accept requests from any origin
app.use(cors());
//DEFINES A POST METHOD AT ENDPOINT "/pay" . when serves recieves post, it executes codes inside
app.post('/pay', async (req, res) => {
    try {
        //This line extracts the name and amount properties from the request body sent by the client. The client will send this data when initiating a payment
        const {name, amount} = req.body;
        if(!name) return res.status(400).json({message: 'Please enter a name'});
        //This line creates a payment intent using the Stripe API. It includes the specified amount and sets the currency to ZAR (South African Rand). 
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'zar',
            automatic_payment_methods: {enabled: true},
        });
        //TAKES OUT CLIENT_SECRECT PROP FROM PAYMENT INTENT OBJECT BY THE STRIPE API.
        const clientSecret = paymentIntent.client_secret;
        //This line sends a JSON response back to the client. It contains a success message and the clientSecret needed on the client-side to confirm the payment.
        res.json({ message: 'Payment initiated', clientSecret })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error'})
    }
})
//testing 
app.get('/home', async (req, res) => {
    res.json({ message: 'Hello, this is a test API endpoint!' });
    
})
//This line starts the Express server, listening for incoming requests on the specified port (8080 in this case). When the server starts, it logs a message indicating that it's running.
app.listen(PORT, () => console.log(`Sever runnig on port ${PORT}`))