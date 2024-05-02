
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const database = require('./libs/mongoose');
const env = require("./config/env");
const app = express();
const cors = require("cors");  
const compression = require('compression');


app.use(compression({
  threshold: 0
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());


app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(env.serverBasePath, express.static(path.join(__dirname, 'public')));

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.use(env.API.web, compression({ level: 9 }), routes.webRoutes);




app.use("/", function (req, res, next) { 
  res.send('<html><head><title>AND Naturals</title></head><body><h1>Welcome to AND Naturals</h1></body></html>');
});





// catch 404 and forward to error handler
app.use(function (req, res, next) {
 
  if (process.env.NODE_ENV == 'production') {
    if (createError(404, 'Requested data not found')) {
      res.send('<html><head><title>Not Found</title></head><body><h1>Requested data not found</h1></body></html>');
    }
  } else {
    next(createError(404));
  }

});

database.connect();

module.exports = app;