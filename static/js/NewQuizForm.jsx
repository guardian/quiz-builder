import React from 'react';
import 'fetch';

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
        fetch('/quizzes.json', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        }).then(response => response.json()).then(json => {
            this.context.router.transitionTo(`/quizzes/${json.id}`);
        });
    }
    
    render() {
        return (
            <div className="quiz-builder__section quiz-builder__section--meta">
                <h2>New quiz</h2>

                <label forHtml="title" className="quiz-builder__input-label">Title</label>
                <input id="title" className="quiz-builder__text-input" value={this.state.title} onChange={this.onChangeTitle.bind(this)} />

                <label forHtml="quizType" className="quiz-builder__input-label">Quiz Type</label>
                <select id="type" className="quiz-builder__select" value={this.state.type}>
                    <option>list</option>
                </select>
            
                <button onClick={this.onSubmit.bind(this)}>Create quiz</button>
            </div>
        );
    }
}

NewQuizForm.contextTypes = {
  router: React.PropTypes.func
};

