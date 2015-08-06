var AWS = require('aws-sdk');

var dynamodb = new AWS.DynamoDB({region: 'eu-west-1'});

function listQuizzes() {
    var params = {
        TableName: 'QuizBuilderPROD_Quizzes',
        AttributesToGet: [
            'id',
            'title',
            'createdAt',
            'createdBy',
            'updatedBy',
            'updatedAt'
        ],
        ConsistentRead: true || false,
        Limit: 10,
        Segment: 0,
        TotalSegments: 1
    };

    return new Promise((resolve, reject) => {
        dynamodb.scan(params, (err, data) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }
            return resolve(data);
        });
    });
}

function getQuiz(id) {
    var params = {
        TableName: 'QuizBuilderPROD_Quizzes',
        Key: {
            S: id
        }
    };

    return new Promise((resolve, reject) => {
        dynamodb.getItem(params, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        });
    });
}


module.exports = {
    listQuizzes: listQuizzes,
    getQuiz: getQuiz
};
