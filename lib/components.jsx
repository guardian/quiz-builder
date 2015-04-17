import React from 'react';
import bonzo from 'bonzo';
import classnames from 'classnames';
import Immutable from 'immutable';
import {close, tick, cross} from './svgs.jsx!';
import {nthLetter, insertAt} from './utils';
import flatten from 'lodash-node/modern/array/flatten';
import drop from 'lodash-node/modern/array/drop';
import take from 'lodash-node/modern/array/take';

class Answer extends React.Component {
    handleChange(event) {
        this.props.setText(event.target.value);
    }

    handleRevealChange(event) {
        this.props.setReveal(event.target.value);
    }

    render() {
        const answer = this.props.answer;
        const answerText = answer.get('answer');
        const letter = nthLetter(this.props.index);
        const isCorrect = answer.get('correct');
        const classes = classnames({
            'quiz-builder__answer': true,
            'quiz-builder__answer--correct': isCorrect
        });
        const icon = isCorrect ? tick : cross;

        const header = isCorrect ? <span>{icon} {letter}.</span> : <button className="quiz-builder__correct-toggle" onClick={this.props.setCorrect}>{icon} {letter}.</button>;

        const revealText = isCorrect && <input className="quiz-builder__reveal-text" value={this.props.revealText} placeholder="Enter reveal text here..." onChange={this.handleRevealChange.bind(this)} />;
        
        return <div className={classes}>
            <h4 className="quiz-builder__answer-letter">{header}</h4>
            <input className="quiz-builder__answer-text" value={answerText} placeholder="Enter answer text here..." onChange={this.handleChange.bind(this)} />
            {revealText}
        </div>;
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

    onDragStart(event) {
        event.dataTransfer.effectAllowed = 'move';
        this.props.setIsDragging(true);
        this.props.setDragIndex(this.props.index);
    }

    onDragEnd(event) {
        this.props.reorder();
        this.props.setIsDragging(false);
    }

    onDragOver(event) {
        const $node = bonzo(React.findDOMNode(this));
        const offset = $node.offset();
        const relY = bonzo(document.body).scrollTop() + event.clientY - offset.top;
        const dropPosition = this.props.index + (relY >= offset.height / 2 ? 1 : 0);
        this.props.setDropIndex(dropPosition);
    }
    
    render() {
        const question = this.props.question;
        let answersData = question.get('multiChoiceAnswers');
        let answers;

        if (answersData.size > 0) {
            answers = <div className="quiz-builder__answers">
                {answersData.map((answer, index) => <Answer answer={answer} index={index} key={`answer_${index + 1}`} setText={this.props.setAnswerText(index)} setCorrect={this.props.setAnswerCorrect.bind(null, index)} setReveal={this.props.setRevealText} revealText={question.get('more')} />).toJS()}
            </div>
        }
            
        return <div className="quiz-builder__question" onDragOver={this.onDragOver.bind(this)}>
            <h2 className="quiz-builder__question-number"
                data-index={this.props.index}
                onDragEnd={this.onDragEnd.bind(this)}
                onDragStart={this.onDragStart.bind(this)}
                draggable="true">Question {this.props.index + 1}.</h2>
            <input className="quiz-builder__question-text" value={question.get('question')} placeholder="Enter question text here..." onChange={this.handleQuestionTextChange.bind(this)} />

            <h3>Answers</h3>
            
            {answers}

            <button className="quiz-builder__button" onClick={this.props.addAnswer}>Add answer</button>

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
            isDragging: false,
            dragIndex: null,
            dropIndex: null,
            quiz: {
                questions: []
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

    setAnswerText(questionNumber) {
        return (answerNumber) => (text) => this.updateQuiz(state => state.updateIn(
            ['questions', questionNumber, 'multiChoiceAnswers', answerNumber],
            answer => answer.set('answer', text)
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
                more: "",
                multiChoiceAnswers: []
            }))
        ));
    }

    setDragIndex(index) {
        this.updateState(state => state.set('dragIndex', index));
    }

    setDropIndex(index) {
        this.updateState(state => state.set('dropIndex', index));
    }

    setIsDragging(isDragging) {
        this.updateState(state => state.set('isDragging', isDragging));

        if (!isDragging) {
            this.updateState(state => state.set('dropIndex', null).set('dragIndex', null));
        }
    }

    reorder() {
        const dragIndex = this.state.get('dragIndex');
        const dropIndex = this.state.get('dropIndex');

        this.updateQuiz(quiz => quiz.update(
            'questions',
            questions => {
                const dragged = questions.get(dragIndex);

                return insertAt(questions, dropIndex, dragged).remove(dropIndex < dragIndex ? dragIndex + 1 : dragIndex);
            }
        ));
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
                 setDropIndex={this.setDropIndex.bind(this)}
                 setDragIndex={this.setDragIndex.bind(this)}
                 setIsDragging={this.setIsDragging.bind(this)}
                 reorder={this.reorder.bind(this)}
                 addAnswer={this.addAnswer(i)} />)
            .toJS();
        const json = quiz.toJS();

        if (questions.length > 1 && this.state.get('isDragging') && this.state.get('dropIndex') !== null) {
            const dragIndex = this.state.get('dragIndex');
            const dropIndex = this.state.get('dropIndex');

            if (dragIndex !== dropIndex && dragIndex + 1 !== dropIndex) {
                questions = flatten([
                    take(questions, dropIndex),
                    <div key="placeholder" className="quiz-builder__drop-placeholder"></div>,
                    drop(questions, dropIndex)
                ]);
            }
        }
        
        let questionsHtml;

        if (questions.length > 0) {
            questionsHtml = <div className="quiz-builder__questions">
                {questions}
            </div>;
        } else {
            questionsHtml = <p>Add some questions to get started!</p>
        }
        
        return <div className="quiz-builder">
            {questionsHtml}

            <button className="quiz-builder__button" onClick={this.addQuestion.bind(this)}>New question</button>

            <JSONViewer data={json} />
        </div>;
    }
}
