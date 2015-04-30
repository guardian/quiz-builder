import React from 'react';
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
            
        return (
            <div className="panel panel-default">
                <div className="panel-body">
                    <div className="form-group">
                        <div className="input-group input-group-lg">
                            <span className="input-group-addon">Question {this.props.index + 1}.</span>
                            <input className="form-control" 
                                   value={question.get('question')} 
                                   placeholder="Enter question text here..." 
                                   onChange={this.handleQuestionTextChange.bind(this)} />
                        </div>
                    </div>

                    <div className="form-group">
                        <ul className="list-group">
                            {answers}
                        </ul>
                    </div>
                    
                    <div className="btn-toolbar" role="toolbar">
                        <button type="button" 
                                className="btn btn-default"
                                onClick={this.props.addAnswer}>Add answer</button>

                        <button type="button" 
                                className="btn btn-default" 
                                onClick={this.props.onClose}>Delete question</button>
                    </div>
                </div>
            </div>
        );
    }
}
