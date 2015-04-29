import React from 'react';
import some from 'lodash-node/modern/collection/some';

export default class ButtonDropdown extends React.Component {

    render() {
        
        
        return (
            <div className="btn-group">
                <button type="button" 
                        className="btn btn-default dropdown-toggle"
                        data-toggle="dropdown" 
                        aria-expanded="false">
                    
                    <span className="caret"></span>
                </button>
            </div>
        );
    }
};
