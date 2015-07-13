import React from 'react';
import Answer from './Answer.jsx!';
import Thumbnail from './Thumbnail.jsx!';

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
            answers = answersData.map((answer, index) => (
                <Answer answer={answer}
                        index={index}
                        key={`answer_${index + 1}`}
                        setText={this.props.setAnswerText(index)}
                        setCorrect={this.props.setAnswerCorrect.bind(null, index)}
                        setReveal={this.props.setRevealText}
                        removeAnswer={this.props.removeAnswer.bind(null, index)}
                        setImageUrl={this.props.setAnswerImageUrl(index)}
                        showImages={this.props.showImages}
                        quizType={this.props.quizType}
                        buckets={this.props.buckets}
                        setHasBucket={this.props.setHasBucket(index)}
                        enableReveal={this.props.enableReveal}
                        revealText={question.get('more')} />
            )).toJS()
        }

        const questionText = (
            <div key="question-text" className="form-group">
                <div className="input-group input-group-lg">
                    <span className="input-group-addon">Question {this.props.index + 1}.</span>
                    <input className="form-control"
                           value={question.get('question')}
                           placeholder="Enter question text here..."
                           onChange={this.handleQuestionTextChange.bind(this)} />
                </div>
            </div>
        );

        let formHtml;

        if (this.props.showImages) {
            formHtml = (
                <div key="images-and-question-text">
                    <div className="pull-left" style={{paddingRight: '10px'}}>
                        <Thumbnail src={question.get('imageUrl')} />
                    </div>

                    {questionText}

                    <div className="input-group" style={{marginTop: '10px', marginBottom: '15px'}}>
                        <span className="input-group-addon">Image URL</span>
                        <input className="form-control"
                               value={question.get('imageUrl')}
                               placeholder="Enter image URL here..."
                               onChange={this.handleImageUrlChange.bind(this)} />
                    </div>
                </div>
            );
        } else {
            formHtml = questionText;
        }
            
        return (
            <div className="panel panel-default">
                <div className="panel-body">
                    {formHtml}

                    <div className="form-group">
                        <ul className="list-group">
                            {answers}
                        </ul>
                    </div>
                    
                    <div className="btn-toolbar text-right" role="toolbar">
                        <button type="button" 
                                className="btn btn-default"
                                onClick={this.props.addAnswer}>
                            Add answer
                        </button>

                        <button type="button" 
                                className="btn btn-default" 
                                onClick={this.props.onClose}>
                            Delete question
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
