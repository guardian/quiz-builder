import classnames from 'classnames';
import {nthLetter} from './utils';
import React from 'react';

export default class Answer extends React.Component {
    handleChange(event) {
        this.props.setText(event.target.value);
    }

    handleImageUrlChange(event) {
        this.props.setImageUrl(event.target.value);
    }

    handleRevealChange(event) {
        this.props.setReveal(event.target.value);
    }

    render() {
        const answer = this.props.answer;
        const answerText = answer.get('answer');
        const imageUrl = answer.get('imageUrl');
        const letter = nthLetter(this.props.index);
        const isCorrect = answer.get('correct');
        const classes = classnames({
            'list-group-item': true,
            'list-group-item-success': isCorrect,
            'list-group-item--danger': !isCorrect
        });
        const icon = isCorrect ? tick : cross;

        const setCorrect = (
            <button type="button"
                    key="set_correct"
                    className="btn btn-default"
                    aria-label="Set Correct"
                    disabled={isCorrect ? "disabled" : ""}
                    onClick={this.props.setCorrect}>
                <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
            </button>
        );

        const revealText = isCorrect && (
            <div className="input-group" style={{marginTop: '10px'}}>
                <span className="input-group-addon">Reveal text</span>
                <input className="form-control" 
                       value={this.props.revealText} 
                       placeholder="Enter reveal text here..." 
                       onChange={this.handleRevealChange.bind(this)} />
            </div>
        );
        
        return (
            <li className={classes}>
                <div className="row">
                    <div className="col-md-10">
                        <div className="input-group">
                            <span className="input-group-addon" 
                                  id="basic-addon1">{nthLetter(this.props.index)}</span>
                            <input className="form-control" 
                                   value={answerText}
                                   placeholder="Enter answer text here..." 
                                   onChange={this.handleChange.bind(this)} />
                        </div>

                        {revealText}
                    </div>
                    <div className="col-md-2" style={{textAlign: 'right'}}>
                        <div className="btn-group" role="group">
                            {setCorrect}
                            <button type="button" 
                                    className="btn btn-default" 
                                    onClick={this.props.removeAnswer}
                                    aria-label="Delete">
                                <span className="glyphicon glyphicon-trash" 
                                      aria-hidden="true"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </li>
        );
    }
}
