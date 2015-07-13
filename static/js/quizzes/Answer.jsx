import React from 'react';
import classnames from 'classnames';

import Aggregate from './Aggregate.jsx!';
import {cross, tick} from './svgs.jsx!';
import {genSrc} from './images';

export default class Answer extends React.Component {
    render() {
        const {correct, isChosen, imageUrl, answer} = this.props.answer;
        const {moreText, isTypeKnowledge, isAnswered, pctRight, revealAtEnd} = this.props;
        const shouldReveal = isTypeKnowledge && !revealAtEnd;
        const classes = classnames({
            'quiz__answer': true,
            'quiz__answer--answered': isAnswered,
            'quiz__answer--chosen': !shouldReveal && isChosen,
            'quiz__answer--correct': shouldReveal && correct,
            'quiz__answer--correct-chosen': shouldReveal && correct && isChosen,
            'quiz__answer--incorrect-chosen': shouldReveal && !correct && isChosen,
            'quiz__answer--incorrect': shouldReveal && !correct
        });

        let symbol = null;

        if (isAnswered) {
            if (shouldReveal) {
                if (correct) {
                    symbol = tick(isChosen ? null : '#43B347');
                } else if (isChosen) {
                    symbol = cross();
                }
            } else {
                symbol = (
                    <span>&bull;</span>
                );
            }
        }

        const icon = symbol && (
            <span className={'quiz__answer-icon'}>{symbol}</span>
        );

        const more = (shouldReveal && correct && moreText) && (
            <div className="quiz__answer__more">{moreText}</div>
        );

        const aggregate = (isAnswered && shouldReveal && isChosen) && (
            <Aggregate correct={correct} pctRight={pctRight} />
        );

        const image = imageUrl && (
            <div className="quiz__answer__image">
                <img class="quiz__answer__img" src={genSrc(imageUrl, 160)} />
            </div>
        );

        return (
            <a data-link-name={`answer ${this.props.index + 1}`}
               className={classes}
               onClick={isAnswered ? null : this.props.chooseAnswer}>
                {icon}
                {image}
                {answer}
                {more}
                {aggregate}
            </a>
        );
    }
}