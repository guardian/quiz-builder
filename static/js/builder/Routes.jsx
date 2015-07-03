import React from 'react';
import Router from 'react-router';
import QuizBuilder from './QuizBuilder.jsx!';
import Home from './Home.jsx!';
import NewQuizForm from './NewQuizForm.jsx!';
import Questions from './Questions.jsx!';
import ResultGroups from './ResultGroups.jsx!';
import Reorder from './Reorder.jsx!';
import Preview from './Preview.jsx!';
import Buckets from './Buckets.jsx!';
import Build from './Build.jsx!';
import userInfo from './userInfo';
import {MONTHS} from './utils';

const {DefaultRoute, Redirect, Link, Route, RouteHandler} = Router;

export class App extends React.Component {
    render() {
        const monthName = MONTHS[(new Date().getMonth() + 1) % 12];

        return (
            <div className="quiz-builder">
                <nav className="navbar navbar-inverse navbar-static-top">
                    <div className="container">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <Link className="navbar-brand" to="/">Guardian Quiz Builder</Link>
                        </div>
                        <div id="navbar" className="navbar-collapse collapse">
                            <ul className="nav navbar-nav">
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/new-quiz">New quiz</Link></li>
                            </ul>
                            <p className="navbar-text navbar-right">
                                Signed in as {userInfo.name}
                            </p>
                        </div>
                    </div>
                </nav>

                <div className="container">
                    <div className="alert alert-warning haters-gonna-hate" role="alert">
                        <b>Note:</b> This is a temporary tool designed to let us learn about quizzes. It will not be
                        permanently available and will be turned off towards the end of {monthName}. It will at some
                        point be replaced by a full production tool.
                    </div>

                    <RouteHandler {...this.props} />
                </div>
            </div>
        );
    }
}

export const routes = (
    <Route handler={App} path="/">
        <DefaultRoute handler={Home} />
        <Route name="new-quiz" path="/new-quiz" handler={NewQuizForm} />
        <Route name="quizzes" path="/quizzes/:quizId" handler={QuizBuilder}>
            <Route name="responses" path="responses" handler={ResultGroups} />
            <Route name="questions" path="questions" handler={Questions} />
            <Route name="reorder" path="reorder" handler={Reorder} />
            <Route name="preview" path="preview" handler={Preview} />
            <Route name="buckets" path="buckets" handler={Buckets} />
            <Route name="build" path="build" handler={Build} />
        </Route>
    </Route>
);
