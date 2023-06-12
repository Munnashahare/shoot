const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/db');

// connect to database
mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });

// on connection
mongoose.connection.on('connected', () => {
  console.log('connected to database ' + config.database);
})

// on error
mongoose.connection.on('error', (err) => {
  console.log('database connection error ' + err);
})

var index = require('./routes/index');
var admin = require('./routes/admin');
var merchant = require('./routes/merchant');
var user = require('./routes/user');
var service_category = require('./routes/service_category');
var service_subcategory = require('./routes/service_subcategory');
var service_primecategory = require('./routes/service_primecategory');
var service = require('./routes/service');
var city = require('./routes/city');
var support = require('./routes/support');
var booking = require('./routes/booking');
var subscription = require('./routes/subscription');
var unavailable_date = require('./routes/unavailable_date');
var offer = require('./routes/offer');
var product = require('./routes/product');
var product_size = require('./routes/product_size');
var banner=require('./routes/banner');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json({limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
app.use(cookieParser());


// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

// Add headers
app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
  
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,enctype,Authorization');
  
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
  
    // Pass to next layer of middleware
    next();  
  });
  

// Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

require('./config/passport')(passport);


app.use('/admin', admin);
app.use('/merchant', merchant);
app.use('/user', user);
app.use('/service_category', service_category);
app.use('/service_subcategory', service_subcategory);
app.use('/service_primecategory', service_primecategory);
app.use('/service', service);
app.use('/city', city);
app.use('/support', support);
app.use('/booking', booking);
app.use('/subscription', subscription);
app.use('/unavailable_date', unavailable_date);
app.use('/offer', offer);
app.use('/product', product);
app.use('/product_size', product_size);
app.use('/', index);
app.use('/banner',banner);

// Set Port
app.set('port', (process.env.PORT || 7001));
  
app.listen(app.get('port'), function(){
    console.log('Server started on port '+app.get('port'));
});

