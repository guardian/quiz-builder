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
            console.log(response);
            // todo check is mounted
            this.setState({
                bootUrl: response.boot,
                isLoading: false
            });
        });
    }

    render() {
        const bootUrl = this.state.bootUrl && (
            <p>Interactive boot script: {this.state.bootUrl}</p>
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