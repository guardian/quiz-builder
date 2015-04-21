import React from 'react';
import ElasticTextArea from './ElasticTextArea';
import {close} from './svgs.jsx!';
import map from 'lodash-node/modern/collection/map';
import {on} from './utils';

class ResultGroup extends React.Component {
    removeGroup() {
        console.log("remove group");
    }
    
    render() {
        return <div className="quiz-builder__result-group">
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
    onAddGroup() {
        console.log("add group");
    }
    
    render() {
        const groups = this.props.groups
              .sort(on(group => -group.get('minScore')))
              .map((group, index) => <ResultGroup key={index} group={group} />);

        let groupsHtml;

        if (groups.length > 0) {
            groupsHtml = groups;
        } else {
            groupsHtml = <p>Add some messaging to get started.</p>;
        }

        return <section className="quiz-builder__section">
                <h2 className="quiz-builder__section-title">Messaging</h2>
                {groupsHtml}
                <button className="quiz-builder__button" onClick={this.onAddGroup.bind(this)}>Add group</button>
            </section>;
    }
}
