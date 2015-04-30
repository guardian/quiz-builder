import React from 'react';
import {postJson} from './utils';
import Router from 'react-router';

const {Link} = Router;

export default class NewQuizForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            type: 'list',
            defaultColumns: 1
        }
    }

    onChangeTitle(event) {
        this.state.title = event.target.value;
        this.forceUpdate();
    }

    onSubmit() {
        postJson('/quizzes.json', this.state).then(json => {
            this.context.router.transitionTo(`/quizzes/${json.id}`);
        });
    }
    
    render() {
        return (
            <div>
                <ol className="breadcrumb">
                    <li><Link to="/">Home</Link></li>
                    <li className="active">New quiz</li>
                </ol>

                <div className="form-group">
                    <div className="input-group input-group-lg">
                        <span className="input-group-addon" id="new-quiz-title">Title</span>
                        <input type="text"
                               aria-describedby="new-quiz-title"
                               className="form-control"
                               value={this.state.title} 
                               onChange={this.onChangeTitle.bind(this)} />
                    </div>
                </div>

                <div className="form-group">
                    <select id="type" className="form-control" value={this.state.type}>
                        <option value="list">Standard quiz</option>
                        <option value="list">Personality quiz</option>
                    </select>
                </div>

                <div className="form-group">
                    <button type="button" className="btn btn-default" onClick={this.onSubmit.bind(this)}>Create quiz</button>
                </div>
            </div>
        );
    }
}

NewQuizForm.contextTypes = {
  router: React.PropTypes.func
};

