var dynamo = require('../util/dynamo');

function errorHandler(err) {
    throw err;
}

exports.index = (req, res) => {
    res.send(JSON.stringify({"something" : "fun"}));
};


exports.listQuizzes =  (req, res) => {
    dynamo.listQuizzes().then((data) => {
        res.send(JSON.stringify({"quizzes": data.Items}));
    }, errorHandler);
};


exports.getQuiz = (req, res) => {
    dynamo.getQuiz(req.id).then((data) => {
        res.send(JSON.stringify(data.Item));
    }, errorHandler);
};
