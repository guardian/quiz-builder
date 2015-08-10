const AWS = require('aws-sdk');
const UUID = require('node-uuid');

const dynamodb = new AWS.DynamoDB({region: 'eu-west-1'});

const TableName = 'QuizBuilderPROD_Quizzes';

function listQuizzes() {
    const params = {
        TableName: TableName,
        ProjectionExpression: 'id, title, createdAt, createdBy, updatedAt, updatedBy',
        ConsistentRead: true || false,
        Limit: 10,
        Segment: 0,
        TotalSegments: 1
    };

    return new Promise((resolve, reject) => {
        dynamodb.scan(params, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        });
    });
}

function getQuiz(id) {
    const params = {
        TableName: TableName,
        Key: {
            id: {
                S: id
            }
        },
        ProjectionExpression: 'id, title, createdAt, createdBy, updatedAt, updatedBy, quiz'
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

function updateQuiz(id, user, body) {
    const quiz = body.quiz;
    const title = quiz.header.titleText;

    const params = {
        TableName: TableName,
        Key: {
            id: {
                S: id
            }
        },
        AttributeUpdates: {
            updatedAt: {
                Value: {
                    N: Date.now().toString()
                },
                Action: 'PUT'
            },
            updatedBy: {
                Value: {
                    S: user
                },
                Action: 'PUT'
            },
            quiz: {
                Value: {
                    S: JSON.stringify(quiz)
                },
                Action: 'PUT'
            },
            title: {
                Value: {
                    S: title
                },
                Action: 'PUT'
            }
        }
    };

    return new Promise((resolve, reject) => {
        dynamodb.updateItem(params, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        });
    });
}


function createQuiz(user, body) {
    const title = body.title;
    const type = body.type;
    const defaultColumns = body.defaultColumns;
    const id = UUID.v4();

    const emptyQuiz = () => {
        return JSON.stringify({
            id: id,
            header: {
                titleText: title,
                quizType: type,
                defaultColumns: defaultColumns
            }
        });
    };

    const params = {
        TableName: TableName,
        Item: {
            id: {
                S: id
            },
            createdAt: {
                N: Date.now().toString()
            },
            updatedAt: {
                N: Date.now().toString()
            },
            createdBy: {
                S: user
            },
            updatedBy: {
                S: user
            },
            quiz: {
                S: emptyQuiz()
            },
            title: {
                S: title
            }
        },
        ReturnValues: 'ALL_NEW'
    };

    return new Promise((resolve, reject) => {
        dynamodb.putItem(params, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        });
    });
}

function deleteQuiz(id) {
    const params = {
        TableName: TableName,
        Key: {
            id: {
                S: id
            }
        }
    };

    return new Promise((resolve, reject) => {
        dynamodb.deleteItem(params, (err, data) => {
            if(err) {
                return reject(err);
            }
            return resolve(data);
        });
    });
}

module.exports = {
    listQuizzes: listQuizzes,
    getQuiz: getQuiz,
    updateQuiz: updateQuiz,
    createQuiz: createQuiz,
    deleteQuiz: deleteQuiz
};
