import React from 'react';
import ElasticTextArea from './ElasticTextArea';
import {close, up, down} from './svgs.jsx!';
import classnames from 'classnames';
import countBy from 'lodash-node/modern/collection/countBy';
import min from 'lodash-node/modern/math/min';
import map from 'lodash-node/modern/collection/map';
import some from 'lodash-node/modern/collection/some';
import values from 'lodash-node/modern/object/values';

class ResultGroup extends React.Component {
    removeGroup() {
        this.props.remove();
    }

    onChangeText(event) {
        this.props.setText(event.target.value);
    }

    onChangeShare(event) {
        this.props.setShare(event.target.value);
    }

    onUp() {
        this.props.increaseMinScore();
    }

    onDown() {
        this.props.decreaseMinScore();
    }
    
    render() {
        const classes = classnames({
            'quiz-builder__result-group': true,
            'quiz-builder__result-group--error': this.props.isError
        });
        const group = this.props.group;

        let downHtml = null;

        if (group.get('minScore') > 0) {
            downHtml = <button key="down_button" className="quiz-builder__min-score-button" onClick={this.onDown.bind(this)}>
                {down}
            </button>;
        }
        
        return <div className={classes}>
            <div className="quiz-builder__min-score-buttons">
                <button className="quiz-builder__min-score-button" onClick={this.onUp.bind(this)}>
                    {up}
                </button>
                {downHtml}
            </div>
            <div className="quiz-builder__min-score">{group.get('minScore')}</div>
            <div className="quiz-builder__result-group-inner">
                <ElasticTextArea className="quiz-builder__answer-text" onChange={this.onChangeText.bind(this)} value={group.get('title')} placeholder="Enter message text here ..." />
                <ElasticTextArea className="quiz-builder__answer-text" onChange={this.onChangeShare.bind(this)} value={group.get('share')} placeholder="Enter share text here ..." />
                <button className="quiz-builder__answer-close" onClick={this.removeGroup.bind(this)}>{close(16)}</button>
            </div>
        </div>;
    }
}

export default class ResultGroups extends React.Component {    
    render() {
        const jsGroups = this.props.groups.toJS();

        const minScoreCounts = countBy(jsGroups, 'minScore');

        const isError = (minScore) =>
            minScore > this.props.numberOfQuestions || minScoreCounts[minScore] > 1;
        
        const groups = this.props.groups
            .map((group, index) => <ResultGroup key={index} 
                                                group={group}
                                                increaseMinScore={this.props.increaseMinScore.bind(null, index)} 
                                                decreaseMinScore={this.props.decreaseMinScore.bind(null, index)}
                                                setText={this.props.setGroupText(index)}
                                                setShare={this.props.setGroupShare(index)}
                                                remove={this.props.removeGroup.bind(null, index)}
                                                isError={isError(group.get('minScore'))} />)
            .toJS();        
        
        let errors = [];

        if (some(jsGroups, group => group.minScore > this.props.numberOfQuestions)) {
            const isSingle = this.props.numberOfQuestions === 1;

            errors.push(
                <li key="error_too_high" className="quiz-builder__error-message">
                    Some messages require a score higher than is possible given there {isSingle ? 'is' : 'are'} only {this.props.numberOfQuestions} question{isSingle ? '' : 's'}.
                </li>
            );
        }

        if (some(values(minScoreCounts), (count) => count > 1)) {
            errors.push(
                <li key="error_duplicates" className="quiz-builder__error-message">
                    Duplicate messages exist for the same scores.
                </li>
            );
        }

        const minMinScore = min(map(jsGroups, g => g.minScore));

        if (minMinScore !== Infinity && minMinScore > 0) {
            errors.push(
                <li key="error_no_zero" className="quiz-builder__error-message">
                    You do not have messaging for when a user scores less than {minMinScore}.
                </li>
            );
        }

        let errorsHtml = (errors.length > 0) ? <ul>{errors}</ul> : null;

        return <section className="quiz-builder__section">
                <h2 className="quiz-builder__section-title">Messaging</h2>
                <button className="quiz-builder__button" onClick={this.props.addGroup}>Add group</button>
                {errorsHtml}
                {groups}
            </section>;
    }
}
