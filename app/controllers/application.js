const dynamo = require('../util/dynamo');

function errorHandler(err) {
    // TODO: Do something more creative with the errors
    console.log("error occurred: ", err);
    throw err;
}

exports.index = (req, res) => {
    res.render("index", {
        user: {
            email: req.guUser.email,
            name: req.guUser.firstName + " " + req.guUser.lastName
        }
    });
};

exports.healthcheck = (req, res) => {
    res.send("Ok");
};

exports.listQuizzes =  (req, res) => {
    dynamo.listQuizzes().then((data) => {
        res.send({"quizzes": data.Items});
    }, errorHandler);
};


exports.getQuiz = (req, res) => {
    dynamo.getQuiz(req.params.id).then((data) => {
        res.send(data);
    }, errorHandler);
};


exports.updateQuiz = (req, res) => {
    dynamo.updateQuiz(req.params.id, req.guUser.email, req.body)
        .then((data) => {
            res.send(data);
        }, errorHandler);
};


exports.createQuiz = (req, res) => {
    dynamo.createQuiz(req.guUser.email, req.body).then((data) => {
        res.send(data);
    }, errorHandler);
};

exports.deleteQuiz = (req, res) => {
    dynamo.deleteQuiz(req.params.id).then((data) => {
        res.send(data);
    }, errorHandler);
};
