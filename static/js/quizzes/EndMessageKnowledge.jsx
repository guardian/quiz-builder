import React from 'react';
import {Share} from './social.jsx!'
import slice from 'lodash-node/modern/array/slice';
import sum from 'lodash-node/modern/collection/sum';

export default class EndMessageKnowledge extends React.Component {
    render() {
        const {histogram, score} = this.props;
        let comparison;

        if (score > 0 && histogram) {
            const beat = Math.round((sum(slice(histogram, 0, score + 1)) * 100) / sum(histogram)) || 0;

            comparison = (
                <div key="comparison">
                    <div>How did you do?</div>
                    <div>You beat <span className="quiz__end-message__beat">{beat}%</span> of others.</div>
                </div>
            );
        }

        return (
            <div className="quiz__end-message">
                <div className="quiz__score-message">
                    You got <span className="quiz__score">{score}/{this.props.length}</span>
                </div>
                <div className="quiz__bucket-message">{this.props.message.title}</div>
                {comparison}
                <Share score={score}
                       message={this.props.message.share}
                       length={this.props.length} />
            </div>
        );
    }
}