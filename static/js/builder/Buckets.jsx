import React from 'react';

export default class Buckets extends React.Component {
    render() {
        if (this.props.quiz.get('quizType') !== 'personality') {
            return (
                <p>Only personality quizzes have buckets.</p>
            );
        }

        return (
            <p>
                Buckets go here.
            </p>
        );
    }
}