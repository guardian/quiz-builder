import React from 'react';
import map from 'lodash-node/modern/collection/map';

class ResultGroup extends React.Component {
    render() {
        return <p>Result group</p>;
    }
}

export default class ResultGroups extends React.Component {
    render() {
        const groups = map(
            this.props.groups,
            group => <ResultGroup group={group} />
        );

        return <div>{groups}</div>;
    }
}
