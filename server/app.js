var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var Goods = require('./routes/goods');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'views')));

app.use((req,res,next)=>{
	if(req.cookies.userId){
		// console.log(req);
		next();
	}else{
		if(req.originalUrl.indexOf('/goodss/list')>-1 || req.originalUrl=='/users/login' ||req.originalUrl=='/users/loginout' || req.originalUrl=='/users/checkLogin'){
			// console.log(req.path);
			next();
		}else{
			res.json({
				status:'10001',
				msg:'拦截登录',
				result:'stop login'
			});
		}
	}
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goodss',Goods);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
