
exports.index = (req, res) => {
    res.send(JSON.stringify({"something" : "fun"}));
};


exports.listQuizzes =  (req, res) => {
    res.send(JSON.stringify({"quizzes": []}));
};
