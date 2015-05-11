import React from 'react';
import {Quiz} from '../quizzes/components.jsx!';

export default class Preview extends React.Component {
    render() {
        const quizJs = this.props.quiz.toJS();

        return (
            <div className="preview">
                <Quiz {...quizJs} quizType="knowledge" />
            </div>
        );
    }
}