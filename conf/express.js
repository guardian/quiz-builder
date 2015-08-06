
/**
 * Module dependencies.
 */
var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');


/**
 * Expose
 */

module.exports = function (app, env) {

    var Q = require('q'),
        appConfig = require('./appConfig').getConfig(env);

    // Panda configuration
    var PanDomainNode = new require('pan-domain-node')(appConfig.domain);
    PanDomainNode.setLogLevel('info');
    var pandaAuthMiddleware = PanDomainNode.Middleware;


    // view engine setup
    app.set('views', path.join(__dirname, '../app/views'));
    app.set('view engine', 'ejs');

    // uncomment after placing your favicon in /public
    //app.use(favicon(__dirname + '/public/favicon.ico'));
    app.use(logger('dev'));
    app.use(bodyParser.json());;
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(require('less-middleware')(path.join(__dirname, '/public')));
    app.use(express.static(path.join(__dirname, '/public')));

    var httpToHttpsRedirectOnProd = function(req, res, next) {
        if(req.headers['X-Forwarded-Proto'] && req.headers['X-Forwarded-Proto'] !== 'https') {
            res.redirect('https://' + req.get('Host') + req.url);
        } else {
            next();
        }
    };

    // Use panda auth for all routes except healthcheck
    app.use(/\/((?!healthcheck).)*/, httpToHttpsRedirectOnProd, pandaAuthMiddleware);

    // Panda Auth no user error handler
    var PANDA_AUTH_ERROR_MESSAGE = PanDomainNode.PandaAuthFailedErrorMessage;
    app.use(function(err, req, res, next) {
        if (err === PANDA_AUTH_ERROR_MESSAGE) {
            // redirect to sign in
            res.status(401).render('signin', {
                title: "Access Denied"
            });
        } else {
            next(err);
        };
    });

};
