import React from 'react';
import FormInput from './FormInput.jsx!';
import Thumbnail from './Thumbnail.jsx!';

class Bucket extends React.Component {
    render() {
        const bucket = this.props.bucket;

        return (
            <div className="panel panel-default">
                <div className="panel-body">
                    <div className="form-group">
                        <FormInput name="Title"
                                   set={this.props.setTitle}
                                   value={bucket.get('title')}
                                   isLarge={true} />
                    </div>

                    <div className="pull-right" style={{paddingLeft: '10px'}}>
                        <Thumbnail src={bucket.get('imageUrl')} />
                    </div>

                    <div className="form-group">
                        <FormInput name="Image URL"
                                   set={this.props.setImageUrl}
                                   value={bucket.get('imageUrl')} />
                    </div>

                    <div className="form-group">
                        <FormInput name="Description"
                                   set={this.props.setDescription}
                                   value={bucket.get('description')} />
                    </div>

                    <div className="form-group">
                        <FormInput name="Share"
                                   set={this.props.setShare}
                                   value={bucket.get('share')} />
                    </div>

                    <div className="form-group">
                        <FormInput name="Link"
                                   set={this.props.setHref}
                                   value={bucket.get('href')} />
                    </div>

                    <div className="form-group">
                        <div className="btn-toolbar text-right" role="toolbar">
                            <button type="button"
                                    className="btn btn-default"
                                    onClick={this.props.delete}>
                                Delete bucket
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default class Buckets extends React.Component {
    render() {
        if (this.props.quiz.get('quizType') !== 'personality') {
            return (
                <p>Only personality quizzes have buckets.</p>
            );
        }

        const buckets = this.props.quiz.get('resultBuckets').map((bucket, n) =>
            <Bucket bucket={bucket}
                    key={bucket.get('id')}
                    delete={this.props.deleteBucket.bind(null, n)}
                    setTitle={this.props.setBucketField("title")(n)}
                    setDescription={this.props.setBucketField("description")(n)}
                    setShare={this.props.setBucketField("share")(n)}
                    setImageUrl={this.props.setBucketField("imageUrl")(n)}
                    setHref={this.props.setBucketField("href")(n)}
                />
        ).toJS();

        return (
            <div className="buckets">
                {buckets}
                <div className="btn-toolbar" role="toolbar">
                    <button className="btn btn-default"
                            onClick={this.props.addBucket}>
                        Add bucket
                    </button>
                </div>
            </div>
        );
    }
}