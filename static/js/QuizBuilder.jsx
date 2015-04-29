import React from 'react';
import Immutable from 'immutable';
import {move, on} from './utils';
import shuffle from 'lodash-node/modern/collection/shuffle';
import map from 'lodash-node/modern/collection/map';
import some from 'lodash-node/modern/collection/some';
import max from 'lodash-node/modern/math/max';
import capitalize from 'lodash-node/modern/string/capitalize';
import debounce from 'lodash-node/modern/function/debounce';
import reqwest from 'reqwest';
import ReorderableList from './ReorderableList.jsx!';
import Question from './Question.jsx!';
import ResultGroups from './ResultGroups.jsx!';
import validate from './schema';
import uuid from 'node-uuid';
import {postJson} from './utils';
import Router from 'react-router';

const {Link} = Router;

const contexts = [
    'questions',
    'responses'
];

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
        
        reqwest({
            url: `/quizzes/${quizId}.json`,
            method: 'get',
            type: 'json',
            success: response => {
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
            }
        });
    }
    
    updateState(f) {
        const nextState = f(this.state);

        if (nextState !== this.state) {
            this.state = nextState;
            this.queueUpdate();
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
            }).bind(this), 3000);
        }

        this._queueUpdate();
    }

    updateQuiz(f) {
        this.updateState(state => state.update('quiz', f));
    }

    reSortGroups() {
        this.updateQuiz(quiz => quiz.update(
            'resultGroups',
            groups => groups.sort(on(group => -group.get('minScore')))
        ));
    }

    addGroup() {
        this.updateQuiz(state => state.update(
            'resultGroups',
            groups => groups.unshift(Immutable.fromJS({
                title: '',
                share: '',
                minScore: groups.size > 0 ? max(map(groups.toJS(), (g) => g.minScore)) + 1 : 0
            }))
        ));
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
            question => question.update(
                'multiChoiceAnswers',
                answers => answers.push(Immutable.fromJS({
                    answer: '',
                    imageUrl: '',
                    correct: answers.size === 0
                }))
            )
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

    decreaseGroupMinScore(index) {
        this.updateQuiz(quiz => quiz.updateIn(
            ['resultGroups', index, 'minScore'],
            score => score - 1
        ));
        this.reSortGroups();
    }

    increaseGroupMinScore(index) {
        this.updateQuiz(quiz => quiz.updateIn(
            ['resultGroups', index, 'minScore'],
            score => score + 1
        ));
        this.reSortGroups();
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
        this.updateQuiz(quiz => quiz.updateIn(
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

    renderTabs() {
        const isActive = (context) => this.state.get('context') === context;
        const className = (context) => isActive(context) ? "active" : null;
        
        return (
            <ul className="nav nav-pills">
                {
                    map(contexts, context => 
                        <li key={context} role="presentation" className={className(context)}><a href="#" onClick={this.setContext.bind(this, context)}>{capitalize(context)}</a></li>
                    )
                }
            </ul>
        );
    }

    renderQuestions() {
        const quiz = this.state.get('quiz');
        
        let questions = quiz.get('questions').map((question, i) => 
            <Question question={question} 
                      key={`question_${i + 1}`} 
                      index={i} 
                      onClose={this.deleteQuestion(i)} 
                      setText={this.setQuestionText(i)}
                      setAnswerText={this.setAnswerText(i)}
                      setAnswerCorrect={this.setAnswerCorrect(i)}
                      setRevealText={this.setRevealText(i)}
                      setImageUrl={this.setQuestionImageUrl(i)}
                      setAnswerImageUrl={this.setAnswerImageUrl(i)}
                      removeAnswer={this.removeAnswer(i)}
                      reorder={this.reorderAnswers(i)}
                      addAnswer={this.addAnswer(i)} />
        ).toJS();

        let questionsHtml;

        if (questions.length > 0) {
            questionsHtml = <div className="quiz-builder__questions">
                <ReorderableList onReorder={this.reorder.bind(this)} components={questions} context="question" />
            </div>;
        } else {
            questionsHtml = <p>Add some questions to get started.</p>
        }

        return (
            <section key="questions" className="quiz-builder__section">
                {questionsHtml}

                <button className="quiz-builder__button" onClick={this.addQuestion.bind(this)}>New question</button> &nbsp;
                <button className="quiz-builder__button" onClick={this.shuffleAnswers.bind(this)}>Shuffle answers</button>
            </section>
        );
    }

    renderResponses() {
        const quiz = this.state.get('quiz');

        return (
            <ResultGroups key="result_groups"
                          groups={quiz.get('resultGroups')}
                          increaseMinScore={this.increaseGroupMinScore.bind(this)}
                          decreaseMinScore={this.decreaseGroupMinScore.bind(this)}
                          numberOfQuestions={quiz.get('questions').size}
                          addGroup={this.addGroup.bind(this)}
                          removeGroup={this.removeGroup.bind(this)}
                          setGroupText={this.setGroupText.bind(this)}
                          setGroupShare={this.setGroupShare.bind(this)}
            />
        );
    }
    
    render() {
        if (this.state.get('isLoaded')) {
            const context = this.state.get('context');
            const title = this.state.getIn(['quiz', 'header', 'titleText']);
            const inner = (context === 'questions') ? 
                          this.renderQuestions() : 
                          this.renderResponses();
            
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
                    
                    <div className="form-group">
                        {this.renderTabs()}
                    </div>

                    {inner}
                </div>
            );
        } else {
            return <p key="loading">Loading ... </p>;
        }
    }
}
