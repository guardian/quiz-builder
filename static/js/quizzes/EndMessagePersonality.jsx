import React from 'react';
import {Share} from './social.jsx!'

export default class EndMessagePersonality extends React.Component {
    render() {
        const personality = this.props.personality;
        const youTube = personality.youtubeId && (
            <p key="youtube">
                <iframe width="320"
                        height="180"
                        src={"https://www.youtube.com/embed/" + personality.youtubeId}
                        frameBorder="0"
                        allowfullscreen></iframe>
            </p>
        );
        const description = personality.description && (
            <div key="description" className="quiz__description">{personality.description}</div>
        );
        const title = personality.href ?
            (
                <a href={personality.href} className="quiz__score">{personality.title}</a>
            ) :
            (
                <span className="quiz__score">{personality.title}</span>
            );

        return (
            <div className="quiz__end-message">
                <div className="quiz__score-message">
                    {title}
                    {description}
                    <Share message={personality.share} />
                    {youTube}
                </div>
            </div>
        );
    }
}