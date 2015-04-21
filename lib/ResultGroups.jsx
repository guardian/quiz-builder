import React from 'react';
import ElasticTextArea from './ElasticTextArea';
import {close} from './svgs.jsx!';
import classnames from 'classnames';
import map from 'lodash-node/modern/collection/map';
import some from 'lodash-node/modern/collection/some';
import {on} from './utils';

class ResultGroup extends React.Component {
    removeGroup() {
        console.log("remove group");
    }
    
    render() {
        const classes = classnames({
            'quiz-builder__result-group': true,
            'quiz-builder__result-group--error': this.props.isError
        });

        console.log(classes);
        
        return <div className={classes}>
            <div className="quiz-builder__min-score">{this.props.group.get('minScore')}</div>
            <div className="quiz-builder__result-group-inner">
                <ElasticTextArea className="quiz-builder__answer-text" value={this.props.group.get('title')} placeholder="Enter message text here ..." />
                <ElasticTextArea className="quiz-builder__answer-text" value={this.props.group.get('share')} placeholder="Enter share text here ..." />
                <button className="quiz-builder__answer-close" onClick={this.removeGroup.bind(this)}>{close(16)}</button>
            </div>
        </div>;
    }
}

export default class ResultGroups extends React.Component {    
    render() {
        const groups = this.props.groups
            .sort(on(group => -group.get('minScore')))
            .map((group, index) => <ResultGroup key={index} group={group} isError={group.get('minScore') > this.props.numberOfQuestions} />);

        const hasError = some(this.props.groups.toJS(), group => group.minScore > this.props.numberOfQuestions);
        
        let groupsHtml;

        if (groups.length > 0) {
            if (hasError) {
                groupsHtml = [
                    <p key="error" className="quiz-builder__error-message">
                        Some messages require a score higher than is possible given there are only {this.props.numberOfQuestions} questions.
                    </p>
                ].concat(groups);
            } else {
                groupsHtml = groups;
            }
        }

        return <section className="quiz-builder__section">
                <h2 className="quiz-builder__section-title">Messaging</h2>
                <button className="quiz-builder__button" onClick={this.props.addGroup}>Add group</button>
                {groupsHtml}
            </section>;
    }
}
