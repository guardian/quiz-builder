
/**
 * Routes
 * To add a route, require the controller and map the
 * routes within the function below
 */
var application = require('../app/controllers/application');


module.exports = function (app, passport, env) {
    // user routes
    app.get("/", application.index);
    app.get("/_healthcheck", application.healthcheck);
    app.get("/quizzes.json", application.listQuizzes);
    app.get("/quizzes/:id.json", application.getQuiz);

    app.post("/quizzes.json", application.createQuiz);
    app.post("/quizzes/:id.json", application.updateQuiz);

    app.delete("/quizzes/:id", application.deleteQuiz);



    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
};
