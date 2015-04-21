import React from 'react';
import map from 'lodash-node/modern/collection/map';

class ResultGroup extends React.Component {
    render() {
        return <p>Result group</p>;
    }
}

export default class ResultGroups extends React.Component {
    onAddGroup() {
        this.props.addGroup();
    }
    
    render() {
        const groups = map(
            this.props.groups,
            group => <ResultGroup group={group} />
        );

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
