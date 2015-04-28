import React from 'react';
import reqwest from 'reqwest';
import map from 'lodash-node/modern/collection/map';
import Router from 'react-router';

const {Link} = Router;

class QuizListing extends React.Component {
    render() {
        const {quiz} = this.props;
        
        return <li>
            <Link to={`/quizzes/${quiz.id}`}>{quiz.title}</Link>
        </li>;
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
            listings = <ul key="listings">
                {map(
                    this.state.quizzes, 
                    (quiz, i) => <QuizListing key={i} quiz={quiz} />
                )}
            </ul>;
        } else if (!this.state.isLoaded) {
            listings = <p key="spinner">Spinner here</p>;
        }
        
        return <div>
            <p>Welcome ... </p>
            {listings}
        </div>;
    }
}
