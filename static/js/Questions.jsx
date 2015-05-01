import React from 'react';
import Question from './Question.jsx!';

export default class Questions extends React.Component {
    render() {
        const props = this.props;
        const quiz = this.props.quiz;
        
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
                      addAnswer={props.addAnswer(i)} />
        ).toJS();

        let questionsHtml;

        if (questions.length > 0) {
            questionsHtml = questions;
        } else {
            questionsHtml = <p>Add some questions to get started.</p>
        }

        return (
            <div key="questions">
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
