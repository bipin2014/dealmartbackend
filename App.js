const express = require('express');

const app = express();

const mongoose = require("mongoose");
const productRoute = require('./routes/Products');
const authRoute = require('./routes/auth');
const cartRoute=require('./routes/CartRoute');
const paymentRoute=require('./routes/PaymentRoute');
const orderRoute=require('./routes/OrderRoute');

const productModel = require('./models/products');
const bodyParser = require('body-parser');
const bSellerRoute=require('./routes/bSellerAction');
const referalRoute=require('./routes/referalRoute');



app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))

require('dotenv/config');

const middle = (req, res) => {
    console.log("Middle");
}

app.use('/api/products', productRoute)
app.use('/api/user', authRoute)
app.use('/api/cart', cartRoute)
app.use('/api/payment', paymentRoute)
app.use('/api/order', orderRoute)
app.use('/api/bSeller', bSellerRoute)
app.use('/api/referal', referalRoute)

app.use('/uploads',express.static('uploads'));

//Connect to DB
mongoose.connect(process.env.DB_CONNECTION,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    },
    () => console.log("Coonected to DB")
);



app.listen(5000);
