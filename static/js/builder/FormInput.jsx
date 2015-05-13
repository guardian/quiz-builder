import React from 'react';
import classnames from 'classnames';

function fromTargetValue(f) {
    return (event) => f(event.target.value);
}

export default class FormInput {
    render() {
        const classes = classnames({
            'input-group': true,
            'input-group-lg': this.props.isLarge
        });

        return (
            <div className={classes}>
                <span className="input-group-addon">{this.props.name}</span>
                <input className="form-control"
                       onChange={fromTargetValue(this.props.set)}
                       value={this.props.value}
                       placeholder={this.props.placeholder || `Enter ${this.props.name.toLowerCase()} here ...`} />
            </div>
        );
    }
}