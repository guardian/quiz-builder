import React from 'react';
import {postNothing} from './utils';

export default class Build extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bootUrl: null,
            isLoading: false
        };
    }

    onStart() {
        const id = this.props.quiz.get('id');

        this.setState({
            bootUrl: null,
            isLoading: true
        });

        postNothing(`/quizzes/${id}/deploy`).then((response) => {
            // todo check is mounted
            this.setState({
                bootUrl: response.boot,
                isLoading: false
            });
        });
    }

    render() {
        const bootUrl = this.state.bootUrl && (
            <div>
                <h2>Your quiz has been built.</h2>
                <p>Please add the following two embeds to a composer article to create the loading indicator and quiz:</p>
                <div><pre>&lt;img src=&quot;http://interactive.guim.co.uk/2015/mar/quiz/auto-update-activity.gif&quot; /&gt;</pre></div>
                <div><pre>{this.state.bootUrl}</pre></div>
            </div>
        );

        const button = this.state.isLoading ? (
            <p key="spinner">Loading ...</p>
        ) : (
            <button key="button"
                    className="btn btn-default"
                    onClick={this.onStart.bind(this)}>
                Build interactive
            </button>
        );

        return (
            <div>
                {bootUrl}

                {button}
            </div>
        );
    }
}