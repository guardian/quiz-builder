var fs = require('fs');
var join = require('path').join;
var express = require('express');
//var config = require('config');

var app = express();
var port = process.env.PORT || 9098;
var env = process.env.NODE_ENV || 'development';

// load the models
fs.readdirSync(join(__dirname, 'app/models')).forEach(function (file) {
  if (~file.indexOf('.js')) require(join(__dirname, 'app/models', file));
});



// load the express config
require('./conf/express')(app, env);

// load the express routes
require('./conf/routes')(app, env);

app.listen(port);
console.log('Express app started on port ' + port);

module.exports = app;
