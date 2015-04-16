import React from 'react';
import classnames from 'classnames';
import Immutable from 'immutable';
import {close} from './svgs.jsx!';

class Answer extends React.Component {
    render() {
        return <p>Answer</p>;
    }
}

class Question extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isExpanded: false
        };
    }

    handleQuestionTextChange(event) {
        this.props.setText(event.target.value);
    }
    
    render() {
        const classes = classnames({
            'quiz-builder__question': true,
            'quiz-builder__question--expanded': this.state.isExpanded
        });
        const question = this.props.question;
        let answersData = question.get('multiChoiceAnswers');
        let answers;

        if (this.props.isExpanded && answersData.size > 0) {
            answers = <div className="quiz-builder__answers">
                {answersData.map(answer => <Answer answer={answer} />).toJS()}
            </div>
        }
            
        return <div className={classes}>
            <h2 className="quiz-builder__question-number">Question {this.props.index}.</h2>
            <input className="quiz-builder__question-text" value={question.get('question')} placeholder="Enter question text here..." onChange={this.handleQuestionTextChange.bind(this)} />
            
            {answers}

            <button className="quiz-builder__question-close" onClick={this.props.onClose}>{close(18)}</button>
        </div>;
    }
}

class JSONViewer extends React.Component {
    render() {
        const json = JSON.stringify(this.props.data, null, 4);
        
        return <textarea className="quiz-builder__json-viewer" value={json} readOnly />;
    }
}

export class QuizBuilder extends React.Component {
    constructor(props) {
        super(props);

        this.state = Immutable.fromJS({
            questions: []
        });
    }

    updateState(f) {
        const nextState = f(this.state);

        if (nextState !== this.state) {
            this.state = nextState;
            this.forceUpdate();
        }
    }

    deleteQuestion(n) {
        return () => this.updateState(state => state.update(
            'questions',
            questions => questions.remove(n)
        ));
    }

    setQuestionText(n) {
        return (text) => this.updateState(state => state.updateIn(
            ['questions', n],
            question => question.set('question', text)
        ));
    }

    addQuestion() {
        this.updateState(state => state.update(
            'questions', 
            questions => questions.push(Immutable.fromJS({
                question: "",
                more: "",
                multiChoiceAnswers: []
            }))
        ));
    }
    
    render() {
        const questions = this.state.get('questions')
              .map((question, i) => <Question question={question} key={`question_${i + 1}`} index={i + 1} onClose={this.deleteQuestion(i)} setText={this.setQuestionText(i)} />)
            .toJS();
        const json = this.state.toJS();
        
        return <div className="quiz-builder">
            <div className="quiz-builder__questions">
                {questions}
            </div>

            <button className="quiz-builder__new-question" onClick={this.addQuestion.bind(this)}>New question</button>

            <JSONViewer data={json} />
        </div>;
    }
}
