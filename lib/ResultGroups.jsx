import React from 'react';
import ElasticTextArea from './ElasticTextArea';
import {close} from './svgs.jsx!';
import classnames from 'classnames';
import map from 'lodash-node/modern/collection/map';
import some from 'lodash-node/modern/collection/some';

class ResultGroup extends React.Component {
    removeGroup() {
        this.props.remove();
    }
    
    render() {
        const classes = classnames({
            'quiz-builder__result-group': true,
            'quiz-builder__result-group--error': this.props.isError
        });
        const group = this.props.group;

        console.log(classes);
        
        return <div className={classes}>
            <div className="quiz-builder__min-score">{group.get('minScore')}</div>
            <div className="quiz-builder__result-group-inner">
                <ElasticTextArea className="quiz-builder__answer-text" value={group.get('title')} placeholder="Enter message text here ..." />
                <ElasticTextArea className="quiz-builder__answer-text" value={group.get('share')} placeholder="Enter share text here ..." />
                <button className="quiz-builder__answer-close" onClick={this.removeGroup.bind(this)}>{close(16)}</button>
            </div>
        </div>;
    }
}

export default class ResultGroups extends React.Component {    
    render() {
        const groups = this.props.groups
            .map((group, index) => <ResultGroup key={index} 
                                                group={group}
                                                remove={this.props.removeGroup.bind(null, index)}
                                                isError={group.get('minScore') > this.props.numberOfQuestions} />);

        const hasError = some(this.props.groups.toJS(), group => group.minScore > this.props.numberOfQuestions);
        const isSingle = this.props.numberOfQuestions === 1;
        
        let groupsHtml;

        if (groups.length > 0) {
            if (hasError) {
                groupsHtml = [
                    <p key="error" className="quiz-builder__error-message">
                        Some messages require a score higher than is possible given there {isSingle ? 'is' : 'are'} 
                        only {this.props.numberOfQuestions} question{isSingle ? '' : 's'}.
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
