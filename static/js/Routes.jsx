import React from 'react';
import Router from 'react-router';
import QuizBuilder from './QuizBuilder.jsx!';
import Home from './Home.jsx!';
import NewQuizForm from './NewQuizForm.jsx!';

const {DefaultRoute, Link, Route, RouteHandler} = Router;

export class App extends React.Component {
    render() {
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
                            </ul>
                            <ul className="nav navbar-nav">
                                <li><Link to="/new-quiz">New quiz</Link></li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <div className="container">
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
        <Route name="quizzes" path="/quizzes/:quizId" handler={QuizBuilder} />
    </Route>
);
