import classnames from 'classnames';
import ElasticTextArea from './ElasticTextArea';
import {close, tick, cross} from './svgs.jsx!';
import {nthLetter} from './utils';
import React from 'react';

export default class Answer extends React.Component {
    handleChange(event) {
        this.props.setText(event.target.value);
    }

    handleImageUrlChange(event) {
        this.props.setImageUrl(event.target.value);
    }

    handleRevealChange(event) {
        this.props.setReveal(event.target.value);
    }

    render() {
        const answer = this.props.answer;
        const answerText = answer.get('answer');
        const imageUrl = answer.get('imageUrl');
        const letter = nthLetter(this.props.index);
        const isCorrect = answer.get('correct');
        const classes = classnames({
            'quiz-builder__answer': true,
            'quiz-builder__answer--correct': isCorrect
        });
        const icon = isCorrect ? tick : cross;

        const header = isCorrect ? <span>{icon} {letter}.</span> : <button className="quiz-builder__correct-toggle" onClick={this.props.setCorrect}>{icon} {letter}.</button>;

        const revealText = isCorrect && <ElasticTextArea className="quiz-builder__reveal-text" value={this.props.revealText} placeholder="Enter reveal text here..." onChange={this.handleRevealChange.bind(this)} />;
        
        return <div className={classes}>
            <h4 className="quiz-builder__answer-letter">{header}</h4>
            <ElasticTextArea className="quiz-builder__answer-text" value={answerText} placeholder="Enter answer text here..." onChange={this.handleChange.bind(this)} />
            <input className="quiz-builder__image-url" value={imageUrl} placeholder="Enter image url here..." onChange={this.handleImageUrlChange.bind(this)} />
            {revealText}
            <button className="quiz-builder__answer-close" onClick={this.props.removeAnswer}>{close(16)}</button>
        </div>;
    }
}
