import React from 'react';
import Router from 'react-router';
import QuizBuilder from './QuizBuilder.jsx!';
import Home from './Home.jsx!';

const {DefaultRoute, Link, Route, RouteHandler} = Router;

export class App extends React.Component {
    render() {
        return (
            <div className="quiz-builder">
                <h1 className="quiz-builder__header">Guardian Quiz Builder</h1>

                <RouteHandler {...this.props} />
            </div>
        );
    }
}

export const routes = (
    <Route handler={App} path="/">
        <DefaultRoute handler={Home} />
        <Route name="quizzes" path="/quizzes/:quizId" handler={QuizBuilder} />
    </Route>
);
