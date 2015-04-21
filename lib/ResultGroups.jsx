import React from 'react';
import ElasticTextArea from './ElasticTextArea';
import map from 'lodash-node/modern/collection/map';
import sortBy from 'lodash-node/modern/collection/sortBy';

class ResultGroup extends React.Component {
    render() {
        return <div className="quiz-builder__result-group">
            <ElasticTextArea className="quiz-builder__answer-text" value={this.props.group.get('title')} placeholder="Enter message text here ..." />
            <ElasticTextArea className="quiz-builder__answer-text" value={this.props.group.get('share')} placeholder="Enter share text here ..." />
        </div>;
    }
}

export default class ResultGroups extends React.Component {
    onAddGroup() {
        this.props.addGroup();
    }
    
    render() {
        const groups = this.props.groups.map((group, index) =>
                                             <ResultGroup key={index} group={group} />);

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
