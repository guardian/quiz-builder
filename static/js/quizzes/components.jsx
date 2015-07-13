import React from 'react';

import Aggregate from './Aggregate.jsx!';
import EndMessageKnowledge from './EndMessageKnowledge.jsx!';
import EndMessagePersonality from './EndMessagePersonality.jsx!';
import {countWhere} from './utils';

import './style.css!';
import './social.css!';

import chunk from 'lodash-node/modern/array/chunk';
import zip from 'lodash-node/modern/array/zip';
import includes from 'lodash-node/modern/collection/includes';
import find from 'lodash-node/modern/collection/find';
import findIndex from 'lodash-node/modern/array/findIndex';
import any from 'lodash-node/modern/collection/any';
import map from 'lodash-node/modern/collection/map';
import reduce from 'lodash-node/modern/collection/reduce';
import filter from 'lodash-node/modern/collection/filter';
import forEach from 'lodash-node/modern/collection/forEach';
import compact from 'lodash-node/modern/array/compact';
import take from 'lodash-node/modern/array/take';
import merge from 'lodash-node/modern/object/merge';
import last from 'lodash-node/modern/array/last';
import sortBy from 'lodash-node/modern/collection/sortBy';
import pairs from 'lodash-node/modern/object/pairs';
import startsWith from 'lodash-node/modern/string/startsWith';
import random from 'lodash-node/modern/number/random';

import classnames from 'classnames';
import {cross, tick} from './svgs.jsx!';
import {saveResults, getResults} from './scores';
import {genSrc, genSrcset, genSrc620} from './images';

const quizTypes = ['knowledge', 'personality'];

export class Answer extends React.Component {
    render() {
        const answered = this.props.isAnswered;
        const {correct, isChosen} = this.props.answer;
        const {moreText, isTypeKnowledge, isTypePersonality, pctRight, questionNo, revealAtEnd} = this.props;

        let classesNames = {
                'quiz__answer': true
            },
            icon,
            aggregate,
            more,
            share = null;

        if (answered) {
            classesNames = merge(classesNames, 
                {
                    'quiz__answer--answered': true
                },
                (isTypePersonality || revealAtEnd) ? {
                    'quiz__answer--chosen': isChosen
                } : null,
                (isTypeKnowledge && !revealAtEnd) ? {
                    'quiz__answer--correct': correct,
                    'quiz__answer--correct-chosen': correct && isChosen,
                    'quiz__answer--incorrect-chosen': isChosen && !correct,    
                    'quiz__answer--incorrect': !correct
                } : null
            );

            if ((isTypePersonality && isChosen) || revealAtEnd) {
                icon = <span className={'quiz__answer-icon'}>{tick()}</span>;
            } else if (isTypeKnowledge) {
                if (isChosen || correct) {
                    let symbol = correct ? tick(isChosen ? null : '#43B347') : cross();
                    icon = <span className={'quiz__answer-icon'}>{symbol}</span>;
                }
                if (isChosen) {
                    aggregate = <Aggregate correct={correct} pctRight={pctRight} />
                }
                if (correct) {
                    share = <Share question={questionNo}
                        key="share"
                        message={this.props.answer.share ? this.props.answer.share : this.props.questionText }
                    />;
                    more = moreText ? <div className="quiz__answer__more">{moreText}</div> : null;
                }
            }
        }

        return (
            <a data-link-name={"answer " + (this.props.index + 1)}
               className={classnames(classesNames)}
               onClick={answered ? null : this.props.chooseAnswer}>
                {icon}
                {this.props.answer.imageUrl ? <div className="quiz__answer__image"><img class="quiz__answer__img" src={genSrc(this.props.answer.imageUrl, 160)} /></div> : null}
                {this.props.answer.answer ? this.props.answer.answer : null}
                {more}
                {aggregate}
            </a>
        );
    }
}

function isAnswered(question) {
    return any(question.multiChoiceAnswers, (a) => a.isChosen);
}

function getChosenAnswer(question) {
    return find(question.multiChoiceAnswers, (a) => a.isChosen);
}

function isCorrect(question) {
    return any(question.multiChoiceAnswers, (a) => a.isChosen && a.correct);
}

function more(question) {
    return any(question.multiChoiceAnswers, (a) => a.more);
}

export class Question extends React.Component {
    isAnswered() {
        return isAnswered(this.props.question);
    }

    isCorrect() {
        return isCorrect(this.props.question);
    }

    render() {
        const question = this.props.question,
              aggWrong = this.props.aggregate ? this.props.aggregate[0] : undefined,
              aggRight = this.props.aggregate ? (this.props.aggregate[1] ? this.props.aggregate[1] : 0) : undefined,
              pctRight = this.props.aggregate ? Math.round((aggRight * 100) / (aggWrong + aggRight)) : undefined,
              answers = question.multiChoiceAnswers,
              defaultColumns = this.props.defaultColumns;

        return (
            <div data-link-name={"question " + (this.props.index + 1)}
                        className={classnames({'quiz__question': true, isAnswered: this.isAnswered()})}>

                {question.imageUrl ? <img className="quiz__question__img" src={genSrc620(question.imageUrl)} /> : null}
                {question.imageCredit ? <figcaption className="caption caption--main caption--img quiz__image-caption" itemprop="description" dangerouslySetInnerHTML={{__html: question.imageCredit}} /> : null}
                <h4 className="quiz__question-header">
                    <span className="quiz__question-number">{this.props.index + 1}</span>
                    <span className="quiz__question-text">{question.question}</span>
                </h4>
                <div>
                    {map(
                        chunk(answers, defaultColumns),
                        (thisChunk, chunkI) =>
                            <div className="quiz__question__answer-row">
                                {
                                    map(thisChunk,
                                        (answer, answerI) =>
                                            <Answer
                                                answer={answer}
                                                isAnswered={this.isAnswered()}
                                                pctRight={pctRight}
                                                chooseAnswer={this.props.chooseAnswer.bind(null, answer)}
                                                index={chunkI * 2 + answerI}
                                                key={chunkI * 2 + answerI}
                                                questionNo={this.props.index + 1}
                                                questionText={question.question}
                                                isTypeKnowledge={this.props.isTypeKnowledge}
                                                isTypePersonality={this.props.isTypePersonality}
                                                moreText={question.more}
                                                revealAtEnd={this.props.revealAtEnd}
                                            />
                                    )
                                }
                            </div>)}
                </div>
            </div>
        );
    }
}

export class Quiz extends React.Component {
    constructor(props) {
        super(props);
        var quiz = this;
        this.state = {
            questions: props.questions,
            startTime: new Date()
        };
        this.defaultColumns = props.defaultColumns ? props.defaultColumns : 1;
        this.quizId = props.id;
        this.isTypeKnowledge = props.quizType === 'knowledge' || !props.quizType;
        this.isTypePersonality = props.quizType === 'personality';
        this.resultBuckets = props.resultBuckets;
        getResults(this.quizId).then(function (resp) {
            quiz.aggregate = JSON.parse(resp);
            quiz.forceUpdate();
        });
    }

    chooseAnswer(answer) {
        const emitQuizEvent = (body) => {
            this.emitMessage('quiz/ophan-event', {
                quizId: this.quizId,
                body: body,
                timeElapsed: new Date().getTime() - this.state.startTime.getTime()
            });
        };

        if (!answer.isChosen) {
            answer.isChosen = true;

            emitQuizEvent({
                eventType: 'progressUpdate',
                questions: this.length(),
                questionsAnswered: this.progress()
            });

            if (this.isFinished() && this.isTypeKnowledge) {
                const results = this.resultsKnowledge();
                saveResults(results);

                emitQuizEvent({
                    eventType: 'knowledgeResults',
                    results: results.results,
                    score: results.score
                });
            }
            if (this.isFinished() && this.isTypePersonality) {
                const results = this.resultsPersonality();
                saveResults(results);

                emitQuizEvent({
                    eventType: 'personalityResults',
                    results: results.results,
                    // TODO: refactor all this so it is never called 'score' - it makes no sense
                    bucketIndex: results.score
                });
            }

            this.forceUpdate();
        }
    }

    emitMessage(topic, body) {
        const {mediator} = this.props;
        if (mediator) {
            mediator.emit(topic, body);
        }
    }

    length() {
        return this.state.questions.length;
    }

    isFinished() {
        return this.progress() === this.length();
    }

    progress() {
        return countWhere(this.state.questions, isAnswered);
    }

    getPersonality() {
        const tallies = pairs(reduce(map(this.state.questions, (question) => getChosenAnswer(question)), (acc, answer) => {
                forEach(answer.buckets, (personality) => {
                     acc[personality] = (acc[personality] || 0) + 1;
                });
                return acc; 
            }, {})),
            highScore = last(sortBy(tallies, 1))[1],
            highScorers = map(filter(tallies, (t) => t[1] === highScore), (t) => t[0]),
            highScorer = highScorers[random(0, highScorers.length - 1)],
            bucket = find(this.resultBuckets, {id: highScorer}) || {};

        this.getPersonality = function() { return bucket; }; // memoize

        return bucket;
    }

    scoreKnowledge() {
        return countWhere(this.state.questions, isCorrect);
    }

    endMessageKnowledge() {
        const minScore = (g) => g.minScore === undefined ? Number.NEGATIVE_INFINITY : g.minScore,
              maxScore = (g) => g.maxScore === undefined ? Number.POSITIVE_INFINITY : g.maxScore,
              score = this.scoreKnowledge(),
              message = find(
                  this.props.resultGroups,
                  (group) => score >= minScore(group) && score <= maxScore(group)
              );

        return message ? message : {
            "title": "Well done",
            "share": "I got _/_ on the Guardian quiz."
        };
    }

    resultsKnowledge() {
        return {
            quizId: this.quizId,
            results: map(this.state.questions, (question) => isCorrect(question) ? 1 : 0),
            score: this.scoreKnowledge(),
            timeTaken: 0
        };
    }

    resultsPersonality() {
        return {
            quizId: this.quizId,
            results: map(this.state.questions, (question) => findIndex(question.multiChoiceAnswers, (answer) => answer.isChosen)),
            score: findIndex(this.resultBuckets, this.getPersonality()),
            timeTaken: 0
        };
    }

    render() {
        const elEmbed = document.getElementsByClassName('element-embed')[0];

        if (elEmbed) {
            elEmbed.style.display = 'none';
        }

        if (this.isTypeKnowledge || this.isTypePersonality) {
            return <div data-link-name="quiz" className="quiz">
                {map(
                    zip(this.state.questions, this.aggregate ? take(this.aggregate.results, this.state.questions.length) : []),
                    (question, i) => <Question
                        question={question[0]}
                        aggregate={question[1]}
                        chooseAnswer={this.chooseAnswer.bind(this)}
                        index={i}
                        key={i}
                        isTypePersonality={this.isTypePersonality}
                        isTypeKnowledge={this.isTypeKnowledge}
                        revealAtEnd={this.props.revealAtEnd}
                        defaultColumns={this.defaultColumns} />)}

                {this.isFinished() && this.isTypeKnowledge ?
                    <EndMessageKnowledge
                        message={this.endMessageKnowledge()}
                        score={this.scoreKnowledge()}
                        length={this.length()}
                        histogram={this.aggregate ? this.aggregate.scoreHistogram : undefined}
                        key="end_message" /> : null}

                {this.isFinished() && this.isTypePersonality ?
                    <EndMessagePersonality
                        personality={this.isTypePersonality ? this.getPersonality() : null}
                        key="end_message" /> : null}
            </div>;
        } else {
            return <div>Unknown or unspecified "quizType" property. Should be one of: {quizTypes.join(', ')}.</div>
        }
    }
}
