import React from 'react';
import ElasticTextArea from './ElasticTextArea';
import {close} from './svgs.jsx!';
import map from 'lodash-node/modern/collection/map';
import sortBy from 'lodash-node/modern/collection/sortBy';

class Range extends React.Component {

    render() {
        return <div className="range-input">
                <input type="text" className="range-input__input range-input__input--left" value={this.props.minValue} />&ndash;<input type="text" className="range-input__input range-input__input--right" value={this.props.maxValue} />
            </div>;
    }
}

class ResultGroup extends React.Component {
    removeGroup() {
        console.log("remove group");
    }
    
    render() {
        return <div className="quiz-builder__result-group">
            <Range minValue={this.props.group.get('minScore')} maxValue={this.props.group.get('maxScore')} />
            <ElasticTextArea className="quiz-builder__answer-text" value={this.props.group.get('title')} placeholder="Enter message text here ..." />
            <ElasticTextArea className="quiz-builder__answer-text" value={this.props.group.get('share')} placeholder="Enter share text here ..." />
            <button className="quiz-builder__answer-close" onClick={this.removeGroup.bind(this)}>{close(16)}</button>
        </div>;
    }
}

export default class ResultGroups extends React.Component {
    onAddGroup() {
        console.log("add group");
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
