import React from 'react';
import reqwest from 'reqwest';
import map from 'lodash-node/modern/collection/map';
import Router from 'react-router';

const {Link} = Router;

class QuizListing extends React.Component {
    render() {
        const {quiz} = this.props;
        
        return (
            <Link className="list-group-item" to={`/quizzes/${quiz.id}`}>
                <h4 className="list-group-item-heading">{quiz.title}</h4>
                <p className="list-group-item-text">Created by {quiz.createdBy}</p>
            </Link>
        );
    }
}

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            quizzes: null,
            isLoaded: false
        };
    }
    
    componentDidMount() {
        reqwest({
            url: '/quizzes.json',
            method: 'get',
            type: 'json',
            success: (response) => {
                // not sure if this is the correct thing to check,
                // but isMounted is deprecated and the React docs
                // don't explain what else to use.
                if (React.findDOMNode(this)) {
                    this.setState({
                        isLoaded: true,
                        quizzes: response.quizzes
                    });
                }
            }
        });
    }
    
    render() {
        let listings = null;

        if (this.state.quizzes) {
            listings = <div className="panel panel-default" key="listings">
                <div className="panel-heading">Saved quizzes</div>
                <div className="list-group">
                    {map(
                        this.state.quizzes, 
                        (quiz, i) => <QuizListing key={i} quiz={quiz} />
                     )}
                </div>
            </div>;
        } else if (!this.state.isLoaded) {
            listings = <p key="spinner">Spinner here</p>;
        }
        
        return (
            <div>
               <div className="jumbotron">
                   <h1>Welcome!</h1>

                   <p>Let's build a quiz thing!</p>

                   <p><Link className="btn btn-primary btn-lg" to="/new-quiz" role="button">New quiz</Link></p>
               </div>
                
               {listings}
            </div>
        );
    }
}
