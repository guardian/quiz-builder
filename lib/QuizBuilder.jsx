import React from 'react';
import Immutable from 'immutable';
import {move} from './utils';
import shuffle from 'lodash-node/modern/collection/shuffle';
import some from 'lodash-node/modern/collection/some';
import ReorderableList from './ReorderableList.jsx!';
import JSONViewer from './JSONViewer.jsx!';
import Question from './Question.jsx!';
import ResultGroups from './ResultGroups.jsx!';
import validate from './schema';

export default class QuizBuilder extends React.Component {
    constructor(props) {
        super(props);

        this.state = Immutable.fromJS({
            quiz: {
                questions: [],
                resultGroups: []
            }
        });
    }

    updateState(f) {
        const nextState = f(this.state);

        if (nextState !== this.state) {
            this.state = nextState;
            this.forceUpdate();
        }
    }

    updateQuiz(f) {
        this.updateState(state => state.update('quiz', f));
    }

    deleteQuestion(n) {
        return () => this.updateQuiz(state => state.update(
            'questions',
            questions => questions.remove(n)
        ));
    }

    setQuestionText(n) {
        return (text) => this.updateQuiz(state => state.updateIn(
            ['questions', n],
            question => question.set('question', text)
        ));
    }

    addAnswer(questionNumber) {
        return () => this.updateQuiz(state => state.updateIn(
            ['questions', questionNumber],
            question => question.update(
                'multiChoiceAnswers',
                answers => answers.push(Immutable.fromJS({
                    answer: '',
                    imageUrl: '',
                    correct: answers.size === 0
                }))
            )
        ));
    }

    removeAnswer(questionNumber) {
        const ensureCorrectExists = (answers) => {
            if (answers.size === 0 || some(answers.toJS(), answer => answer.correct)) {
                return answers;
            } else {
                return answers.update(0, a => a.set('correct', true));
            }
        };
        
        return (answerNumber) => this.updateQuiz(state => state.updateIn(
            ['questions', questionNumber, 'multiChoiceAnswers'],
            answers => ensureCorrectExists(answers.remove(answerNumber))
        ));
    }

    setAnswerText(questionNumber) {
        return (answerNumber) => (text) => this.updateQuiz(state => state.setIn(
            ['questions', questionNumber, 'multiChoiceAnswers', answerNumber, 'answer'],
            text
        ));
    }

    setAnswerCorrect(questionNumber) {
        return (answerNumber) => this.updateQuiz(state => state.updateIn(
            ['questions', questionNumber, 'multiChoiceAnswers'],
            answers => answers.map((answer, i) => answer.set('correct', i === answerNumber))
        ));
    }

    setRevealText(questionNumber) {
        return (text) => this.updateQuiz(state => state.setIn(
            ['questions', questionNumber, 'more'],
            text
        ));
    }

    addQuestion() {
        this.updateQuiz(state => state.update(
            'questions', 
            questions => questions.push(Immutable.fromJS({
                question: "",
                imageUrl: "",
                more: "",
                multiChoiceAnswers: []
            }))
        ));
    }

    reorder(dragIndex, dropIndex) {
        this.updateQuiz(quiz => quiz.update(
            'questions',
            questions => move(questions, dragIndex, dropIndex)
        ));
    }

    reorderAnswers(questionNumber) {
        return (dragIndex, dropIndex) => {
            this.updateQuiz(quiz => quiz.updateIn(
                ['questions', questionNumber, 'multiChoiceAnswers'],
                answers => move(answers, dragIndex, dropIndex)
            ));
        }
    }

    setQuestionImageUrl(questionNumber) {
        return (imageUrl) => this.updateQuiz(quiz => quiz.setIn(
            ['questions', questionNumber, 'imageUrl'],
            imageUrl
        ));
    }

    setAnswerImageUrl(questionNumber) {
        return (answerNumber) => (imageUrl) => this.updateQuiz(quiz => quiz.setIn(
            ['questions', questionNumber, 'multiChoiceAnswers', answerNumber, 'imageUrl'],
            imageUrl
        ));
    }

    shuffleAnswers() {
        this.updateQuiz(quiz => quiz.update(
            'questions',
            questions => questions.map(question => question.update(
                'multiChoiceAnswers',
                answers => Immutable.fromJS(shuffle(answers.toJS()))
            ))
        ));
    }

    loadFromJSON() {
        try {
            const json = JSON.parse(prompt("Enter JSON here"));
            const result = validate(json);
            
            if (!result.valid) {
                throw null;
            }
            
            this.state = Immutable.fromJS({
                quiz: json
            });
            this.forceUpdate();
        } catch (error) {
            alert("Bad JSON format, could not load.");
        }
    }
    
    render() {
        const quiz = this.state.get('quiz');
        let questions = quiz.get('questions')
            .map((question, i) => <Question question={question} 
                 key={`question_${i + 1}`} 
                 index={i} 
                 onClose={this.deleteQuestion(i)} 
                 setText={this.setQuestionText(i)}
                 setAnswerText={this.setAnswerText(i)}
                 setAnswerCorrect={this.setAnswerCorrect(i)}
                 setRevealText={this.setRevealText(i)}
                 setImageUrl={this.setQuestionImageUrl(i)}
                 setAnswerImageUrl={this.setAnswerImageUrl(i)}
                 removeAnswer={this.removeAnswer(i)}
                 reorder={this.reorderAnswers(i)}
                 addAnswer={this.addAnswer(i)} />)
            .toJS();
        const json = quiz.toJS();
        
        let questionsHtml;

        if (questions.length > 0) {
            questionsHtml = <div className="quiz-builder__questions">
                <ReorderableList onReorder={this.reorder.bind(this)} components={questions} context="question" />
            </div>;
        } else {
            questionsHtml = <p>Add some questions to get started.</p>
        }
        
        return <div className="quiz-builder">

            <section className="quiz-builder__section">
                <h2 className="quiz-builder__section-title">Questions</h2>
        
                {questionsHtml}

                <button className="quiz-builder__button" onClick={this.addQuestion.bind(this)}>New question</button> &nbsp;
                <button className="quiz-builder__button" onClick={this.shuffleAnswers.bind(this)}>Shuffle answers</button>
            </section>

            <ResultGroups groups={this.state.get('resultGroups')} />

            <section className="quiz-builder__section">
                <h2 className="quiz-builder__section-title">JSON</h2>
                <JSONViewer data={json} />
                <button className="quiz-builder__button" onClick={this.loadFromJSON.bind(this)}>Load from JSON</button>
            </section>
        </div>;
    }
}
