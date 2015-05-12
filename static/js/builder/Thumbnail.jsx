import React from 'react';

export default class Thumbnail extends React.Component {
    render() {
        const style = {
            width: '130px',
            height: '100px'
        };

        return (
            <img src={this.props.src || "/assets/images/no-image.png"}
             alt=""
             className="img-thumbnail"
             style={style}
            />
        );
    }
}