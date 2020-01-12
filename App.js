const express = require('express');

const app = express();

const mongoose = require("mongoose");
const productRoute = require('./routes/Products');
const authRoute = require('./routes/auth');
const productModel = require('./models/products');
const bodyParser = require('body-parser');



app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))

require('dotenv/config');

const middle = (req, res) => {
    console.log("Middle");
}

app.use('/api/products', productRoute)
app.use('/api/user', authRoute)

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
