import jsonschema from 'jsonschema';

const validator = new jsonschema.Validator();

const quizSchema = {
    id: '/Quiz',
    'type': 'object',
    properties: {
        questions: {
            'type': 'array',
            items: {'$ref': '/Question'}
        }
    }
};

const questionSchema = {
    id: '/Question',
    'type': 'object',
    properties: {
        question: {'type': 'string'},
        imageUrl: {'type': 'string'},
        more: {'type': 'string'},
        multiChoiceAnswers: {
            'type': 'array',
            items: {'$ref': '/Answer'}
        }
    }
}

const answerSchema = {
    id: '/Answer',
    'type': 'object',
    properties: {
        answer: {'type': 'string'},
        imageUrl: {'type': 'string'},
        correct: {'type': 'boolean'}
    },
    required: ['correct']
}

validator.addSchema(answerSchema);
validator.addSchema(questionSchema);
validator.addSchema(quizSchema);

export default function validate(json) {
    return validator.validate(json, quizSchema);
}
