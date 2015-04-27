import React from 'react';
import {close} from './svgs.jsx!';
import ElasticTextArea from './ElasticTextArea';
import ReorderableList from './ReorderableList.jsx!';
import Answer from './Answer.jsx!';

export default class Question extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isExpanded: false
        };
    }

    handleImageUrlChange(event) {
        this.props.setImageUrl(event.target.value);
    }

    handleQuestionTextChange(event) {
        this.props.setText(event.target.value);
    }
    
    render() {
        const question = this.props.question;
        let answersData = question.get('multiChoiceAnswers');
        let answers;

        if (answersData.size > 0) {
            answers = answersData.map((answer, index) =>
                         <Answer answer={answer}
                                 index={index}
                                 key={`answer_${index + 1}`}
                                 setText={this.props.setAnswerText(index)}
                                 setCorrect={this.props.setAnswerCorrect.bind(null, index)}
                                 setReveal={this.props.setRevealText}
                                 removeAnswer={this.props.removeAnswer.bind(null, index)}
                                 setImageUrl={this.props.setAnswerImageUrl(index)}
                                 revealText={question.get('more')} />
            ).toJS()
        }
            
        return <div className="quiz-builder__question">
            <h2 className="quiz-builder__question-number">Question {this.props.index + 1}.</h2>
            <ElasticTextArea className="quiz-builder__question-text" value={question.get('question')} placeholder="Enter question text here..." onChange={this.handleQuestionTextChange.bind(this)} />
            <input className="quiz-builder__image-url" value={question.get('imageUrl')} placeholder="Enter image url here..." onChange={this.handleImageUrlChange.bind(this)} />


            <div className="quiz-builder__answers">
            <ReorderableList onReorder={this.props.reorder} components={answers} context="answer" />
            </div>

            <button className="quiz-builder__button" onClick={this.props.addAnswer}>Add answer</button>

            <button className="quiz-builder__question-close" onClick={this.props.onClose}>{close(18)}</button>
        </div>;
    }
}
