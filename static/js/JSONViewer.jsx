import React from 'react';
import ElasticTextArea from './ElasticTextArea';

export default class JSONViewer extends React.Component {
    render() {
        const json = JSON.stringify(this.props.data, null, 4);
        
        return <ElasticTextArea className="quiz-builder__json-viewer" value={json} readOnly />;
    }
}
