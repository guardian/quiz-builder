import React from 'react';

export default class Aggregate extends React.Component {
    phraseText(percentageCorrect, isCorrect) {
        if (percentageCorrect < 50) {
            return `${isCorrect ? "Good job!" : "Don't worry."} More people got this question wrong than right!`;
        } else if (percentageCorrect > 80) {
            return `${isCorrect ? "This one's easy" : "Oh dear"} - ${percentageCorrect}% of people knew this.`;
        }
    }

    render() {
        const {pctRight, correct} = this.props;
        const phraseText = this.phraseText(pctRight, correct);

        if (phraseText) {
            return (
                <div className="quiz__answer-aggregate">{phraseText}</div>
            );
        }
    }
}