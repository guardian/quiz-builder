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
            'panel': true,
            'panel-success': isCorrect,
            'panel-danger': !isCorrect
        });
        const icon = isCorrect ? tick : cross;

        const header = <span>{icon} {letter}.</span>;

        const setCorrect = !isCorrect &&
            <button type="button"
                    key="set_correct"
                    className="btn btn-default"
                    onClick={this.props.setCorrect}>Set correct</button>;

        const revealText = isCorrect && <ElasticTextArea className="quiz-builder__reveal-text" value={this.props.revealText} placeholder="Enter reveal text here..." onChange={this.handleRevealChange.bind(this)} />;
        
        return (
            <div className={classes}>
                <div className="panel-heading">{header}</div>
                <div className="panel-body">
                    <ElasticTextArea className="quiz-builder__answer-text" value={answerText} placeholder="Enter answer text here..." onChange={this.handleChange.bind(this)} />
                    <input className="quiz-builder__image-url" value={imageUrl} placeholder="Enter image url here..." onChange={this.handleImageUrlChange.bind(this)} />
                    {revealText}

                    <div className="btn-toolbar" role="toolbar">
                        {setCorrect}
                        <button type="button" 
                                className="btn btn-default" 
                                onClick={this.props.removeAnswer}>Delete answer</button>
                    </div>
                </div>
            </div>
        );
    }
}
