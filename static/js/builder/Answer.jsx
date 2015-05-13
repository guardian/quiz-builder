import classnames from 'classnames';
import {nthLetter} from './utils';
import React from 'react';
import Thumbnail from './Thumbnail.jsx!';
import FormInput from './FormInput.jsx!';
import includes from 'lodash-node/modern/collection/includes';

class BucketCheckboxes extends React.Component {
    onChange(id) {
        return event => {
            this.props.setHasBucket(id, event.target.checked);
        };
    }

    render() {
        return (
            <div className="form-group">
                {this.props.buckets.map(bucket =>
                (
                    <div className="checkbox" key={bucket.get('id')}>
                        <label>
                            <input type="checkbox"
                                   checked={this.props.hasBucket(bucket.get('id'))}
                                   onChange={this.onChange(bucket.get('id'))}
                                />
                            {bucket.get('title')}
                        </label>
                    </div>
                )
                )}
            </div>
        );
    }
}

export default class Answer extends React.Component {
    handleImageUrlChange(event) {
        this.props.setImageUrl(event.target.value);
    }

    handleRevealChange(event) {
        this.props.setReveal(event.target.value);
    }

    isKnowledge() {
        return this.props.quizType === 'knowledge' || !this.props.quizType;
    }

    isPersonality() {
        return this.props.quizType === 'personality';
    }

    render() {
        const isKnowledge = this.isKnowledge();
        const isPersonality = this.isPersonality();
        const answer = this.props.answer;
        const answerText = answer.get('answer');
        const imageUrl = answer.get('imageUrl');
        const isCorrect = isKnowledge && answer.get('correct');
        let answerBuckets = answer.get('buckets');
        answerBuckets = answerBuckets ? answerBuckets.toJS() : [];
        const classes = classnames({
            'list-group-item': true,
            'list-group-item-success': isCorrect,
            'list-group-item--danger': !isCorrect
        });
        
        const setCorrect = isKnowledge && (
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

        const imageUrlField = this.props.showImages && (
            <div key="image-url-field" className="input-group" style={{marginTop: '10px'}}>
                <span className="input-group-addon" id="basic-addon1">Image URL</span>
                <input className="form-control"
                       value={imageUrl}
                       placeholder="Enter image URL here..."
                       onChange={this.handleImageUrlChange.bind(this)} />
            </div>
        );

        const imageThumbnail = this.props.showImages && (
            <div className="pull-left" style={{paddingRight: '10px'}}>
                <Thumbnail src={imageUrl} />
            </div>
        );

        const buckets = isPersonality && (
            <BucketCheckboxes key="buckets"
                              buckets={this.props.buckets}
                              hasBucket={id => includes(answerBuckets, id)}
                              setHasBucket={this.props.setHasBucket}
                />
        );

        return (
            <li className={classes}>
                <div className="row">
                    <div className="col-md-10">
                        {imageThumbnail}

                        <FormInput name={nthLetter(this.props.index)}
                                   placeholder="Enter answer text here ..."
                                   set={this.props.setText}
                                   value={answerText} />

                        {imageUrlField}

                        {revealText}

                        {buckets}
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
