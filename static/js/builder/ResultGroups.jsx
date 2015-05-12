import React from 'react';
import classnames from 'classnames';
import countBy from 'lodash-node/modern/collection/countBy';
import min from 'lodash-node/modern/math/min';
import max from 'lodash-node/modern/math/max'
import map from 'lodash-node/modern/collection/map';
import some from 'lodash-node/modern/collection/some';
import zipObject from 'lodash-node/modern/array/zipObject';
import values from 'lodash-node/modern/object/values';
import range from 'lodash-node/modern/utility/range';

function listClass(isBlue) {
    return classnames({
        'list-group-item': true,
        'list-group-item-info': isBlue,
        'list-group-item-warning': !isBlue
    });
}

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
    
    render() {
        const group = this.props.group;
        const minScore = group.get('minScore');

        let buttonsHtml;

        if (minScore > 0) {
            buttonsHtml = (
                <button type="button"
                        className="btn btn-default"
                        onClick={this.removeGroup.bind(this)}>
                    <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
                </button>
            );
        }
        
        return (
            <li className={listClass(this.props.isBlue)}>
                <div className="row">
                    <div className="col-xs-1"><h3>{minScore}</h3></div>
                    <div className="col-xs-10">
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
                    <div className="col-xs-1 text-right">{buttonsHtml}</div>
                </div>
            </li>
        );
    }
}

class DittoGroup extends React.Component {
    addGroup(event) {
        event.preventDefault();
        this.props.addGroup(this.props.score);
    }
    
    render() {
        return (
            <li className={listClass(this.props.isBlue)}>
                <div className="row">
                    <div className="col-xs-11">
                        <h4>
                            <img className="arrow-previous" 
                                 src="/assets/images/arrow.png" 
                                 role="presentation" />
                            {this.props.score}
                        </h4>
                    </div>
                    <div className="col-xs-1 text-right">
                        <button type="button"
                                className="btn btn-default"
                                onClick={this.addGroup.bind(this)}>
                            <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
                        </button>
                    </div>
                </div>
            </li>
        );
    }
}

export default class ResultGroups extends React.Component {
    renderErrors() {
        const numberOfQuestions = this.numberOfQuestions();
        const jsGroups = this.groups().toJS();
        const minScoreCounts = countBy(jsGroups, 'minScore');
        const errors = [];

        if (some(jsGroups, group => group.minScore > numberOfQuestions)) {
            const isSingle = numberOfQuestions === 1;

            errors.push(
                <div key="error_too_high" className="alert alert-danger">
                    Some messages require a score higher than is possible given there {isSingle ? 'is' : 'are'} only {numberOfQuestions} question{isSingle ? '' : 's'}.
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

    numberOfQuestions() {
        return this.props.quiz.get('questions').size;
    }

    groups() {
        return this.props.quiz.get('resultGroups');
    }
    
    scores() {
        return this.props.quiz.get('resultGroups').map(g => g.get('minScore')).toJS();
    }
    
    render() {
        const quizType = this.props.quiz.get('quizType');

        if (quizType && quizType !== 'knowledge') {
            return (
                <p>Only knowledge quizzes have response groups.</p>
            );
        }
        
        const groups = this.groups();
        const numberOfQuestions = this.numberOfQuestions();
        const groupsByMinScore = zipObject(groups.map((group, index) =>
            [group.get('minScore'), [group, index]]
        ).toJS());

        const scores = this.scores();
        const maxMinScore = scores.length > 0 ? max(scores) : 0;

        let isBlue = false;
        
        const groupsHtml = map(range(Math.max(maxMinScore, numberOfQuestions) + 1), (n) => {
            if (n in groupsByMinScore) {
                isBlue = !isBlue;
                const [group, index] = groupsByMinScore[n];

                return (
                    <ResultGroup key={`group_${n}_result_group`}
                                 group={group}
                                 setText={this.props.setGroupText(index)}
                                 setShare={this.props.setGroupShare(index)}
                                 isBlue={isBlue}
                                 remove={this.props.removeGroup.bind(null, index)} />
                );
            } else {
                return (
                    <DittoGroup key={`group_${n}`} score={n} isBlue={isBlue} addGroup={this.props.addGroup} />
                );
            }
        });

        return (
            <div>
                <div>
                    {this.renderErrors()}
                </div>

                <ul className="list-group">
                    {groupsHtml}
                </ul>
            </div>
        );
    }
}
