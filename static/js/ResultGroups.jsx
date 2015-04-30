import React from 'react';
import ElasticTextArea from './ElasticTextArea';
import classnames from 'classnames';
import countBy from 'lodash-node/modern/collection/countBy';
import min from 'lodash-node/modern/math/min';
import max from 'lodash-node/modern/math/max'
import map from 'lodash-node/modern/collection/map';
import some from 'lodash-node/modern/collection/some';
import zipObject from 'lodash-node/modern/array/zipObject';
import values from 'lodash-node/modern/object/values';
import range from 'lodash-node/modern/utility/range';

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
        
        return (
            <li className="list-group-item list-group-item-info">
                <div className="row">
                    <div className="col-xs-1"><h3>{group.get('minScore')}</h3></div>
                    <div className="col-xs-11">
                        <div className="form-group">
                            <div className="input-group">
                                <span className="input-group-addon">Response</span>
                                <input className="form-control" 
                                       onChange={this.onChangeText.bind(this)}
                                       value={group.get('title')} 
                                       placeholder="Enter message text here ..." />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="input-group">
                                <span className="input-group-addon">Share text</span>
                                <input className="form-control" onChange={this.onChangeShare.bind(this)} value={group.get('share')} placeholder="Enter share text here ..." />
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        );
    }
}

class DittoGroup extends React.Component {
    render() {
        return (
            <li key={`ditto_${this.props.score}`} className="list-group-item">
                <h4>{this.props.score}</h4>
            </li>
        );
    }
}

export default class ResultGroups extends React.Component {
    renderErrors() {
        const jsGroups = this.props.groups.toJS();
        const minScoreCounts = countBy(jsGroups, 'minScore');
        const errors = [];

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

        const minMinScore = min(this.scores());

        if (minMinScore !== Infinity && minMinScore > 0) {
            errors.push(
                <div key="error_no_zero" className="alert alert-danger">
                    You do not have messaging for when a user scores less than {minMinScore}.
                </div>
            );
        }

        return errors;
    }

    scores() {
        return this.props.groups.map(g => g.get('minScore')).toJS();
    }
    
    render() {
        const jsGroups = this.props.groups.toJS();
        const groupsByMinScore = zipObject(this.props.groups.map((group, index) =>
            [
                group.get('minScore'),
                (
                    <ResultGroup key={`group_${index}`}
                                 group={group}
                                 setText={this.props.setGroupText(index)}
                                 setShare={this.props.setGroupShare(index)}
                                 remove={this.props.removeGroup.bind(null, index)} />
                )
            ]
        ).toJS());

        const scores = this.scores();
        const maxMinScore = scores.length > 0 ? max(scores) : 0;
        const groups = map(range(Math.max(maxMinScore, this.props.numberOfQuestions) + 1), (n) => {
            return groupsByMinScore[n] || <DittoGroup score={n} />;
        });

        return (
            <div>
                {this.renderErrors()}

                <ul className="list-group">
                    {groups}
                </ul>
            </div>
        );
    }
}
