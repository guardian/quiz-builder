import React from 'react';
import Question from './Question.jsx!';
import some from 'lodash-node/modern/collection/some';

export default class Questions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showImages: some(props.quiz.get('questions').toJS(), question =>
                question.imageUrl || some(question.multiChoiceAnswers, answer => answer.imageUrl)
            )
        };
    }

    onShowImagesChange(event) {
        this.setState({
            showImages: event.target.checked
        });
    }

    setRevealAtEnd(event) {
        this.props.setRevealAtEnd(event.target.checked);
    }

    render() {
        const props = this.props;
        const {quiz} = props;
        const quizType = quiz.get('quizType');
        const revealAtEnd = quiz.get('revealAtEnd');
        const isPersonality = quizType === 'personality';
        const buckets = isPersonality ? quiz.get('resultBuckets') : null;

        let questions = quiz.get('questions').map((question, i) =>
            <Question question={question} 
                      key={`question_${i + 1}`} 
                      index={i} 
                      onClose={props.deleteQuestion(i)} 
                      setText={props.setQuestionText(i)}
                      setAnswerText={props.setAnswerText(i)}
                      setAnswerCorrect={props.setAnswerCorrect(i)}
                      setRevealText={props.setRevealText(i)}
                      setImageUrl={props.setQuestionImageUrl(i)}
                      setAnswerImageUrl={props.setAnswerImageUrl(i)}
                      removeAnswer={props.removeAnswer(i)}
                      reorder={props.reorderAnswers(i)}
                      showImages={this.state.showImages}
                      buckets={buckets}
                      quizType={quizType}
                      setHasBucket={props.setAnswerHasBucket(i)}
                      addAnswer={props.addAnswer(i)} />
        ).toJS();

        let questionsHtml;

        if (questions.length > 0) {
            questionsHtml = questions;
        } else {
            questionsHtml = <p>Add some questions to get started.</p>
        }

        const revealAtEndCheckbox = !isPersonality ? (
            <div className="checkbox">
                <label>
                    <input type="checkbox"
                           key="reveal_at_end"
                           checked={revealAtEnd}
                           onChange={this.setRevealAtEnd.bind(this)}
                           /> Only reveal answers at end
                </label>
            </div>
        ) : null;

        return (
            <div key="questions">
                <div className="form-inline">
                    <div className="checkbox" style={{paddingRight: 5}}>
                        <label>
                            <input type="checkbox"
                                   checked={this.state.showImages}
                                   onChange={this.onShowImagesChange.bind(this)} /> Show images
                        </label>
                    </div>
                    {revealAtEndCheckbox}
                </div>

                {questionsHtml}

                <div className="btn-toolbar" role="toolbar">
                    <button className="btn btn-default" 
                            onClick={props.addQuestion}>
                        New question
                    </button>
                    <button className="btn btn-default"
                            onClick={props.shuffleAnswers}>
                        Shuffle answers
                    </button>
                </div>
            </div>
        );
    }
}
