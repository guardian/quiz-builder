import React from 'react';
import Router from 'react-router';
import qwery from 'qwery';
import QuizBuilder from './QuizBuilder.jsx!';
import {routes} from './Routes.jsx!';

const el = qwery('.js-quiz-builder-placeholder')[0];

Router.run(routes, Router.HistoryLocation, function (Handler) {
    React.render(React.createElement(Handler, null), document.body);
});
