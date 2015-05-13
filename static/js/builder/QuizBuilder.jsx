import React from 'react';
import Immutable from 'immutable';
import {move, on} from './utils';
import shuffle from 'lodash-node/modern/collection/shuffle';
import map from 'lodash-node/modern/collection/map';
import some from 'lodash-node/modern/collection/some';
import without from 'lodash-node/modern/array/without';
import max from 'lodash-node/modern/math/max';
import capitalize from 'lodash-node/modern/string/capitalize';
import debounce from 'lodash-node/modern/function/debounce';
import reqwest from 'reqwest';
import Question from './Question.jsx!';
import ResultGroups from './ResultGroups.jsx!';
import uuid from 'node-uuid';
import {postJson, getJson} from './utils';
import Router from 'react-router';

const {Redirect, RouteHandler, Link} = Router;

function sortByScore(groups) {
    return groups.sort(on(group => -group.get('minScore')));
}

export default class QuizBuilder extends React.Component {
    constructor(props) {
        super(props);

        this.state = Immutable.fromJS({
            id: props.params.quizId,
            quiz: null,
            isLoaded: false,
            lastUpdated: null,
            context: 'questions'
        });
    }

    componentDidMount() {
        const quizId = this.state.get('id');
        
        getJson(`/quizzes/${quizId}.json`).then(response => {
            if (React.findDOMNode(this)) {
                this.state = Immutable.fromJS({
                    id: quizId,
                    isLoaded: true,
                    quiz: response.quiz,
                    lastUpdated: response.updatedAt || response.createdAt,
                    context: 'questions'
                });
                this.forceUpdate();
            }
        });
    }
    
    updateState(f) {
        const nextState = f(this.state);

        if (nextState !== this.state) {
            this.state = nextState;
            this.forceUpdate();
        }
    }

    queueUpdate() {
        if (!this._queueUpdate) {
            this._queueUpdate = debounce((function () {
                const id = this.state.get('id');
                
                postJson(`/quizzes/${id}.json`, {
                    quiz: this.state.get('quiz').toJS()
                }).then(json => this.state.set('lastUpdated', json.updatedAt));
            }).bind(this), 1000);
        }

        this._queueUpdate();
    }

    updateQuiz(f) {
        const previousState = this.state;

        this.updateState(state => state.update('quiz', f));

        if (this.state !== previousState) {
            this.queueUpdate();
        }
    }

    reSortGroups() {
        this.updateQuiz(quiz => quiz.update(
            'resultGroups',
            sortByScore
        ));
    }

    addGroup(minScore) {
        this.updateQuiz(state => state.update(
            'resultGroups',
            groups => sortByScore(groups.unshift(Immutable.fromJS({
                title: '',
                share: '',
                minScore: minScore
            })))
        ));
    }

    addBucket() {
        this.updateQuiz(quiz => quiz.update(
            'resultBuckets',
            buckets => buckets.push(Immutable.fromJS({
                id: uuid.v4(),
                title: "",
                description: "",
                href: "",
                share: "",
                imageUrl: ""
            }))
        ));
    }

    deleteBucket(n) {
        this.updateQuiz(quiz => quiz.update(
            'resultBuckets',
            buckets => buckets.remove(n)
        ))
    }
    
    deleteQuestion(n) {
        return () => this.updateQuiz(state => state.update(
            'questions',
            questions => questions.remove(n)
        ));
    }

    setQuestionText(n) {
        return (text) => this.updateQuiz(state => state.updateIn(
            ['questions', n],
            question => question.set('question', text)
        ));
    }

    addAnswer(questionNumber) {
        return () => this.updateQuiz(state => state.updateIn(
            ['questions', questionNumber],
            question => question.update('multiChoiceAnswers', answers => {
                const answer = this.state.getIn(['quiz', 'quizType']) === 'personality' ? Immutable.fromJS({
                    answer: '',
                    imageUrl: '',
                    buckets: []
                }) : Immutable.fromJS({
                    answer: '',
                    imageUrl: '',
                    correct: answers.size === 0
                });

                return answers.push(answer);
            })
        ));
    }

    removeAnswer(questionNumber) {
        const ensureCorrectExists = (answers) => {
            if (answers.size === 0 || some(answers.toJS(), answer => answer.correct)) {
                return answers;
            } else {
                return answers.update(0, a => a.set('correct', true));
            }
        };
        
        return (answerNumber) => this.updateQuiz(state => state.updateIn(
            ['questions', questionNumber, 'multiChoiceAnswers'],
            answers => ensureCorrectExists(answers.remove(answerNumber))
        ));
    }

    setBucketField(fieldName) {
        return (n) => (fieldValue) => this.updateQuiz(quiz => quiz.setIn(
            ['resultBuckets', n, fieldName],
            fieldValue
        ));
    }

    setAnswerText(questionNumber) {
        return (answerNumber) => (text) => this.updateQuiz(state => state.setIn(
            ['questions', questionNumber, 'multiChoiceAnswers', answerNumber, 'answer'],
            text
        ));
    }

    setAnswerCorrect(questionNumber) {
        return (answerNumber) => this.updateQuiz(state => state.updateIn(
            ['questions', questionNumber, 'multiChoiceAnswers'],
            answers => answers.map((answer, i) => answer.set('correct', i === answerNumber))
        ));
    }

    setAnswerHasBucket(questionNumber) {
        return (answerNumber) => (bucketId, isPresent) => this.updateQuiz(state => state.updateIn(
            ['questions', questionNumber, 'multiChoiceAnswers', answerNumber, 'buckets'],
            buckets => {
                const bucketsWithoutId = Immutable.fromJS(without(buckets ? buckets.toJS() : [], bucketId));

                if (isPresent) {
                    return bucketsWithoutId.push(bucketId);
                } else {
                    return bucketsWithoutId;
                }
            }
        ));
    }

    setRevealText(questionNumber) {
        return (text) => this.updateQuiz(state => state.setIn(
            ['questions', questionNumber, 'more'],
            text
        ));
    }

    addQuestion() {
        this.updateQuiz(state => state.update(
            'questions', 
            questions => questions.push(Immutable.fromJS({
                question: "",
                imageUrl: "",
                more: "",
                multiChoiceAnswers: []
            }))
        ));
    }

    reorder(dragIndex, dropIndex) {
        this.updateQuiz(quiz => quiz.update(
            'questions',
            questions => move(questions, dragIndex, dropIndex)
        ));
    }

    reorderAnswers(questionNumber) {
        return (dragIndex, dropIndex) => {
            this.updateQuiz(quiz => quiz.updateIn(
                ['questions', questionNumber, 'multiChoiceAnswers'],
                answers => move(answers, dragIndex, dropIndex)
            ));
        }
    }

    setQuestionImageUrl(questionNumber) {
        return (imageUrl) => this.updateQuiz(quiz => quiz.setIn(
            ['questions', questionNumber, 'imageUrl'],
            imageUrl
        ));
    }

    setAnswerImageUrl(questionNumber) {
        return (answerNumber) => (imageUrl) => this.updateQuiz(quiz => quiz.setIn(
            ['questions', questionNumber, 'multiChoiceAnswers', answerNumber, 'imageUrl'],
            imageUrl
        ));
    }

    removeGroup(index) {
        this.updateQuiz(quiz => quiz.update('resultGroups', groups => groups.remove(index)));
    }

    setGroupText(index) {
        return (text) => this.updateQuiz(quiz => quiz.setIn(
            ['resultGroups', index, 'title'],
            text
        ));
    }

    setGroupShare(index) {
        return (shareText) => this.updateQuiz(quiz => quiz.setIn(
            ['resultGroups', index, 'share'],
            shareText
        ));
    }

    shuffleAnswers() {
        this.updateQuiz(quiz => quiz.update(
            'questions',
            questions => questions.map(question => question.update(
                'multiChoiceAnswers',
                answers => Immutable.fromJS(shuffle(answers.toJS()))
            ))
        ));
    }

    onChangeTitle(event) {
        this.updateQuiz(quiz => quiz.setIn(
            ['header', 'titleText'],
            event.target.value
        ));
    }

    setContext(context, event) {
        if (event) {
            event.stopPropagation();
        }
        
        this.updateState(state => state.set('context', context));
    }

    tabKey() {
        const {router} = this.context;
        const routes = router.getCurrentRoutes();
        return routes[routes.length - 1].name;
    }

    contexts() {
        if (this.state.getIn(['quiz', 'quizType']) === 'personality') {
            return [
                'questions',
                'reorder',
                'buckets',
                'preview'
            ];
        } else {
            return [
                'questions',
                'reorder',
                'responses',
                'preview'
            ];
        }
    }
    
    renderTabs() {
        const id = this.state.get('id');
        const currentContext = this.tabKey() || 'questions';
        const isActive = (context) => context === currentContext;
        const className = (context) => isActive(context) ? "active" : null;
        const nQuestions = this.state.getIn(['quiz', 'questions']).size;
        const buckets = this.state.getIn(['quiz', 'resultBuckets']);
        const nBuckets = buckets ? buckets.size : 0;
        const title = (context) => {
            const byContext = {
                questions: `Questions (${nQuestions})`,
                buckets: `Buckets (${nBuckets})`
            };

            return byContext[context] || capitalize(context);
        };
        
        return (
            <ul className="nav nav-pills">
                {map(this.contexts(), context =>
                    <li key={context} role="presentation" className={className(context)}>
                        <Link to={`/quizzes/${id}/${context}`} onClick={this.setContext.bind(this, context)}>
                            {title(context)}
                        </Link>
                    </li>
                 )}
            </ul>
        );
    }
    
    render() {
        if (this.state.get('isLoaded')) {
            const quiz = this.state.get('quiz');
            const context = this.state.get('context');
            const title = this.state.getIn(['quiz', 'header', 'titleText']);
            
            return (
                <div key="quiz_builder" className="quiz-builder">
                    <ol className="breadcrumb">
                        <li><Link to="/">Home</Link></li>
                        <li className="active">{title}</li>
                    </ol>

                    <div className="form-group">
                        <div className="input-group input-group-lg">
                            <span className="input-group-addon">Title</span>
                            <input id="title" 
                                   className="form-control"
                                   value={title} 
                                   onChange={this.onChangeTitle.bind(this)} />
                        </div>
                    </div>
                    
                    <div className="form-group">{this.renderTabs()}</div>

                    <RouteHandler quiz={quiz}
                                  reorderQuestions={this.reorder.bind(this)}
                                  setGroupText={this.setGroupText.bind(this)}
                                  setGroupShare={this.setGroupShare.bind(this)}
                                  removeGroup={this.removeGroup.bind(this)}
                                  deleteQuestion={this.deleteQuestion.bind(this)}
                                  setQuestionText={this.setQuestionText.bind(this)}
                                  setAnswerText={this.setAnswerText.bind(this)}
                                  setAnswerCorrect={this.setAnswerCorrect.bind(this)}
                                  setRevealText={this.setRevealText.bind(this)}
                                  setQuestionImageUrl={this.setQuestionImageUrl.bind(this)}
                                  setAnswerImageUrl={this.setAnswerImageUrl.bind(this)}
                                  removeAnswer={this.removeAnswer.bind(this)}
                                  reorderAnswers={this.reorderAnswers.bind(this)}
                                  addQuestion={this.addQuestion.bind(this)}
                                  addGroup={this.addGroup.bind(this)}
                                  shuffleAnswers={this.shuffleAnswers.bind(this)}
                                  addBucket={this.addBucket.bind(this)}
                                  deleteBucket={this.deleteBucket.bind(this)}
                                  setBucketField={this.setBucketField.bind(this)}
                                  setAnswerHasBucket={this.setAnswerHasBucket.bind(this)}
                                  addAnswer={this.addAnswer.bind(this)} />
                </div>
            );
        } else {
            return <p key="loading">Loading ... </p>;
        }
    }
}

QuizBuilder.contextTypes = {
    router: React.PropTypes.func
};
