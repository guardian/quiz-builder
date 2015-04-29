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
        const group = this.props.group;
        
        return <li className="list-group-item">
            <span className="badge">{group.get('minScore')}</span>
            <div className="quiz-builder__result-group-inner">
                <div className="form-group">
                    <div className="input-group input-group-lg">
                        <span className="input-group-addon">Response</span>
                        <input className="form-control" 
                               onChange={this.onChangeText.bind(this)}
                               value={group.get('title')} 
                               placeholder="Enter message text here ..." />
                    </div>
                </div>
                <ElasticTextArea className="quiz-builder__answer-text" onChange={this.onChangeShare.bind(this)} value={group.get('share')} placeholder="Enter share text here ..." />
                <button className="quiz-builder__answer-close" onClick={this.removeGroup.bind(this)}>{close(16)}</button>
            </div>
        </li>;
    }
}

export default class ResultGroups extends React.Component {    
    render() {
        const jsGroups = this.props.groups.toJS();

        const minScoreCounts = countBy(jsGroups, 'minScore');

        const isError = (minScore) =>
            minScore > this.props.numberOfQuestions || minScoreCounts[minScore] > 1;
        
        const groups = this.props.groups.map((group, index) =>
            <ResultGroup key={index} 
                         group={group}
                         setText={this.props.setGroupText(index)}
                         setShare={this.props.setGroupShare(index)}
                         remove={this.props.removeGroup.bind(null, index)}
                         isError={isError(group.get('minScore'))} />
        ).toJS();
        
        let errors = [];

        if (some(jsGroups, group => group.minScore > this.props.numberOfQuestions)) {
            const isSingle = this.props.numberOfQuestions === 1;

            errors.push(
                <div key="error_too_high" className="alert alert-danger">
                    Some messages require a score higher than is possible given there {isSingle ? 'is' : 'are'} only {this.props.numberOfQuestions} question{isSingle ? '' : 's'}.
                </div>
            );
        }

        if (some(values(minScoreCounts), (count) => count > 1)) {
            errors.push(
                <div key="error_duplicates" className="alert alert-danger">
                    Duplicate messages exist for the same scores.
                </div>
            );
        }

        const minMinScore = min(map(jsGroups, g => g.minScore));

        if (minMinScore !== Infinity && minMinScore > 0) {
            errors.push(
                <div key="error_no_zero" className="alert alert-danger">
                    You do not have messaging for when a user scores less than {minMinScore}.
                </div>
            );
        }

        let errorsHtml = (errors.length > 0) ? <div key="errors">{errors}</div> : null;

        return (
            <div>
                {errorsHtml}

                <ul className="list-group">
                    {groups}
                </ul>
            </div>
        );
    }
}
