import React from 'react';
import reqwest from 'reqwest';
import map from 'lodash-node/modern/collection/map';
import Router from 'react-router';
import moment from 'moment';
import {postNothing} from './utils';

const {Link} = Router;

class QuizListing extends React.Component {
    onDelete(event) {
        const {quiz} = this.props;
        
        if (confirm(`Are you sure you want to delete '${quiz.title}'`)) {
            postNothing(`/quizzes/${quiz.id}/delete.json`).then(() => {
                this.props.refreshListing();
            });
        }
    }
    
    render() {
        const {quiz} = this.props;

        const renderEvent = (key, by, at) => {
            const atDate = new Date(at);

            return (
                <div key={key}>
                    {by}<br />
                    <datetime time={atDate.toISOString()}>
                        {moment(atDate).fromNow()}
                    </datetime>
                </div>
            );
        };

        const updatedHtml = ('updatedBy' in quiz) && renderEvent(
            'updated',
            quiz.updatedBy,
            quiz.updatedAt
        );
        
        return (
            <tr>
                <td>
                    <Link to={`/quizzes/${quiz.id}`}>
                         <span className="h4">{quiz.title}</span>
                    </Link>
                </td>
                <td>
                    {renderEvent('created', quiz.createdBy, quiz.createdAt)}
                </td>
                <td>
                    {updatedHtml}
                </td>
                <td>
                    <Link className="btn btn-default" to={`/quizzes/${quiz.id}`}>
                        <span className="glyphicon glyphicon-pencil"></span>
                    </Link>
                    <button type="button"
                            className="btn btn-default"
                            onClick={this.onDelete.bind(this)}>
                        <span className="glyphicon glyphicon-trash"></span>
                    </button>
                </td>
            </tr>
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

    refreshListing() {
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
    
    componentDidMount() {
        this.refreshListing();
    }
    
    render() {
        let listings = null;

        if (this.state.quizzes) {
            listings = <div className="panel panel-default" key="listings">
                <table className="table">
                    <thead>
                        <th>Title</th>
                        <th>Created</th>
                        <th>Updated</th>
                        <th></th>
                    </thead>
                    <tbody>
                    {map(
                        this.state.quizzes, 
                        (quiz, i) => (
                            <QuizListing key={i}
                                         quiz={quiz} 
                                         refreshListing={this.refreshListing.bind(this)} />
                        )
                     )}
                    </tbody>
                </table>
            </div>;
        } else if (!this.state.isLoaded) {
            listings = <p key="spinner">Spinner here</p>;
        }
        
        return (
            <div>
               <div className="jumbotron">
                   <h1>Welcome!</h1>

                   <p>Let's build a quiz thing!</p>

                   <p>
                       <Link className="btn btn-primary btn-lg" to="/new-quiz" role="button">
                           New quiz
                       </Link>
                   </p>
               </div>
                
               {listings}
            </div>
        );
    }
}
